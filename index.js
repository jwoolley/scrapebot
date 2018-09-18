const globals = require('./globals');
const libs = globals.libs;
const logger = globals.logger;

const By = libs.webdriver.webdriver.By;
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

const forumRootUrl = 'https://www.tapatalk.com/groups/empirelost/index.php';

async function login(username, password) {
	const browser = globals.browser;
	await browser.get(forumRootUrl);

	try {
		const loginLink = await browser.waitForElement(LOCATORS.LOGIN.LINK, 10000);
		await browser.navigateWithLink(loginLink);

		logger.debug('Waiting for login form to be visible...');
		await browser.waitForElement(LOCATORS.LOGIN.FORM.CONTAINER);

		const usernameField = await browser.waitForElement(LOCATORS.LOGIN.FORM.FIELD.USERNAME);
		const passwordField = await browser.waitForElement(LOCATORS.LOGIN.FORM.FIELD.PASSWORD);

		await usernameField.sendKeys(username);
		await passwordField.sendKeys(password);

		const loginButton = await browser.waitForElement(LOCATORS.LOGIN.FORM.SUBMIT);
		await loginButton.click();
		logger.debug('done!')
	} catch (e) {
		logger.error('Error:', e);
	}
}

async function run(payload) {
	logger.debug('starting...');
	globals.browser = libs.webdriver.getBrowser();

	try {
		await login(payload.credentials.username, payload.credentials.password);
	} finally {
		if (globals.browser) {
			globals.browser.quit();
		}
	}
}

function parseCredentials(filePath) {
	try {
		let credentials;
		try {
			credentials = require(filePath);
		} catch (e) {
			throw new Error(`${filePath} is not a valid JSON file`);
		}			
		if (!credentials.username || !credentials.password) {
			throw new Error(`username or password not specified`);
		}
		return credentials;
	} catch(e) {
		throw new Error('Unable to parse credentials file: ' + e.message);
	}
}

const argv = require('yargs')
	.option('c', {
		alias: 'credentials',
		describe: 'path to credentials file',
		demand: 'path to credentials file is required',		
		type: 'string',
		nargs: 1,
		requiresArg: true
	})
	.demandOption(['c'])
	.help()
	.argv;

const credentialsFilePath = '/.'.includes(argv.credentials.charAt(0)) ? argv.credentials : './' + argv.credentials;
logger.info(`Loaded credentials file:`, credentialsFilePath);

const credentials = parseCredentials(credentialsFilePath);

const payload = {
	credentials: credentials
};

run(payload);
