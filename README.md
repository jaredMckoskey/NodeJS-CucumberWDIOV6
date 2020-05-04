NodeJS-CucumberWDIOV6
======

A WebDriverIO project that supports web and mobile app test automation. The framework implements a hybrid,
 keyword-driven page component pattern, which makes adding locators as simple as placing two strings in a 
 JSON file and filling in a Cucumber step.
## Tech Stack 

* Javascript (ES6)
* NodeJS
* WebDriverIO-V6
* Cucumber

Resources
---
- [Git](https://git-scm.com/docs)
- [WDIO-V6-Config](https://webdriver.io/docs/gettingstarted.html)
- [WDIO-V6-Docs](https://webdriver.io/docs/api.html)
- [SauceLabs-Docs](https://wiki.saucelabs.com/display/DOCS/Test+Configuration+Options)
- [ImageComparison-Docs](https://github.com/wswebcreation/webdriver-image-comparison/blob/master/docs/OPTIONS.md#compare-options)
- [AxeCore-Docs](https://www.deque.com/axe/axe-for-web/documentation/)
- [CucumberJS-Docs](https://cucumber.io/docs/installation/javascript/)

Git Clone Project
---

##### You will need to download and install Git
- [Install Git For Windows Here](https://git-scm.com/download/win) 
    - Use default options or as preferred.
1. When on the projects github page click on `clone or download button`(_green button below contributor_) and copy the `HTTP` url
    - if you are having trouble finding it then copy this url and replace the `placeholderUsername` with your own
        - `https://github.com/placeholderUsername/placeholder.git`
2. Open your CLI(command line interface) and `cd`(change directory) into the `directory/folder` where you want to download this project (It is recommended to create a directory for your git projects). 
    - Ex: `cd git-projects`
3. Use git clone to download the project with the following command with your username
    - `git clone https://github.com/placeholderUsername/placeholder.git`

Setup
---

#### **VSCODE:**
* VScode is the recommended IDE/Text Editor for this project.
* Use any VScode Extensions. Some recommended Extensions for the Framework are: 
* Cucumber(Gherkin) Full Support: https://marketplace.visualstudio.com/items?itemName=alexkrechik.cucumberautocomplete
* Gherkin step autocomplete: https://marketplace.visualstudio.com/items?itemName=silverbulleters.gherkin-autocomplete
* ESLint: https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint
* DotENV: https://marketplace.visualstudio.com/items?itemName=mikestead.dotenv
* Excel to Markdown table: https://marketplace.visualstudio.com/items?itemName=csholmq.excel-to-markdown-table

#### **Getting Started:**
Add the following tools to your environment:

* NodeJS
* 1. Install node.js from: https://nodejs.org/en/download/
* 2. Choose LTS or CURRENT to Download.
* 3a. LTS - Install all the required tools and configurations using Microsoft's windows-build-tools using: `npm install --global production windows-build-tools` from an elevated         PowerShell or CMD.exe (run as Administrator). 
* 3b. CURRENT - Current build of NodeJS will automatically launch and execute `npm install --global production windows-build-tools`
* Android Studio (optional)
* 1. If running local android emulators, install Android Studio: https://developer.android.com/studio/
* 2. Create an Android Emulator following: https://developer.android.com/studio/run/managing-avds
* Chrome Dev Tools (optional) - Necessary to inspect elements for UI selectors.

Once your tools are configured, download the project and navigate to the root directory. 

* Run: `npm install`
* If everything built successfully, you're ready to run tests.

@Optional(Edge): If using Edge for testing. enter `DISM.exe /Online /Add-Capability /CapabilityName:Microsoft.WebDriver~~~~0.0.1.0` in an elevated PowerShell Window to enable WDM WebDriver.

Usage
---

#### **Local:**
- Local drivers are created automatically and you should not need to do anything other than supply the browserName

#### **SauceLabs:**
- Sauce Labs can be tested by selecting an available compatibility.

Running tests
----  

* For this framework you need to set your environment variables and Credentials.
* Set Environment Variable and Credentials in the .env file. Call with `process.env.<VARIABLENAME>`.
* Environment Variable DEMOTIME will add a pause between steps in the test to slow it down for demo purposes. Set "0" to run at normal speed.
* `npm run <BROWSER>` <BROWSER> can be chrome, firefox, edge, ie11, safari, androidEmulator, iphoneSimulator and others (full list in capabilities.json).
