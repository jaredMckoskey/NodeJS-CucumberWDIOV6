import Constants from "./constants";

class Utility {

  /**
   * returns string mutated to camel case.
   * @param string {string} String to mutate.
   * @returns {string} Camel cased string.
   */
  toCamelCase(string) {
    return string.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
      if (+match === 0) return "";
      return index === 0 ? match.toLowerCase() : match.toUpperCase();
    });
  }

  toUpperSnakeCase(string) {
    return string && string
      .replace(/ /g, "_")
      .toUpperCase();
  }

  /**
   * Compresses current page object then extracts and returns locator of given element name.
   * @param elementName {string} Name of element in page object.
   * @returns {string} locator of given element name.
   */
  getLocator(elementName) {
    const locatorObject = require(Constants.getLocatorPath() + `${this.toCamelCase(global.pageContext)}.json`);
    const mergedLocators = {};
    const elementNameSnake = this.toUpperSnakeCase(elementName);

    Object.keys(locatorObject).forEach(node => Object.assign(mergedLocators, locatorObject[node]));

    if (process.env.VIEW === "SV" && mergedLocators.hasOwnProperty(elementNameSnake + "_SV")) {
      return mergedLocators[elementNameSnake + "_SV"];
    } else if (mergedLocators.hasOwnProperty(elementNameSnake)) {
      return mergedLocators[elementNameSnake];
    } else throw new Error(`Unable to find locator "${elementNameSnake}" in the "${this.toCamelCase(global.pageContext)}.json"!`);
  }

  /**
   * Compresses context page object then extracts and returns locator of given element name.
   * @param elementName {string} Name of element in page object.
   * @param context {string} Context of page object.
   * @returns {string} locator of given element name.
   */
  getLocatorInContext(elementName, context) {
    const locatorObject = require(Constants.getLocatorPath() + `${this.toCamelCase(context)}.json`);
    const mergedLocators = {};
    const elementNameSnake = this.toUpperSnakeCase(elementName);

    Object.keys(locatorObject).forEach(node => Object.assign(mergedLocators, locatorObject[node]));

    if (process.env.VIEW === "SV" && mergedLocators.hasOwnProperty(elementNameSnake + "_SV")) {
      return mergedLocators[elementNameSnake + "_SV"];
    } else if (mergedLocators.hasOwnProperty(elementNameSnake)) {
      return mergedLocators[elementNameSnake];
    } else throw new Error(`Unable to find locator "${elementNameSnake}" in the "${this.toCamelCase(context)}.json"!`);
  }

  getScreenshotHideElements() {}

  getScreenshotHideAfterFirstScrollElements() {}

  /**
   * Gets today's date.
   * @returns {string} Today's Date.
   */
  getTodaysDate() {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1; //January is 0!
    let yyyy = today.getFullYear();

    if (dd < 10) {
      dd = `0${dd}`;
    }
    if (mm < 10) {
      mm = `0${mm}`;
    }
    return `${yyyy}-${mm}-${dd}`;
  }
}

export default new Utility();
