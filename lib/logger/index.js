const globals = global.scrapebot;


const TRACE = globals.logging.logLevel === 'TRACE';
const DEBUG = TRACE || globals.logging.logLevel === 'DEBUG';
const INFO 	= DEBUG || globals.logging.logLevel === 'INFO';
const WARN 	= INFO 	|| globals.logging.logLevel === 'WARN';
const ERROR = WARN 	|| globals.logging.logLevel === 'ERROR';
const FATAL = true;

const logLevels = {
	TRACE: TRACE,
	DEBUG: DEBUG,
	INFO: INFO,
	WARN: WARN,
	ERROR: ERROR
}

const logger = Object.assign({}, 
	console, 
	{	
		trace: function() { logLevels.TRACE && (globals.logging.detailedTrace ? console.trace.call(this, ...arguments) : console.debug.call(this, ...arguments)); },		
		debug: function() { logLevels.DEBUG && console.debug.call(this, ...arguments); },
		info:  function() { logLevels.INFO 	&& console.info.call(this, ...arguments); },
		warn:  function() { logLevels.WARN  && console.warn.call(this, ...arguments); },
		error: function() { logLevels.ERROR && console.error.call(this, ...arguments); },
		fatal: function() { console.error.call(this, ...arguments); },
		log: 	function()  { console.log.call(this, ...arguments); },		
	}
);

module.exports = logger;