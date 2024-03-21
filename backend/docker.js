const { exec } = require("child_process");
const { stdout, stderr } = require("process");
const util = require("util");
const exec2 = util.promisify(require("child_process").exec);
const Dockerode = require("dockerode");
const { resolve } = require("path");

const docker = new Dockerode({});

async function pullImage(imageName, tag = "latest") {
  const image = exec(`docker pull ${imageName}:${tag}`);
  const { stdout, stderr } = image;
  console.log("stdout:", stdout);
  console.log("stderr:", stderr);
}

function handleExec(err, stdout, stderr) {
  if (err) {
    console.error(err);
  }
  console.log(stdout);
  console.log(stderr);
}

async function getContainerDetails(containerNameOrId) {
  if (!(await containerExists(containerNameOrId))) return null;
  return new Promise((resolve, reject) => {
    try {
      exec(`docker inspect ${containerNameOrId}`, (err, stdout, stderr) => {
        if (err) {
          reject(err);
        } else {
          const result = JSON.parse(stdout);
          resolve(result[0]);
        }
      });
    } catch (err) {
      reject(err);
    }
  });
}

// accepts either ID or name.
async function containerExists(containerNameOrId) {
  return new Promise((resolve, reject) => {
    exec(`docker inspect ${containerNameOrId}`, (err, stdout, stderr) => {
      resolve(!stderr?.includes("Error: No such object:"));
    });
  });
}

async function getContainerProcess(containerName) {
  return new Promise(async (resolve, reject) => {
    if (!(await containerExists(containerName))) {
      await createContainer(containerName, "ubuntu");
    }
    const containerProcess = exec(
      `docker exec -i ${containerName} bash`,
      handleExec
    );
    // containerProcess.stdin.in
    resolve(containerProcess);
  });
}

/**
 * 
 * @param {string} name 
 * @param {Object} opts 
 * @returns {Promise<Dockerode.Container>}
 */
async function ensureContainer(name, opts) {
  let containerInfo = await getContainer(name);
  if (containerInfo != null) {
    return docker.getContainer(name);
  }
  return new Promise((resolve, reject) => {
    docker
      .createContainer({
        name,
        Image: "ubuntu",
        Entrypoint: ["tail"],
        Cmd: ["-f", "/dev/null"],
      })
      .then((container) => {
        return resolve(container);
      })
      .catch((err) => {
        return reject(err);
      });
  });
}

// ensureContainer('ajs')




async function getContainer(name, opts) {
  try {
    let container = docker.getContainer(name);
    let info = await container.inspect();
    return info;
  } catch (err) {
    if (err?.reason == "no such container") {
      return null;
    } else {
      throw err;
    }
  }
}

module.exports = {
  ensureContainer,
  pullImage,
  containerExists,
  getContainerProcess,
  getContainerDetails,
};
