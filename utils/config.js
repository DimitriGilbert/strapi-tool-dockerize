const path = require(`path`);

const _config = {
	url: `https://github.com/strapi-community/strapi-tool-dockerize`,
	templateDir: path.join(__dirname, `../templates`),
	outDir: path.join(process.cwd()),
	projectType: `js`,
	packageManager: `yarn`,
	env: `development`,
	npmDownloads: 0,
	githubStars: 0,
	dockerCompose: false,
	projectName: ``,
	dbtype: `postgresql`,
	dbhost: ``,
	dbname: ``,
	dbuser: ``,
	dbpassword: ``,
	dbport: null,
	quickStart: false,
	addClient: false,
	clientImage: `node:16-alpine`,
	clientPort: `3000`,
	clientCommand: `yarn dev --host`
};
const setConfig = newConfig => Object.assign(_config, newConfig);
const config = _config;

module.exports = { setConfig, config };
