import {Given, When, Then} from "cucumber";
import Constants from "../../../src/utility/constants";
import Driver from "../../../src/utility/driver";
import Utility from "../../../src/utility/utility";
import Request from "../../../src/api/request";
import Chalk from "chalk";

Given(/^I go to the "(.*?)" page$/, (pageName) => {
  global.pageContext = Utility.toCamelCase(pageName);
  const url = Utility.getLocator("URL");
  Driver.loadUrl(url);
  // Driver.waitForURL(`https://www.${Constants.getBaseUrl()}${url}`);
  Driver.waitForAjax();
  Driver.wait(1);
});

Then(/^I am on the "(.*?)" page$/, (pageName) => {
  global.pageContext = Utility.toCamelCase(pageName);
});

When(/^I accept the alert$/, () => {
  Driver.acceptAlert();
});

When(/^I dismiss the alert$/, () => {
  Driver.dismissAlert();
});

When(/^I switch to the "(.*?)" frame$/, (frameName) => {
  const iFrame = Utility.getLocator(frameName);
  Driver.switchToFrame(iFrame);
});

When(/^I log the "(.*?)" cookie$/, (cookieName) => {
  process.stdout.write(`The "${Chalk.blue(cookieName)}" cookie is: ${Chalk.magenta(Driver.getCookie(cookieName))}\n`);
});

When(/^I inject the "(.*?)" cookie into the environment$/, (cookieName) => {
  Driver.addCookie(cookieName);
});

When(/^I inject the "(.*?)" environment cookie into the environment$/, (cookieName) => {
  Driver.addEnvCookie(cookieName);
});

When(/^I execute "(.*?)" script into the environment$/, (script) => {
  Driver.executeScript(script);
});

When(/^I execute "(.*?)" script into the environment and log the return value$/, (script) => {
  Driver.getScriptReturnAndLog(script);
});
