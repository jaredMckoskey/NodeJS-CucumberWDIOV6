/* eslint-disable no-undef */
/* eslint-disable no-prototype-builtins */

const allureReporter = require("@wdio/allure-reporter").default;
const crypto = require("crypto");
const fs = require("fs");

exports.addSauceLabsLinks = function (useAuthToken = true, video = true) {

  const job_id = `${browser.sessionId}` || new Error("Not a valid sessionId");

  let baseURL = `https://app.saucelabs.com/tests/${job_id}`;

  if (!process.env.SAUCEUSER || !process.env.SAUCEKEY) {
    console.log("Missing env vars: SAUCEUSER,SAUCEKEY");
    return;
  }

  const hash = crypto.createHmac("md5", `${process.env.SAUCEUSER}:${process.env.SAUCEKEY}`)
    .update(job_id)
    .digest("hex");

  let authToken = (useAuthToken) ? `?auth=${hash}` : "";

  allureReporter.addAttachment("Sauce Labs Quick Navigation", `
			<div>
				${(!useAuthToken) ? "Sauce labs credentials are required." : ""}
			<ul>
				<li><a target="_blank" href="${baseURL}${authToken}">Sauce Labs</a></li>
				<li><a target="_blank" href="${baseURL}/watch${authToken}">Video</a></li>
				<li><a target="_blank" href="${baseURL}/network${authToken}">Network Dump</a></li>
			</ul>
			</div>
		`, "text/html");

  if (useAuthToken && video) {
    allureReporter.addAttachment("Video Replay", `
			<div>
				<video controls="" autoplay="" name="media" width="100%">
					<source src="https://assets.saucelabs.com/jobs/${job_id}/video.mp4?auth=${hash}" type="video/mp4">
				</video>
			</div>
	`, "text/html");
  }
};

exports.addBuild = function (build) {
  allureReporter.addArgument("build", build);
};

exports.addIssueLink = function (issue) {
  allureReporter.addTestId(issue);
};

exports.addUserInformation = function (userIndex, userObject) {
  allureReporter.addAttachment(`Using Automation User #${userIndex}`, userObject, "text/plain");
};

exports.addStepInfo = function (description, info) {
  allureReporter.addAttachment(description, info.toString(), "text/plain");
};

exports.addStepError = function (description, error) {
  allureReporter.addAttachment(description, error.toString(), "text/plain");
};

exports.addAnalyticsEvent = function (metric) {
  allureReporter.addAttachment("Analytics Event Found.", metric, "text/plain");
};

exports.addAccessibilityErrors = function (results) {
  results.forEach(result => {
    let resultParsed = `
      <h5>
      <b>Details:</b> ${result.help.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")} <br>
      <b>Reference:</b> <a href="${result.helpUrl}">${result.helpUrl}</a> <br>
      <b>Severity:</b> ${result.impact.toUpperCase()} <br>
      <b>Nodes:</b> ${result.nodes.map(node => node.target)} <br>
      <h6> ${JSON.stringify(result, null, 4)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")}
      </h6> </h5>
      `;
    allureReporter.addAttachment(result.description, resultParsed, "text/html");
  });
};

exports.addScreenshot = function (filePath) {
  allureReporter.addAttachment("screenshot", fs.readFileSync(filePath), "image/png");
};

exports.addImageDiffScreenshots = function (path) {
  let actualPath = `${process.cwd()}/imageComparison/actual/${path}.png`;
  let baselinePath = `${process.cwd()}/imageComparison/baseline/${path}.png`;
  let diffPath = `${process.cwd()}/imageComparison/diff/${path}.png`;
  allureReporter.addAttachment("actual", new Buffer(fs.readFileSync(actualPath), "base64"), "image/png");
  allureReporter.addAttachment("baseline", new Buffer(fs.readFileSync(baselinePath), "base64"), "image/png");
  if (fs.existsSync(diffPath)) {
    allureReporter.addAttachment("diff", new Buffer(fs.readFileSync(diffPath), "base64"), "image/png");
  }
};
