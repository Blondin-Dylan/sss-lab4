const db = require('../config/db');

let photo = {
	'getPhotos': async function () {

		let conn = await db.getConnection();
		const result = await conn.query("select photo_id, filename, description,date_modified from photo order by date_modified desc");

		let status = conn.end();

		let ret = {
			'rows': result,
			'status': status
		};

		return ret;
	},
	'getPhoto': async function (id) {
		let conn = await db.getConnection();
		const result = await conn.query("select photo_id, filename, description,date_modified from photo where photo_id = ?", [id]);

		let status = conn.end();

		let ret = {
			'row': result[0],
			'status': status
		};

		return ret;
	},
	'addPhoto': async function (filename, description) {
		let conn = await db.getConnection();
		const result = await conn.query(
			"insert into photo (filename, description) values (?,?)",
			[filename, description]);

		conn.end();
		return result;
	}

};




module.exports = photo;