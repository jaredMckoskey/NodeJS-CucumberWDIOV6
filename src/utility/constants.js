/* eslint-disable no-unused-vars */

class Constants {
  getLongWait() {
    if (process.env.DRIVER === "local") return 60000;
    else return 120000;
  }

  getMediumWait() {
    if (process.env.DRIVER === "local") return 30000;
    else return 60000;
  }

  getShortWait() {
    if (process.env.DRIVER === "local") return 10000;
    else return 30000;
  }

  getBaseUrl() {
    const env = process.env.TESTENV.toLowerCase();
    switch (env) {
    case "qa":
      return "qa.com";
    case "stage":
      return "stage.com";
    case "prod":
      return ".com";
    case "demo":
      return "";
    default:
      return "";
    }
  }

  getLocatorPath() {
    return process.cwd() + "/src/locators/";
  }

  getTestDataPath() {
    return process.cwd() + "/src/testData/";
  }
}

export default new Constants();
