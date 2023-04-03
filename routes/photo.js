const router = require('express').Router();
const photo = require('../model/photo');
const page = require('../model/page');
const fileUpload = require('express-fileupload');

router.use(fileUpload());

router.get('/', async (req, res) => {

	const photos = await photo.getPhotos();
	const menuItems = await page.getMenuItems("photo");

	res.render('photos', {
		menu: menuItems,
		data: photos.rows,
		login: req.login,
		redirect: req.baseUrl + req.path
	});

});

router.get('/add', async (req, res) => {
	const menuItems = await page.getMenuItems(); 
	res.render('addphoto', { menu: menuItems, login: req.login });
});

router.post('/add', async (req, res) => {
	if (req.login.loggedIn) {
		if (req.files && Object.keys(req.files).length !== 0) { 
			let photoUpl = req.files.photo;
			if (photoUpl.mimetype == "image/jpeg" ||
				photoUpl.mimetype == "image/png" ||
				photoUpl.mimetype == "image/webp") {

				let ext = photoUpl.mimetype.split("/")[1];
				let filename = photoUpl.md5 + '.' + ext;
				dest_location = __dirname + '/../public/images/gallery/' + filename;
				console.log(dest_location);
				photoUpl.mv(dest_location, function (err) {
					if (err) {
						console.log(err);
						res.status(500).send("error");
					} else { 
						console.log("file:" + photoUpl.md5);
						photo.addPhoto(filename, req.body.description);
						res.redirect('/photo/');
					}
				});
			} else {
				res.send(`<em>Invalid file type;</em> only jpg, png and webp allowed.`);
			}
		} else {
			res.send(`No files were uploaded.`);
		}
	} else {
		res.render('notloggedin', { redirect: req.baseUrl + req.path });
	}
});

router.get('/:photo_id([1-9][0-9]?)', async (req, res, next) => {

	const img = await photo.getPhoto(req.params.photo_id);
	const photos = await photo.getPhotos();
	const menuItems = await page.getMenuItems();

	if (req.login.loggedIn) {
		res.render('photo', {
			data: img.row,
			menu: menuItems,
			photos: photos.rows,
			login: req.login
		});
	} else {
		res.render('notloggedin', { redirect: req.baseUrl + req.path });
	}

});



module.exports = router;