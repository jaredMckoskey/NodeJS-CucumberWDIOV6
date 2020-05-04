import { Then } from "cucumber";
import Driver from "../../../src/utility/driver";
import Utility from "../../../src/utility/utility";

Then(/^I should see "(.*?)" as the page title$/, (value) => {
  Driver.shouldHavePageTitle(value);
});

Then(/^I should see the "(.*?)" on the page$/, (elementName) => {
  const locator = Utility.getLocator(elementName);
  Driver.shouldSeeElement(locator);
});

Then(/^I should see the "(.*?)" on the "(.*?)"$/, (elementName, context) => {
  const locator = Utility.getLocatorInContext(elementName, context);
  Driver.shouldSeeElement(locator);
});

Then(/^I should see the "(.*?)" on the "(.*?)"$/, (elementName, context) => {
  const locator = Utility.getLocatorInContext(elementName, context);
  Driver.shouldSeeElement(locator);
});

Then(/^I should not see the "(.*?)" on the page$/, (elementName) => {
  const locator = Utility.getLocator(elementName);
  Driver.shouldNotSeeElement(locator);
});

Then(/^I should not see the "(.*?)" on the "(.*?)"$/, (elementName, context) => {
  const locator = Utility.getLocatorInContext(elementName, context);
  Driver.shouldNotSeeElement(locator);
});

Then(/^I should not see the "(.*?)" in view on the page$/, (elementName) => {
  const locator = Utility.getLocator(elementName);
  Driver.shouldNotSeeElement(locator);
});

Then(/^I should not see the "(.*?)" in view on the "(.*?)"$/, (elementName, context) => {
  const locator = Utility.getLocatorInContext(elementName, context);
  Driver.shouldNotSeeElement(locator);
});

Then(/^I should see the "(.*?)" with "(.*?)" text on the page$/, (elementName, text) => {
  const locator = Utility.getLocator(elementName);
  Driver.shouldSeeElementWithTextContent(locator, text);
});

Then(/^I should see all the "(.*?)" with "(.*?)" text on the page$/, (elementName, text) => {
  const locator = Utility.getLocator(elementName);
  Driver.shouldSeeAllElementsWithTextContent(locator, text);
});

Then(/^I should see "(.*?)" of the "(.*?)" on the page$/, (count, elementName) => {
  const locator = Utility.getLocator(elementName);
  Driver.shouldSeeCountOfElements(locator, +count);
});

Then(/^I scroll the "(.*?)" on the page into view$/, (elementName) => {
  const locator = Utility.getLocator(elementName);
  Driver.scrollToElement(locator);
});

Then(/^I scroll the "(.*?)" on the "(.*?)" into view$/, (elementName, context) => {
  const locator = Utility.getLocatorInContext(elementName, context);
  Driver.scrollToElement(locator);
});

Then(/^I log any accessibility errors on the page$/, () => {
  Driver.checkAccessibilityErrors();
});

Then(/^I log any accessibility errors with the "(.*?)" on the page$/, (elementName) => {
  let locator = Utility.getLocator(elementName);
  Driver.checkAccessibilityErrorsInContext(locator);
});

Then(/^I should not have any logged accessibility errors$/, () => {
  if (global.accessibilityErrors > 0) {
    throw new Error(`${global.accessibilityErrors} Total Accessibility Errors were found in this test!!!\n`);
  }
});
