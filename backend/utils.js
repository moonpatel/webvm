require("dotenv").config();

function debugLog(message) {
  if (process.env.MODE === "DEV") {
    console.log(message);
  }
}
