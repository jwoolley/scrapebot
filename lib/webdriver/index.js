require('chromedriver');
const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const until = webdriver.until;

const globals = global.scrapebot;
const logger = globals.logger;
const utils = globals.libs.utils;

async function waitForElement(browser, locator, timeoutInMs=5000) {
	logger.trace(`Waiting ${timeoutInMs}ms for element...`);
	return new Promise(async (resolve, reject) => {
		try {
			await globals.browser.wait(until.elementLocated(locator), timeoutInMs);
			const element = await globals.browser.findElement(locator);		
			logger.trace('Located element. Waiting for it to be visible...');			
			await globals.browser.wait(until.elementIsVisible(element), timeoutInMs);
			resolve(element);
		} catch (e) {
			reject(e);
		}
	});
}

async function waitForUrl(browser, expectedUrl, timeout=5000, interval=500) {
	return new Promise(async (resolve, reject) => {
		setTimeout(reject, timeout);

		let url = await globals.browser.getCurrentUrl();
		while (url !== expectedUrl) {
			logger.trace(`Url not found. Waiting for ${interval}ms to retry...`, expectedUrl);
			await utils.sleep(interval);
			url = globals.browser.getCurrentUrl();
		}
		resolve();
	});
}

async function navigateWithLink(browser, linkElement) {
	const linkUrl = await linkElement.getAttribute('href');
	await linkElement.click();
	await waitForUrl(browser, linkUrl);
}


function getBrowser() {
	const browser = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();
	return Object.assign(browser, {
		waitForElement: waitForElement.bind(undefined, browser),
		waitForUrl: 		waitForUrl.bind(undefined, browser),
		navigateWithLink: navigateWithLink.bind(undefined, browser)
	});
}

module.exports = {
	getBrowser: getBrowser,
	webdriver: webdriver
}
