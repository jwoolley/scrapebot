const globals = global.scrapebot = {
	logging: {
		logLevel: 'DEBUG',
		detailedTrace: false
	},
	logger:	undefined,
	libs: {
		utils: undefined,
		webdriver: undefined
	},
	browser: undefined
};
globals.logger = require('./lib/logger');
globals.libs.utils = require('./lib/utils');
globals.libs.webdriver = require('./lib/webdriver');

module.exports = globals;