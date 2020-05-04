import { When } from "cucumber";
import Driver from "../../../src/utility/driver";
import Utility from "../../../src/utility/utility";

When(/^I enter "(.*?)" into the "(.*?)"$/, (value, elementName) => {
  const locator = Utility.getLocator(elementName);
  switch (value) {
    case "LOCALUSER":
      value = process.env.LOCALUSER;
      break;
    case "LOCALEMAIL":
      value = process.env.LOCALEMAIL;
      break;
    case "LOCALPASS":
      value = process.env.LOCALPASS;
      break;
    default:
      break;
  }
  Driver.fillElementWithText(locator, value);
});

When(/^I enter "(.*?)" in the "(.*?)" on the "(.*?)"$/, (value, elementName, context) => {
  const locator = Utility.getLocatorInContext(elementName, context);
  Driver.fillElementWithText(locator, value);
});

When(/^I enter todays date into the "(.*?)"$/, (elementName) => {
  const locator = Utility.getLocator(elementName);
  const date = Utility.getTodaysDate();
  Driver.getElementValueContent(locator);
  Driver.deleteElementText(locator);
  Driver.clickElement(locator);
  Driver.addValueToElement(locator, `\uE011${date}`); // "\uE011" is HOME key
});

When(/^I delete text from the "(.*?)" input$/, (elementName) => {
  const locator = Utility.getLocator(elementName);
  Driver.deleteElementText(locator);
});

When(/^I delete text from the "(.*?)" input on the "(.*?)"$/, (elementName, context) => {
  const locator = Utility.getLocatorInContext(elementName, context);
  Driver.deleteElementText(locator);
});

When(/^I press the enter key in the "(.*?)"$/, (elementName) => {
  const locator = Utility.getLocator(elementName);
  Driver.sendEnterToElement(locator);
});
