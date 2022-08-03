const {
	spinner,
	chalk,
	execa,
	access,
	constants,
	generateError
} = require('./utils');
const { getPackageManager } = require('./detection');

async function installDependecies(config) {
	try {
		await checkForOldDependecies(config, {
			type: getPackageManager(),
			command: getPackageManager() === 'yarn' ? 'remove' : 'uninstall'
		});
		spinner.start(
			` 📦 Installing dependencies using ${chalk.bold.yellow(
				getPackageManager().toUpperCase()
			)}...`
		);
		await execa(getPackageManager(), [
			`${getPackageManager() === 'yarn' ? 'add' : 'install'}`,
			`${config.dbtype.toLowerCase() === 'postgresql' ? 'pg' : 'mysql'}`
		]);
		spinner.stopAndPersist({
			symbol: '📦',
			text: ` ${config.dbtype} dependencies installed with ${chalk.bold.yellow(
				getPackageManager().toUpperCase()
			)} \n`
		});
	} catch (err) {
		await generateError(error);
	}
}
async function checkForOldDependecies(config, options) {
	try {
		spinner.start(` 📦 Checking for old dependencies...`);
		await access(`package.json`, constants.R_OK);
		spinner.start(` 📦 Cleaning up old dependencies...`);

		await execa(`${options.type}`, [
			`${options.command}`,
			`${config.dbtype.toLowerCase() === 'postgresql' ? 'mysql' : 'pg'}`
		]);

		spinner.stopAndPersist({
			symbol: '📦',
			text: ` Cleaned up old dependencies \n`
		});
	} catch (err) {
		spinner.stopAndPersist({
			symbol: '📦',
			text: ` No old dependencies to clean up \n`
		});
		return;
	}
}
module.exports = installDependecies;
