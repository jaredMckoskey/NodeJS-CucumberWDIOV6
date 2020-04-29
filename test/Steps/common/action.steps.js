import { When } from "cucumber";
import Driver from "../../../src/utility/driver";
import Utility from "../../../src/utility/utility";

When(/^I move the cursor to the first "(.*?)" on the page$/, (elementName) => {
  const locator = Utility.getLocator(elementName);
  Driver.moveToElementsIndex(locator, 0);
});

When(/^I move the cursor to the second "(.*?)" on the page$/, (elementName) => {
  const locator = Utility.getLocator(elementName);
  Driver.moveToElementsIndex(locator, 1);
});
