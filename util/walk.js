const { readdirSync } = require('node:fs');

const walk = (dir) => {
	const paths = readdirSync(dir);
	const files = [];
	for (const path of paths) {
		const fullPath = `${dir}/${path}`;
		if (path.includes('.')) {
			files.push(fullPath);
		} else {
			files.push(...walk(fullPath));
		}
	}
	return files;
};

module.exports = walk;
