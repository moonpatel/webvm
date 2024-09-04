require("dotenv").config();

function debugLog(message: string) {
  if (process.env.MODE === "DEV") {
    console.log(message);
  }
}
