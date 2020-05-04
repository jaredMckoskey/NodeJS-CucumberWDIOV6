/* eslint-disable no-undef */
/* eslint-disable no-prototype-builtins */

import Constants from "./constants";
import Utility from "./utility.js";
import Allure from "./customAllure.js";
import Chalk from "chalk";
import { source } from "axe-core";

/**
 * The Driver is a wrapper around the WebDriverIO 'browser' object.
 * It can be used for both mobile and web.
 * But, it could easily be divided into two drivers: mobile & web.
 *
 * Ex: Driver.clickOnElementWithText(Pages.Login.Element, 'textvalue');
 */
class Driver {

  //<editor-fold defaultstate="collapsed" desc="Mobile">

  /**
   * Checks if tests are running in mobile capability.
   * @returns {boolean}
   */
  isMobile() {
    return process.env.CAPABILITY.includes("android") ||
      process.env.CAPABILITY.includes("iphone") ||
      process.env.CAPABILITY.includes("Mobile");
  }

  /**
   * Checks if tests are running in android capability.
   * @returns {boolean}
   */
  isAndroid() {
    return process.env.CAPABILITY.includes("android");
  }

  /**
   * Waits for Angular on page to load.
   */
  waitForAngularToLoad() {
    // need to fix this.
    browser.pause(1500);
  }

  /**
   * Executes a JQuery event on the given element.
   * @param locator {string} Element to trigger event on.
   * @param event {string} Event to be triggered.
   */
  triggerJQueryEvent(locator, event) {
    $(locator).waitForDisplayed();
    $(locator).waitForEnabled();
    $(locator).execute("$('" + locator + "').trigger('" + event + "')");
  }

  //</editor-fold>

  //<editor-fold defaultstate="collapsed" desc="Browser">

  /**
   * Browser goes to specified URL.
   * @param url {string} URL to go to.
   */
  loadUrl(url) {
    browser.url(url);
  }

  /**
   * Browser returns current active URL.
   * @returns {string} Current URL.
   */
  getURL() {
    return browser.getUrl().toString();
  }

  /**
   * Browser goes to specified URL in new browser tab.
   * @param url {string} URL to go to in new window.
   */
  openTab(url) {
    browser.newWindow(url);
  }

  /**
   * Switch to specified tab number, 0 being main page.
   * @param tab {number} Tab to switch to.
   */
  switchTab(tab) {
    let tabIds = browser.getWindowHandle();
    browser.switchToWindow(tabIds[tab]);
  }

  /**
   * Waits for New Window to appear in browser.
   */
  waitForNewWindow() {
    browser.waitUntil(() => {
      let numTabs = browser.getWindowHandle().length;
      return numTabs > 1;
    }, {
      timeout: Constants.getLongWait(),
      timeoutMsg: `The new window failed to appear after waiting ${Constants.getLongWait()} milliseconds`
    });
  }

  /**
   * Waits for expected URL to be available.
   * @param expected {string} Expected URL.
   */
  waitForURL(expected) {

    expect(browser).toHaveUrl(expected, { containing: true, wait: Constants.getLongWait() });
  }

  /**
   * Waits for document.readyState to return "complete".
   */
  waitForPageLoad() {
    browser.waitUntil(() => {
      let state = browser.execute("return document.readyState") || "loading";
      return state.includes("complete");
    }, {
      timeout: Constants.getLongWait(),
      timeoutMsg: `Page not loaded completely after waiting ${Constants.getLongWait()} milliseconds`
    });
  }

  /**
   * Waits until JQuery active events equals 0.
   */
  waitForAjax() {
    if (browser.getUrl() !== "data:,") {
      try {
        let state = browser.execute("return jQuery.active === 0");
        if (state !== true) {
          browser.waitUntil(() => {
            return browser.execute("return jQuery.active === 0") === true;
          }, {
            timeout: Constants.getLongWait(),
            timeoutMsg: `Animations not completed after waiting ${Constants.getLongWait()} milliseconds`
          });
          browser.pause(2000);
        }
      } catch (e) {
        // Ignore Missing JQuery Error on some pages.
      }
    }
  }

  /**
   * Accepts alert with given wait time.
   * @param waitTime {number} Wait time in seconds.
   */
  acceptAlert(waitTime= 0) {
    this.wait(waitTime ? waitTime : 1);
    browser.acceptAlert();
  }

  /**
   * Dismisses alert with given wait time.
   * @param waitTime {number} Wait time in seconds.
   */
  dismissAlert(waitTime = 0) {
    this.wait(waitTime ? waitTime : 1);
    browser.dismissAlert();
  }

  /**
   * Switches to frame on page.
   * @param frameLocator {string} Frame to switch to.
   */
  switchToFrame(frameLocator) {
    $(frameLocator).waitForExist();
    let frameID = $(frameLocator).value;
    browser.switchToFrame(frameID);
  }

  /**
   * Switches to Root of DOM on page.
   */
  switchToParentFrame() {
    browser.switchToParentFrame();
  }

  /**
   * Waits until selected Cookie is available.
   * @param cookieName {string} Name of Cookie.
   */
  waitForCookie(cookieName) {
    browser.waitUntil(() => {
      return browser.getCookies([cookieName])[0] !== undefined;
    }, {
      timeout: Constants.getMediumWait(),
      timeoutMsg: `Cookie not found after waiting ${Constants.getMediumWait()} milliseconds`
    });
  }

  /**
   * Adds Cookie from testData.json to Environment.
   * @param cookieName {string} Name of Cookie.
   */
  addCookie(cookieName) {
    const cookie = require(Constants.getTestDataPath() + "testData.json")[cookieName];
    browser.setCookies(cookie);
  }

  /**
   * Adds Cookie from testData.json of Environment to Environment.
   * @param cookieName {string} Name of Cookie.
   */
  addEnvCookie(cookieName) {
    const cookie = require(Constants.getTestDataPath() + "testData.json")[process.env.TESTENV][cookieName];
    browser.setCookies(cookie);
  }

  /**
   * Returns String of Cookie Object of declared Cookie Name from the Environment.
   * @param cookieName {string} Name of Cookie.
   * @returns {string} String of Cookie Object.
   */
  getCookie(cookieName) {
    let cookieFull = browser.getCookies([cookieName])[0];
    return `{ "name": "${cookieName}", "value": "${cookieFull.value}" }`;
  }

  /**
   * Returns Cookie Value of declared Cookie Name from the Environment.
   * @param cookieName {string} Name of Cookie.
   * @returns {string} Cookie Value.
   */
  getCookieValue(cookieName) {
    this.waitForCookie(cookieName);
    let cookieFull = browser.getCookies([cookieName])[0];
    return cookieFull.value;
  }

  /**
   * Executes Script in current Environment.
   * @param script {string} String of Script.
   */
  executeScript(script) {
    browser.execute(script);
  }

  /**
   * Returns String of Return Value from the Script Executed in the environment.
   * @param script {String} String of Script.
   * @returns {string} Returns String.
   */
  getScriptReturn(script) {
    return browser.execute(`return ${script}`).toString();
  }
  //</editor-fold>

  //<editor-fold defaultstate="collapsed" desc="Common">

  /**
   * Generic Wait function in seconds.
   * @param waitTime {number} Wait time in seconds.
   */
  wait(waitTime) {
    browser.pause(waitTime * 1000);
  }

  removeScrollLock() {
    const scrollLock = Utility.getLocatorInContext("SCROLL_LOCK", "header")
    if ($(scrollLock).isExisting()) {
      $(scrollLock).$$(scrollLock).forEach(element => {
        let docElement = `document.evaluate("${scrollLock}", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue`
        browser.execute(`${docElement}.setAttribute("class", ${docElement}.getAttribute("class").replace("scroll-locked", ""));`);
        assert.isFalse(element.getAttribute("class").includes("scroll-locked"));
      });
    }
  }

  /**
   * Generic Screenshot function.
   */
  takeScreenshot() {
    const path = require("path");
    const fs = require("fs");
    let shotPath = "./results/screenshots/";
    let fileName = `Screenshot_${process.env.CAPABILITY}${Date.now()}.png`;
    const resolvedPath = path.resolve(shotPath, fileName);
    const dir = path.dirname(resolvedPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    browser.saveScreenshot(shotPath + fileName);
    Allure.addScreenshot(shotPath + fileName);
  }

  /**
   * Generic Full Page Screenshot function.
   */
  takeFullPageScreenshot() {
    const path = require("path");
    let shotPath = browser.config.screenshotPath
      .split(":")[0]
      .replace(/ /g, "");
    let fileName = `fullPage-${global.pageContext}-${process.env.CAPABILITY}-${Date.now()}`;
    browser.saveFullPageScreen(`${fileName}`,{
      actualFolder: path.join(process.cwd(), shotPath),
      hideElements: Utility.getScreenshotHideElements(),
      hideAfterFirstScroll: Utility.getScreenshotHideAfterFirstScrollElements()
    });
    Allure.addScreenshot(`${shotPath}${fileName}.png`);
  }

  /**
   * Generic Tabbable Full Page Screenshot function.
   */
  takeTabbableFullPageScreenshot() {
    const path = require("path");
    let shotPath = browser.config.screenshotPath
      .split(":")[0]
      .replace(/ /g, "");
    let fileName = `tabbableFullPage-${global.pageContext}-${process.env.CAPABILITY}-${Date.now()}`;
    browser.saveTabbablePage(`${fileName}`,{
      actualFolder: path.join(process.cwd(), shotPath),
      hideElements: Utility.getScreenshotHideElements(),
      hideAfterFirstScroll: Utility.getScreenshotHideAfterFirstScrollElements()
    });
    Allure.addScreenshot(`${shotPath}${fileName}.png`);
  }

  //</editor-fold>

  //<editor-fold defaultstate="collapsed" desc="Click">

  /**
   * Clicks element when Displayed, Enabled, Clickable.
   * @param locator {string} Element to be clicked on.
   */
  clickElement(locator) {
    $(locator).waitForDisplayed();
    $(locator).waitForEnabled();
    $(locator).waitForClickable();
    $(locator).click();
  }
  /**
   * Loops through elements with given locator and clicks the one.
   * that contains matching text.
   * @param locator {string} Locator of elements to loop through.
   * @param text {string} Text to find in element to click.
   */
  clickElementWithText(locator, text) {
    let elements = $(locator).$$(locator);
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].getText().trim() === text) {
        elements[i].click();
        break;
      } else if (i === elements.length - 1) throw new Error(`Element with text "${text}" was not found.`);
    }
  }

  /**
   * Clicks the element in elements at the declared index.
   * @param locator {string} Locator of elements.
   * @param index {number} Index of element to click.
   */
  clickElementIndex(locator, index) {
    let elements = $(locator).$$(locator);
    elements[index].waitForDisplayed();
    elements[index].waitForEnabled();
    elements[index].waitForClickable();
    elements[index].click();
  }

  /**
   * Clicks the element in elements at the last index.
   * @param locator {string} Locator of elements.
   */
  clickLastElement(locator) {
    let elements = $(locator).$$(locator);
    elements[elements.length - 1].waitForDisplayed();
    elements[elements.length - 1].waitForEnabled();
    elements[elements.length - 1].waitForClickable();
    elements[elements.length - 1].click();
  }

  /**
   * Clicks on all visible elements by selector. Catches any errors thrown to click other elements.
   * @param locator {string} Locator to find elements to click on.
   */
  clickElementLoop(locator) {
    let elements = $(locator).$$(locator);
    elements.forEach(element => {
      try {
        if (element.isDisplayed() && element.isEnabled() && element.isClickable()) {
          element.click();
        }
      } catch (error) {
        // Leaving block empty
      }
    });
  }

  /**
   * Clicks on given element only if given element exists.
   * @param locator {string} Element to be clicked on.
   */
  clickOnElementIfExists(locator) {
    browser.pause(3000);
    if ($(locator).isExisting()) this.clickWhenVisible(locator);
  }

  //</editor-fold>

  //<editor-fold defaultstate="collapsed" desc="Keys">

  /**
   * Sets value of given element to text.
   * @param locator {string} Element to send text to.
   * @param text {string} Text to be pass into element.
   */
  fillElementWithText(locator, text) {
    $(locator).waitForDisplayed();
    $(locator).waitForEnabled();
    $(locator).setValue(text);
  }

  /**
   * Adds value of given element to text.
   * @param locator {string} Element to send text to.
   * @param text {string} Text to be pass into element.
   */
  addValueToElement(locator, text) {
    $(locator).waitForDisplayed();
    $(locator).waitForEnabled();
    $(locator).addValue(text);
  }

  /**
   * Clears text from given element.
   * @param locator {string} Element to clear text from.
   */
  deleteElementText(locator) {
    $(locator).waitForDisplayed();
    $(locator).waitForEnabled();
    $(locator).clearValue();
  }

  /**
   * Sends 'Enter' key to given element.
   * @param locator {string} Element to send 'Enter' key to.
   */
  sendEnterToElement(locator) {
    $(locator).waitForDisplayed();
    $(locator).keys("\uE007");
  }

  /**
   * Gets the text from given element.
   * @param locator {string} Element to pull text from.
   * @returns {string} text from element.
   */
  getElementTextContent(locator) {
    $(locator).waitForDisplayed();
    return $(locator).getText();
  }

  /**
   * Gets the value from given element.
   * @param locator {string} Element to pull value from.
   * @returns {string} Value from element.
   */
  getElementValueContent(locator) {
    $(locator).waitForDisplayed();
    $(locator).waitForEnabled();
    return $(locator).getValue();
  }

  //</editor-fold>

  //<editor-fold defaultstate="collapsed" desc="Action">

  /**
   * Moves browser view to given element.
   * @param locator {string} Element to move into view.
   * @param xOffset {number} Horizontal offset from element.
   * @param yOffset {number} Vertical offset from element.
   */
  moveToElement(locator, xOffset = 0, yOffset = 0) {
    $(locator).moveTo({ xOffset, yOffset });
  }

  /**
   * Moves browser view to given element.
   * @param locator {string} Element to move into view.
   * @param index {number} Index of desired element.
   */
  moveToElementsIndex(locator, index) {
    $(locator).$$(locator)[index].moveTo();
  }

  /**
   * Scrolls element into view.
   * @param locator {string} Element to scroll into view.
   */
  scrollToElement(locator) {
    $(locator).scrollIntoView();
    $(locator).isDisplayedInViewport();
  }

  scrollLoadPage() {
    while (browser.execute("if((window.innerHeight+window.scrollY)>=document.body.offsetHeight){return true;}") !== true) {
      browser.execute(`window.scrollTo({top: document.body.scrollHeight,left: 0,behavior: 'smooth'});`);
      this.waitForAjax();
      browser.pause(500);
    }
    while (browser.execute(`if((window.innerHeight+window.scrollY)<=${browser.getWindowSize().height}){return true;}`) !== true) {
      browser.execute(`window.scrollTo({top: 0,left: 0,behavior: 'smooth'});`);
      this.waitForAjax();
      browser.pause(500);
    }
  }

  //</editor-fold>

  //<editor-fold defaultstate="collapsed" desc="Assertions">

  /**
   * Asserts page title matches expected title.
   * @param title {string} Title expected on the page.
   */
  shouldHavePageTitle(title) {
    expect(browser).toHaveTitle(title, { wait: Constants.getShortWait() });
  }

  /**
   * Waits for the given element to no longer exist on page. Must have existed first before calling function.
   * @param locator {string} Locator of element to wait for.
   */
  waitForElementNotToExist(locator) {
    try {
      $(locator).waitForExist({ timeout: Constants.getShortWait() }); // Wait for element to exist
    } catch (error) {
      return true;
    } finally {
      expect($(locator)).not.toExist({ wait: Constants.getMediumWait() });
    }
  }

  /**
   * Waits for the given element to no longer be displayed on page. Must have existed first before calling function.
   * @param locator {string} Locator of element to wait for.
   */
  waitForElementNotToBeVisible(locator) {
    try {
      $(locator).waitForDisplayed({ timeout: Constants.getShortWait() }); // Wait for element to be visible
    } catch (error) {
      return true;
    } finally {
      expect($(locator)).not.toBeVisible({ wait: Constants.getMediumWait() });
    }
  }

  /**
   * Check if element is displayed.
   * @param locator {string} Locator of element to check is displayed.
   * @returns {Promise<boolean>} Returns boolean.
   */
  isDisplayed(locator) {
    return $(locator).isDisplayed();
  }

  /**
   * Asserts element is displayed.
   * @param locator {string} Locator of element to check is displayed.
   */
  shouldSeeElement(locator) {
    expect($(locator)).toBeDisplayed({ wait: Constants.getLongWait() });
  }

  /**
   * Asserts number of elements.
   * @param locator {string} Locator of elements.
   * @param count {number} Expected Count.
   */
  shouldSeeCountOfElements(locator, count) {
    expect($(locator).$$(locator)).toBeElementsArrayOfSize(count, { wait: Constants.getLongWait() });
  }

  /**
   * Asserts given element does not exist.
   * @param locator {string} Locator of element to exist.
   */
  shouldNotSeeElement(locator) {
    expect($(locator)).not.toBeDisplayed({ wait: Constants.getMediumWait() });
  }

  /**
   * Asserts given element has specified text.
   * @param locator {string} Locator of element to compare text on.
   * @param text {string} Expected text from element.
   */
  shouldSeeElementWithTextContent(locator, text) {
    $(locator).waitForDisplayed();
    expect($(locator).$$(locator)).toHaveTextContaining(text, { wait: Constants.getMediumWait() });
  }

  /**
   * Asserts given elements have specified text.
   * @param locator {string} Locator of elements to compare text on.
   * @param text {string} Expected text from elements.
   */
  shouldSeeAllElementsWithTextContent(locator, text) {
    $(locator).waitForDisplayed();
    $(locator).$$(locator).map(element => {
      if (!element.getText().includes(text)) {
        element.scrollIntoView();
        expect(element).toHaveTextContaining(text, { wait: Constants.getMediumWait() });
      }
    });
  }

  /**
   * Asserts given element has specified value.
   * @param locator {string} Locator of element to compare value on.
   * @param value {string} Expected value from element.
   */
  shouldSeeElementWithValue(locator, value) {
    $(locator).waitForExist();
    expect($(locator)).toHaveValueContaining(value, { wait: Constants.getMediumWait() });
  }

  /**
   * Scrapes the page and logs any accessibility errors.
   */
  checkAccessibilityErrors() {

    browser.execute(source);

    let results = browser.executeAsync(function (done) {
      axe.run(function (err, results) {
        if (err) done(err);
        done(results);
      });
    });

    if (results.violations.length > 0) {
      global.accessibilityErrors = global.accessibilityErrors + results.violations.length;
      Allure.addAccessibilityErrors(results.violations);
      if (+process.env.PARALLEL === 1 && process.env.JENKINS === "disabled") {
        process.stdout.write(Chalk.red(`${results.violations.length} Accessibility Errors Found!\n`));
      }
    }
  }

  /**
   * Scrapes the given element and logs any accessibility errors.
   * @param locator {string} Locator of element to scrape for accessibility errors.
   */
  checkAccessibilityErrorsInContext(locator) {

    browser.execute(source);

    let results = browser.executeAsync(function (locator, done) {
      axe.run(document.evaluate(locator, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue, function (err, results) {
        if (err) done(err);
        done(results);
      });
    }, locator);

    if (results.violations.length > 0) {
      global.accessibilityErrors = global.accessibilityErrors + results.violations.length;
      Allure.addAccessibilityErrors(results.violations);
      if (+process.env.PARALLEL === 1 && process.env.JENKINS === "disabled") {
        process.stdout.write(Chalk.red(`${results.violations.length} Accessibility Errors Found!\n`));
      }
    }
  }

  /**
   * Asserts given element against baseline screenshot.
   * @param locator {string} Locator of element to assert.
   * @param elementName {string} Name of element to assert.
   */
  assertElementImage(locator, elementName) {

    let build;
    if (browser.capabilities.hasOwnProperty("build")) {
      build = build = `${browser.capabilities.build}`;
    } else build = `${browser.capabilities.browserName}`;

    let filePath = `${process.env.VIEW}/${build}/${global.pageContext}/${elementName}`;

    $(locator).scrollIntoView(true);
    $(locator).isDisplayedInViewport();

    const actual = browser.checkElement($(locator), filePath, {
      scaleImagesToSameSize: true,
      ignoreAntialiasing: true,
      ignoreAlpha: true,
    });

    try {
      assert.isBelow(actual, 1);
    } catch (e) {
      Allure.addImageDiffScreenshots(filePath);
      assert.isBelow(actual, 1, `The image of "${elementName}" on "${global.pageContext}" in "${build}" does not match the Baseline`);
    }
  }

  /**
   * Asserts given element against baseline screenshot in context.
   * @param locator {string} Locator of element to assert.
   * @param elementName {string} Name of element to assert.
   * @param context {string} Name of context where element exists.
   */
  assertElementImageInContext(locator, elementName, context) {

    let build;
    if (browser.capabilities.hasOwnProperty("build")) {
      build = build = `${browser.capabilities.build}`;
    } else build = `${browser.capabilities.browserName}`;

    let filePath = `${process.env.VIEW}/${build}/${global.pageContext}/${context}/${elementName}`;

    $(locator).scrollIntoView(true);
    $(locator).isDisplayedInViewport();

    const actual = browser.checkElement($(locator), filePath, {
      scaleImagesToSameSize: true,
      ignoreAntialiasing: true,
      ignoreAlpha: true,
      hideScrollBars: true
    });

    try {
      assert.isBelow(actual, 1);
    } catch (e) {
      Allure.addImageDiffScreenshots(filePath);
      assert.isBelow(actual, 1, `The image of "${elementName}" of "${context}" on "${global.pageContext}" in "${build}" does not match the Baseline`);
    }
  }

  /**
   * Asserts current screen against baseline screenshot.
   * @param pageName {string} Name of page for screenshot.
   */
  assertScreenImage(pageName) {

    let browserName = browser.capabilities.browserName;

    const actual = browser.checkScreen(`${process.env.VIEW}/${build}/${pageName}/${pageName}-screen`, {
      ignoreAntialiasing: true,
      ignoreAlpha: true,
      scaleImagesToSameSize: true,
      hideElements: Utility.getScreenshotHideElements(),
      hideAfterFirstScroll: Utility.getScreenshotHideAfterFirstScrollElements()
    });

    try {
      assert.isBelow(actual, 1);
    } catch (e) {
      assert.isBelow(actual, 1, `The image of "${pageName}" in "${browserName}" does not match the Baseline`);
    }
  }

  /**
   * Asserts tabbable page image against baseline screenshot.
   */
  assertTabbableImage() {

    let build;
    if (browser.capabilities.hasOwnProperty("build")) {
      build = build = `${browser.capabilities.build}`;
    } else build = `${browser.capabilities.browserName}`;

    let filePath = `${process.env.VIEW}/${build}/${global.pageContext}/tabbableScreenshots/tabbableScreenshot`;

    this.removeScrollLock();
    this.scrollLoadPage();

    const actual = browser.checkTabbablePage(filePath, {
      scaleImagesToSameSize: true,
      ignoreAntialiasing: true,
      ignoreAlpha: true,
    });

    try {
      assert.isBelow(actual, 1);
      Allure.addScreenshot(`${filePath}.png`);
    } catch (e) {
      Allure.addImageDiffScreenshots(filePath);
      assert.isBelow(actual, 1, `The tabbable image of "${global.pageContext}" does not match the Baseline`);
    }
  }

  /**
   * Asserts named tabbable page image against named baseline screenshot.
   * @param value {string} Value of the name.
   */
  assertNamedTabbableImage(value) {

    let build;
    if (browser.capabilities.hasOwnProperty("build")) {
      build = build = `${browser.capabilities.build}`;
    } else build = `${browser.capabilities.browserName}`;

    let filePath = `${process.env.VIEW}/${build}/${global.pageContext}/tabbableScreenshots/${value}`;

    this.removeScrollLock();
    this.scrollLoadPage();

    const actual = browser.checkTabbablePage(filePath, {
      scaleImagesToSameSize: true,
      ignoreAntialiasing: true,
      ignoreAlpha: true,
    });

    try {
      assert.isBelow(actual, 1);
      Allure.addScreenshot(`${filePath}.png`);
    } catch (e) {
      Allure.addImageDiffScreenshots(filePath);
      assert.isBelow(actual, 1, `The tabbable image of "${global.pageContext}" named "${value}" does not match the Baseline`);
    }
  }

  //</editor-fold>
}

export default new Driver();
