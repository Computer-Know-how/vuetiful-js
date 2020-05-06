// Dependencies
const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

// Helpers
const getPath = (...args) => path.resolve(__dirname, ...args);

// Build
console.info('🚀Starting build process!');
console.info('📝Generating entry file...');
/* Overwrite the index.js file with generated imports and exports */
require('./utils/generate-app-entry');

/* Get the binary for vue-cli-service */
const vueCliServicePath = getPath('../../node_modules/.bin/vue-cli-service');

/* Empty the /packages folder for manual generation */
fs.emptyDirSync(getPath('../../packages'));

console.info('🏗 Building package library');
/* Build each component, and package as a plugin in the library */
execSync(`${vueCliServicePath} build src/index.js --target lib --name index --dest dist/`);

console.info('✅Build successful!');
