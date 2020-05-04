import { Given, When, Then } from "cucumber";
import Constants from "../../../src/utility/constants";
import Driver from "../../../src/utility/driver";
import Utility from "../../../src/utility/utility";
import Chalk from "chalk";

Given(/^I go to the "(.*?)" page$/, pageName => {
  global.pageContext = Utility.toCamelCase(pageName);
  const url = Utility.getLocator("URL");
  Driver.loadUrl(`https://www.${Constants.getBaseUrl()}${url}`);
  Driver.waitForURL(Constants.getBaseUrl() + url);
  Driver.waitForPageLoad();
});

Then(/^I am on the "(.*?)" page$/, pageName => {
  global.pageContext = Utility.toCamelCase(pageName);
  const url = Utility.getLocator("URL");
  Driver.waitForURL(Constants.getBaseUrl() + url);
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
