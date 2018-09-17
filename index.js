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
		LINK: By.css('#nav-main a[title="Login"]'),
		FORM: {
			CONTAINER: By.css('div.login_form'),
			FIELD: {
				USERNAME: By.id('username'),
				PASSWORD: By.id('password')
			},
			SUBMIT: By.css('div.login_form input[name="login"]')
		}	
	}
};

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
			const element = await globals.browser.findElement(locator);		
			log.debug('Located element. Waiting for it to be visible...');			
			await globals.browser.wait(until.elementIsVisible(element), timeoutInMs);
			resolve(element);
		} catch (e) {
			reject(e);
		}
	});
}

const waitForUrl = async function(expectedUrl, timeout=5000, interval=500) {
	return new Promise(async (resolve, reject) => {
		setTimeout(reject, timeout);

		let url = await globals.browser.getCurrentUrl();
		while (url !== expectedUrl) {
			log.debug(`Url not found. Waiting for ${interval}ms to retry...`, expectedUrl);
			await sleep(interval);
			url = globals.browser.getCurrentUrl();
		}
		resolve();
	});
}

async function navigateWithLink(linkElement) {
	const linkUrl = await linkElement.getAttribute('href');
	await linkElement.click();
	await waitForUrl(linkUrl);
}

async function login(username, password) {
	const browser = globals.browser;
	await browser.get(forumRootUrl);

	try {
		const loginLink = await waitForElement(LOCATORS.LOGIN.LINK, 10000);
		await navigateWithLink(loginLink);

		log.debug('Waiting for login form to be visible...');
		await waitForElement(LOCATORS.LOGIN.FORM.CONTAINER);

		const usernameField = await waitForElement(LOCATORS.LOGIN.FORM.FIELD.USERNAME);
		const passwordField = await waitForElement(LOCATORS.LOGIN.FORM.FIELD.PASSWORD);

		await usernameField.sendKeys(username);
		await passwordField.sendKeys(password);

		const loginButton = await waitForElement(LOCATORS.LOGIN.FORM.SUBMIT);
		await loginButton.click();
		log.debug('done!')
	} catch (e) {
		log.error('Error:', e);
	}
}

async function run() {
	log.debug('starting...')	
	globals.browser = getBrowser(globals.webdriver);
	await login('frenchy', 'booboo');
}
run();
