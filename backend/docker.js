const { exec } = require("child_process");
const { stdout, stderr } = require("process");
const util = require("util");
const exec2 = util.promisify(require("child_process").exec);

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

// (async () => {
//   await getContainerProcess("test");
// })()

async function createContainer(containerName, imageName, port = 80) {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(`Creating container ${containerName}`);
      exec(
        `docker run -d --name ${containerName} ${imageName} tail -f /dev/null`,
        (err, stdout, stderr) => {
          if (stderr?.includes("docker: Error response from daemon: Conflict."))
            reject(
              new Error(`Container named ${containerName} already exists.`)
            );
          else resolve(stdout);
        }
      );
    } catch (err) {
      reject(err);
    }
  });
}

// createContainer("test", "ubuntu:latest", 4000).then(res => console.log(res)).catch(err => console.log(err));

module.exports = {
  createContainer,
  pullImage,
  containerExists,
  getContainerProcess,
  getContainerDetails
};
