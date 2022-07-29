const path = require('path');
const { access, rename, writeFile } = require('fs/promises');
const ora = require('ora');
const spinner = ora({ text: '' });

async function generateDatabase(config) {
	return `${
		(await jsOrTs()) === 'ts' ? 'export default' : 'module.exports = '
	} ({ env }) => ({
	connection: {
		client: '${
			config.dbtype.toLowerCase() === 'postgresql' ? 'postgres' : 'mysql'
		}',
		connection: {
			host: env('DATABASE_HOST', 'localhost'),
			port: env.int('DATABASE_PORT', ${config.dbport}),
			database: env('DATABASE_NAME', '${config.dbname}'),
			user: env('DATABASE_USERNAME', '${config.dbuser}'),
			password: env('DATABASE_PASSWORD', '${config.dbpassword}'),
			ssl: env.bool('DATABASE_SSL', false)
		}
	}
});
`;
}

async function checkAndBackupDB(config) {
	spinner.start();
	const databasePath = path.join(
		process.cwd(),
		'config',
		`database.${await jsOrTs()}`
	);
	const databaseOldPath = path.join(process.cwd(), 'config', 'database.backup');

	try {
		await access(databasePath);
		await rename(databasePath, databaseOldPath);
		await writeFile(databasePath, (await generateDatabase(config)).toString());
		spinner.stopAndPersist({
			symbol: '💾',
			text: ' Database configuration file created \n'
		});
	} catch (error) {
		spinner.stopAndPersist({
			symbol: '❌',
			text: ` Unable to access config/database.${await jsOrTs()} does it exist 🤔 - check and try again \n`
		});
	}
}
async function jsOrTs() {
	try {
		await access(path.join(process.cwd(), 'tsconfig.json'));
		return 'ts';
	} catch (error) {
		return 'js';
	}
}

module.exports = checkAndBackupDB;
