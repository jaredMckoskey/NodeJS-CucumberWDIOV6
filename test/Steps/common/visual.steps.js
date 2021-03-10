import {When, Then} from "cucumber";
import Driver from "../../../src/utility/driver";
import Utility from "../../../src/utility/utility";

When(/^I take a screenshot$/, () => {
  Driver.takeScreenshot();
});

When(/^I take a full page screenshot$/, () => {
  Driver.takeFullPageScreenshot();
});

Then(/^I check the tabbable image of the page against the baseline image$/, () => {
  Driver.assertTabbableImage();
});

Then(/^I check the tabbable image named "(.*?)" of the page against the baseline image$/, (value) => {
  Driver.assertNamedTabbableImage(value);
});

Then(/^I check the image of the "(.*?)" on the page against the baseline image$/, (elementName) => {
  const locator = Utility.getLocator(elementName);
  Driver.assertElementImage(locator, elementName);
});

Then(/^I check the image of the "(.*?)" on the "(.*?)" against the baseline image$/, (elementName, context) => {
  const locator = Utility.getLocatorInContext(elementName, context);
  Driver.assertElementImageInContext(locator, elementName, context);
});

Then(/^I check the image of this page against the baseline image$/, () => {
  Driver.assertScreenImage(global.pageContext);
});
