require('chromedriver');
const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const until = webdriver.until;

const globals = {
	DEBUG: true,
	webdriver: webdriver,
	browser: undefined
};

const LOCATORS = {
	LOGIN: {
		LINK: By.css('a[title="Login"]'),
		BOGUS: By.css('a[title="Bogus"]')
	}
}

const log = Object.assign({}, console, { debug: function() { globals.DEBUG && console.debug.call(this, ...arguments); } });

const forumRootUrl = 'https://www.tapatalk.com/groups/empirelost/index.php';

async function sleep(timeInMs=1000) {
	return new Promise(resolve =>	setTimeout(resolve, timeInMs));
}

function getBrowser(webdriver) {
	return new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();
}

async function waitForElement(locator, timeoutInMs=5000) {
	log.debug(`Waiting ${timeoutInMs}ms for element...`);
	return new Promise(async (resolve, reject) => {
		try {
			await globals.browser.wait(until.elementLocated(locator), timeoutInMs);
			log.debug('Located element.');
			resolve();
		} catch (e) {
			reject(e);
		}
	});
}

const waitForUrl = async function(expectedUrl, timeout=5000, interval=500) {
	const promise = new Promise(async (resolve, reject) => {

		let timedOut = false;
		let url = await browser.getCurrentUrl();
		console.debug('Current url: ', url);

		while (!timedOut) {
			if (url === expectedUrl) {
				resolve();
				return;
			}
		}
	});

	return promise;
}

async function run() {
	log.debug('starting...')	
	globals.browser = getBrowser(globals.webdriver);

	const browser = globals.browser;
	await browser.get(forumRootUrl);
	try {
		await waitForElement(LOCATORS.LOGIN.LINK);
		log.debug('done.')
	} catch (e) {
		log.error('Error:', e);
	}
}
run();
