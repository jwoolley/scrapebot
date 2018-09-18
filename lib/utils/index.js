async function sleep(timeInMs=1000) {
	return new Promise(resolve =>	setTimeout(resolve, timeInMs));
}

module.exports = {
	sleep: sleep
};