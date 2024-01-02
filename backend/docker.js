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
  if (!containerExists(containerNameOrId)) return null;
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
  let result = false;
  try {
    const execPromiseVersion = util.promisify(require("child_process").exec);
    const { stdout } = await execPromiseVersion(
      `docker inspect ${containerNameOrId}`
    );
    result = !stdout.includes("Error: No such object:");
    return result;
  } catch (err) {
    if (err?.stderr?.includes("Error: No such object:")) {
      return false;
    }
    throw err;
  }
}

// getContainerDetails("2f5c8457024b").then((res) => console.log(res));

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
      // if (await containerExists(containerName)) {
      //   reject(`${containerName} container already exists.`);
      // }
      exec(
        `docker run -d --name ${containerName} -p ${port}:80 ${imageName} tail -f /dev/null`,
        (err, stdout, stderr) => {
          {
            resolve(stdout);
          }
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
};
