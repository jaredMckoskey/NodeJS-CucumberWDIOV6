import { When } from "cucumber";
import Driver from "../../../src/utility/driver";
import Utility from "../../../src/utility/utility";

When(/^I click the "(.*?)" on the page$/, (elementName) => {
  const locator = Utility.getLocator(elementName);
  Driver.clickElement(locator);
});

When(/^I click the first of the "(.*?)" on the page$/, (elementName) => {
  const locator = Utility.getLocator(elementName);
  Driver.clickElementIndex(locator, 0);
});

When(/^I click the second of the "(.*?)" on the page$/, (elementName) => {
  const locator = Utility.getLocator(elementName);
  Driver.clickElementIndex(locator, 1);
});

When(/^I click the last of the "(.*?)" on the page$/, (elementName) => {
  const locator = Utility.getLocator(elementName);
  Driver.clickLastElement(locator);
});

When(/^I click the "(.*?)" on the "(.*?)"$/, (elementName, context) => {
  const locator = Utility.getLocatorInContext(elementName, context);
  Driver.clickElement(locator);
});

// Selects the last option that contains in the value or visible text
When(/^I select the "(.*?)" option from the "(.*?)" dropdown on the page$/, (text, elementName) => {
  const locator = Utility.getLocator(elementName);
  Driver.clickElement(locator);
  Driver.clickElementWithText(`${locator}/option`, text);
});

When(/^I click the "(.*?)" on the page if it exists$/, (elementName) => {
  const locator = Utility.getLocator(elementName);
  // Broke
  Driver.clickElement(locator);
});
