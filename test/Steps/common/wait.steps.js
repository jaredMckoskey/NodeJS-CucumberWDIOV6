import { When } from "cucumber";
import Driver from "../../../src/utility/driver";
import Utility from "../../../src/utility/utility";

When(/^I wait for "(.*?)" seconds$/, (seconds) => {
  Driver.wait(seconds);
});

When(/^I wait for the page to load$/, () => {
  Driver.waitForPageLoad();
});

When(/^I wait for animations to finish$/, () => {
  Driver.waitForAjax();
});

When(/^I wait for the "(.*?)" popup to appear$/, (elementName) => {
  const locator = Utility.getLocator(elementName);
  Driver.shouldSeeElement(locator);
});

When(/^I wait for the new window to appear$/, () => {
  Driver.waitForNewWindow();
});

When(/^I wait for the "(.*?)" element not to exist$/, (elementName) => {
  const locator = Utility.getLocator(elementName);
  Driver.waitForElementNotToExist(locator);
  Driver.wait(1);
});

When(/^I wait for "(.*?)" to contain "(.*?)" text$/, (elementName, text) => {
  const locator = Utility.getLocator(elementName);
  Driver.shouldSeeElementWithTextContent(locator, text);
});
