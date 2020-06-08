/**
	* @function deepCopy() - returns a deepCopy of an object or array
	* @param {Object|Array} value
	* @returns {Object|Array}
*/
function deepCopy(value) {
	return (value !== undefined) ? JSON.parse(JSON.stringify(value)) : undefined;
}

export {
	deepCopy
};