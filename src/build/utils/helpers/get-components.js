const p = require('path');
const fs = require('fs');

/* Get all the .vue files in the src/components subdirectories */
const componentFileNames = getFilesInDir(p.resolve(__dirname, '../../../components'))
	.filter(componentFileName => /\.vue$/.test(componentFileName))
	.map(componentFileName => componentFileName
	/* Remove extension from file name */
		.replace(/\.\w+$/, '')
	/* Remove path before file name */
		.replace(/^.*(\\|\/|:)/, '')
	);

/**
	* @function getFilesInDir() - recursively fetches all file paths in directory (and all children directories)
	* @param {String} path – the path to the directory you're reading from
	* @returns {Array} - array of all file paths in the directory (and all children directories)
*/
function getFilesInDir(path) {
	/* Persistent list of all files in directory (and all children directories) */
	let list = [];
	/* Get a list of all files in the specified path */
	const files = fs.readdirSync(path);

	/* Process each file in the directory */
	files.forEach(file => {
		/* Get meta-data for the current file */
		const stats = fs.lstatSync(p.join(path, file));

		if (stats.isDirectory() && file[0] !== '.') {
			/* If the current file is a directory, read all file paths in that directory and add them to the return value */
			list = list.concat(getFilesInDir(p.join(path, file)));
		} else if (file[0] !== '.') {
			list.push(p.join(path, file));
		}
	});

	return list;
}

module.exports = componentFileNames;
