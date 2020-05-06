export const populatedArray = arr => Array.isArray(arr) && arr.length > 0;

export const is2DMatrix = matrix => {
	if (populatedArray(matrix) && populatedArray(matrix[0])) {
		let column = matrix[0].length;

		return matrix.every(item => populatedArray(item) && item.length === column);
	}

	return false;
};