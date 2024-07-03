const fs = require('fs');
const path = require('path');

module.exports = class Database {
	constructor(filePath) {
		this.filePath = filePath || path.join(__dirname, 'database.json');
		if (!fs.existsSync(this.filePath)) {
			fs.writeFileSync(this.filePath, '{}');
		}
		this.collections = new Map();
	}
	collection(name) {
		if (!this.collections.has(name)) {
			this.collections.set(
				name,
				new DatabaseCollection(this.filePath, name),
			);
		}
		return this.collections.get(name);
	}
};

class DatabaseCollection {
	constructor(filePath, name) {
		this.filePath = filePath;
		this.name = name;
	}
	get(key) {
		return this.read()[this.name][key];
	}
	set(key, value) {
		const data = this.read();
		if (!data[this.name]) data[this.name] = {};
		data[this.name][key] = value;
		this.write(data);
	}
	delete(key) {
		const data = this.read();
		if (!data[this.name]) data[this.name] = {};
		delete data[this.name][key];
		this.write(data);
	}
	has(key) {
		return key in this.read()[this.name];
	}
	list() {
		return this.read()[this.name];
	}
	read() {
		return JSON.parse(fs.readFileSync(this.filePath));
	}
	write(data) {
		fs.writeFileSync(this.filePath, JSON.stringify(data));
	}
}
