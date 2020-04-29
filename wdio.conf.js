/* eslint-disable no-unused-vars */

const allureReporter = require("./src/utility/customAllure");
const capability = require("./capabilities.json")[process.env.CAPABILITY];
const chai = require("chai");
const shell = require("shelljs");
const glob = require("glob");
const fs = require("fs");
const chalk = require("chalk");
const path = require("path");
const featuresPath = "./test/Product/features/**/*.feature";
let filesWithTags = "";
let build = "";
let tags = [];

// Filter out feature files that don't have specified tags, this prevents unnecessary loading of browser driver
if (process.env.TAG && process.env.TAG !== "" && process.env.TAG !== "@All") {
  const expressionNode = process.env.TAG.match(/(@\w+)/g) || [];
  filesWithTags = glob.sync(featuresPath).map((file) => {
    const content = fs.readFileSync(file, "utf8");
    let found = false;
    if (content.length > 0) {
      const tagsInFile = content.match(/(@\w+)/g) || [];
      tagsInFile.forEach(t => {
        expressionNode.forEach(e => {
          if (e === t) {
            found = true;
          }
        });
      });
    }
    if (found) {
      return file;
    } else {
      return null;
    }
  }).filter(x => x != null);
}

// noinspection JSUnusedLocalSymbols
let configuration = {
  specs: filesWithTags ? filesWithTags : featuresPath,
  exclude: [],
  suites: {
    foo: [""]
  },
  maxInstances: +process.env.PARALLEL,
  capabilities: getCapability(),
  services: [["image-comparison", {
    baselineFolder: path.join(process.cwd(), "./imageComparison/baseline"),
    formatImageName: "{tag}", // {tag}-{logName}-{width}x{height}
    screenshotPath: path.join(process.cwd(), "./imageComparison"),
    savePerInstance: false,
    autoSaveBaseline: true,
    blockOutStatusBar: true,
    blockOutToolBar: true,
    disableCSSAnimation: true
  }]],
  sync: true,
  logLevel: "silent",
  logToStdout: true,
  coloredLogs: true,
  bail: 0,
  screenshotPath: "./results/screenshots/",
  screenshotOnReject: true,
  waitforTimeout: 90000,
  connectionRetryTimeout: 90000,
  connectionRetryCount: 3,
  specFileRetries: 0,
  framework: "cucumber",
  cucumberOpts: {
    require: ["./test/Steps/**/*.steps.js"],
    requireModule: ["@babel/register"],
    format: ["pretty"],
    colors: true,
    backtrace: true,
    failFast: false,
    ignoreUndefinedDefinitions: false,
    name: [],
    snippets: true,
    source: true,
    profile: [],
    strict: true,
    tagExpression: `${process.env.TAG} and @${process.env.VIEW} and not @wip`,
    tagsInTitle: false,
    timeout: 300000,
    tags: []
  },
  reporters: [
    ["allure", {
      outputDir: "./allure-results",
      disableWebdriverStepsReporting: true,
      disableWebdriverScreenshotsReporting: true,
      useCucumberStepReporter: true,
      enableScreenshotDiffPlugin: true
    }]
  ],

  // WebDriverIO specific hooks
  onPrepare: function (config, capabilities) {
    // Cleanup existing screenshots from previous runs
    let Results = path.resolve("./results");
    let allureResults = path.resolve("./allure-results");
    let actualImages = path.resolve("./imageComparison/actual");
    let diffImages = path.resolve("./imageComparison/diff");
    let tempDownloadsPath = path.resolve("./results/tempDownloads/");
    deleteFolderRecursive(Results);
    deleteFolderRecursive(allureResults);
    deleteFolderRecursive(actualImages);
    deleteFolderRecursive(diffImages);
    mkDirByPathSync(tempDownloadsPath);
    // Deals with All tag
    if (process.env.TAG === "@All") {
      process.env.TAG = "";
    }
  },
  onWorkerStart: function (cid, caps, specs, args, execArgv) {
  },
  beforeSession: function (config, capabilities, specs) {
    if (process.env.DRIVER === "remote") {
      try {
        build = capabilities["sauce:options"].build;
      } catch (e) {
        build = capabilities.build;
      }
    }
  },
  before: function (capabilities, specs) {
    global.should = chai.should();
  },
  beforeSuite: function (suite) {
  },
  beforeHook: function (test, context/*, stepData, world*/) {
  },
  afterHook: function (test, context, { error, result, duration, passed, retries }/*, stepData, world*/) {
  },
  beforeTest: function (test, context) {
  },
  beforeCommand: function (commandName, args) {
  },
  afterCommand: function (commandName, args, result, error) {
  },
  afterTest: function (test, context, { error, result, duration, passed, retries }) {
  },
  afterSuite: function (suite) {
  },
  after: function (result, capabilities, specs) {
  },
  afterSession: function (config, capabilities, specs) {
  },
  onComplete: function (exitCode, config, capabilities, results) {
    // Execute Shell Script to copy Allure History, then generate new Allure Report
    if (process.env.DRIVER === "local") {
      shell.cp("-r", "allure-report/history", "./allure-results");
      shell.exec("npx allure generate ./allure-results --clean");
    }
  },
  onReload: function(oldSessionId, newSessionId) {
  },

  // Cucumber specific hooks
  beforeFeature: function (uri, feature, scenarios) {

    if (process.env.DRIVER === "remote") {
      process.stdout.write(`Follow the Full Test Run at https://app.saucelabs.com/tests/${browser.sessionId}\n`);
      allureReporter.addSauceLabsLinks(true, "show video");
    }
    if (this.maxInstances === 1 && process.env.JENKINS === "disabled") {
      process.stdout.write(chalk.magenta.bold("Feature: " + feature.document.feature.name) + "\n");
    }
  },
  beforeScenario: function (uri, feature, scenario, sourceLocation) {
    tags = scenario.tags.map(tagObject => tagObject.name);

    if (tags.includes("@accessibility")) global.accessibilityErrors = 0;

    if (build !== "") allureReporter.addBuild(build);

    if (browser.capabilities.browserName.toLowerCase() !== "safari") browser.deleteAllCookies();
    else deleteAllSafariCookies();

    if (process.env.DRIVER === "local" && process.env.VIEW === "LV" && !isMobile()) {
      browser.setWindowSize(1600, 900);
    } else if (process.env.DRIVER === "local" && process.env.VIEW === "SV" && !isMobile()) {
      browser.setWindowSize(350, 600);
    }

    if (this.maxInstances === 1 && process.env.JENKINS === "disabled") {
      process.stdout.write(chalk.magenta("  Scenario: " + scenario.name) + "\n");
    }
  },
  beforeStep: function ({ uri, feature, step }, context) {
    if (tags.includes("@animations")) waitForAnimations();
    if (this.maxInstances === 1 && process.env.JENKINS === "disabled") {
      process.stdout.write("    " + chalk.green(step.step.keyword + step.step.text) + "\n");
    }
  },
  afterStep: function ({ uri, feature, step }, context, { error, result, duration, passed }) {
    // Check if DEMOTIME is set. Wait in seconds for DEMOTIME after every step.
    if (process.env.DEMOTIME > 0 && process.env.JENKINS === "disabled") browser.pause(process.env.DEMOTIME * 1000);

    if (passed !== true) {
      if (this.maxInstances === 1 && process.env.JENKINS === "disabled") {
        process.stdout.write(chalk.red(step.step.keyword + step.step.text) + "\n");
        process.stdout.write(chalk.red(error) + "\n");
      }
      takeScreenshot(step.scenario.name);
    }
  },
  afterScenario: function (uri, feature, scenario, result, sourceLocation) {
    if (this.maxInstances === 1 && process.env.JENKINS === "disabled") process.stdout.write("\n");
  },
  afterFeature: function (uri, feature, scenarios) {
    if (process.env.DRIVER === "remote") {
      allureReporter.addSauceLabsLinks(true, "show video");
    }
    if (process.env.DRIVER === "remote" && this.maxInstances === 1 && process.env.JENKINS === "disabled") {
      process.stdout.write(`Check out the Full Test Run at https://app.saucelabs.com/tests/${browser.sessionId}\n`);
    }
  }
};

if (process.env.DRIVER === "remote") {
  configuration.services.push(["sauce", { region: "us" }]);
  configuration.user = process.env.SAUCEUSER;
  configuration.key = process.env.SAUCEKEY;
} else if (process.env.CAPABILITY === "androidEmulatorLocal" || process.env.CAPABILITY === "iPadSimulatorLocal") {
  configuration.services.push(["appium"]);
  configuration.port = 4723
} else {
  configuration.services.push(["selenium-standalone"]);
}

if (configuration.maxInstances > 1 || process.env.JENKINS === "enabled")
  configuration.reporters.push(
    ["spec", {
      outputDir: "./results/spec",
      stdout: true
    }]);
if (process.env.JENKINS === "enabled") configuration.specFileRetries = 2;

function getCapability() {

  if (process.env.CAPABILITY.includes("multiDesktop")) {
    // If Windows > Include Microsoft Edge
    if (process.platform === "win32") {
      return [
        require("./capabilities.json")["chrome"],
        require("./capabilities.json")["firefox"],
        require("./capabilities.json")["edge"]
      ];
      // If MacOS > Include Safari
    } else if (process.platform === "darwin") {
      return [
        require("./capabilities.json")["chrome"],
        require("./capabilities.json")["firefox"],
        require("./capabilities.json")["safari"]
      ];
    }
  } else if (process.env.CAPABILITY.includes("multiRemoteDesktop")) {
    return [
      require("./capabilities.json")["chromeSauceLabs"],
      require("./capabilities.json")["firefoxSauceLabs"],
      require("./capabilities.json")["edgeSauceLabs"],
      require("./capabilities.json")["ie11SauceLabs"],
      require("./capabilities.json")["safariSauceLabs"]
    ];
  } else if (process.env.CAPABILITY.includes("multiMobile")) {
    return [
      require("./capabilities.json")["androidEmulator"],
      require("./capabilities.json")["iPhoneSimulator"],
      require("./capabilities.json")["iPhoneXSimulator"]
    ];
  } else if (process.env.CAPABILITY.includes("jenkinsLV")) {
    return [
      require("./capabilities.json")["chromeSauceLabs"],
      require("./capabilities.json")["firefoxSauceLabs"],
      require("./capabilities.json")["edgeSauceLabs"],
      require("./capabilities.json")["ie11SauceLabs"],
      require("./capabilities.json")["safariSauceLabs"],
      require("./capabilities.json")["androidTabEmulator"],
      require("./capabilities.json")["iPadSimulator"]
    ];
  } else if (process.env.CAPABILITY.includes("jenkinsSV")) {
    return [
      require("./capabilities.json")["chromeSauceLabs"],
      require("./capabilities.json")["androidEmulator"],
      require("./capabilities.json")["googlePixel3Emulator"],
      require("./capabilities.json")["iPhoneSimulator"],
      require("./capabilities.json")["iPhone11ProMaxSimulator"]
    ];
  } else {
    return [capability];
  }
}

function deleteAllSafariCookies() {
  let cookies = browser.getAllCookies();
  browser.url("");
  cookies.forEach(cookie => {
    browser.deleteCookie(cookie["name"]);
  });
}

function waitForAnimations() {
  if (browser.getUrl() !== "data:,") {
    browser.waitUntil(() => {
      let state = browser.execute("return document.readyState") || "loading";
      return state.includes("complete");
    }, {
      timeout: 60000,
      timeoutMsg: `Page not loaded completely after waiting ${60000} milliseconds`
    });

    try {
      let state = browser.execute("return jQuery.active === 0");
      if (state !== true) {
        browser.waitUntil(() => {
          return browser.execute("return jQuery.active === 0") === true;
        }, {
          timeout: 60000,
          timeoutMsg: `Animations not completed after waiting ${60000} milliseconds`
        });
        browser.pause(2000);
      }
    } catch (e) {
      // Ignore Missing JQuery Error on some pages.
    }
  }
}

function isMobile() {
  return process.env.CAPABILITY.toLowerCase().includes("android") ||
    process.env.CAPABILITY.toLowerCase().includes("iphone") ||
    process.env.CAPABILITY.toLowerCase().includes("mobile");
}

function takeScreenshot(scenarioName) {
  let scrollLocked = browser.findElements("xpath", "//*[contains(@class,'scroll-locked')]").length > 0;
  let shotPath = browser.config.screenshotPath
    .split(":")[0]
    .replace(/ /g, "");
  let fileName = scenarioName.replace(/ /g, "_") + "-" + process.env.CAPABILITY + "-" + Date.now();
  if (scrollLocked) {
    browser.saveScreen(`${fileName}`, {
      actualFolder: path.join(process.cwd(), shotPath),
      // hideElements: hideElementsArray
    })
  } else {
    browser.saveFullPageScreen(`${fileName}`, {
      actualFolder: path.join(process.cwd(), shotPath),
      // hideElements: hideElementsArray,
      // hideAfterFirstScroll: hideElementsAfterFirstScrollArray
    });
  }
  allureReporter.addScreenshot(`${shotPath}${fileName}.png`);
}

function mkDirByPathSync(targetDir, {isRelativeToScript = false} = {}) {
  const sep = path.sep;
  const initDir = path.isAbsolute(targetDir) ? sep : "";
  const baseDir = isRelativeToScript ? __dirname : ".";

  targetDir.split(sep).reduce((parentDir, childDir) => {
    const curDir = path.resolve(baseDir, parentDir, childDir);
    if (!fs.existsSync(curDir)) {
      fs.mkdirSync(curDir);
    }
    return curDir;
  }, initDir);
}

function deleteFolderRecursive(deletePath) {
  if (fs.existsSync(deletePath)) {
    fs.readdirSync(deletePath).forEach(function (file) {
      let curPath = path.resolve(deletePath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(deletePath);
  }
}

exports.config = configuration;
