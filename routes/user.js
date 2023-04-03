const express = require('express');
const page = require('../model/page');
const router = express.Router();
const user = require('../model/user');
const nodeMailer = require('nodemailer');


router.get('/', async function (req, res, next) {
	const menuItems = await page.getMenuItems();
	if (req.login.loggedIn) {
		res.render('user', { login: req.login, menu: menuItems });
	} else {
		res.redirect("/user/register");
	}

});
router.get('/register', async function (req, res, next) {
	const menuItems = await page.getMenuItems();
	if (req.login.loggedIn) {
		res.redirect("/user");

	} else {
		res.render('userRegister', { menu: menuItems, title: "Register" });
	}

});

router.get('/validate/:id/:code', async function (req, res, next) {
	const menuItems = await page.getMenuItems();
	if (req.login.loggedIn) {
		res.redirect("/user");

	} else {
		let re = await user.validateUser(req.params.id, req.params.code);
		if (re) {
			res.send("validated");
		} else {
			res.send("Could not validate");
		}
	}
});

router.post('/register', async function (req, res, next) {
	const menuItems = await page.getMenuItems();
	if (req.login.loggedIn) {
		res.redirect("/user");

	} else {
		let re = await user.addUser(req.body.username, req.body.email, req.body.password);

		if (re && re.affectedRows == 1) {

			let transporter = nodeMailer.createTransport({ port: 1025, ignoreTLS: true });
			await transporter.sendMail({
				from: "photos@localhost.net",
				to: re.user.email,
				subject: "Validate Registration",
				text: "click to validate: http://localhost:9000/user/validate/" + re.user.user_id + "/" + require('querystring').escape(re.code),
			});

			res.send("registered, validate email");
		} else {
			res.send("Could not register");
		}

	}

});
module.exports = router;
