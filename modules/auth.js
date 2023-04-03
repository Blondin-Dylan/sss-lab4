const user = require('../model/user');
module.exports = async (req, res, next) => {

	req.login = { loggedIn: false };

	if (req.body.username != undefined && req.body.password != undefined && req.body.action == 'login') {
		let auth = await user.passwordLogin(
			req.body.username,
			req.body.password);

		req.login = auth;

		if (req.login.loggedIn) {
			res.cookie('uid', req.login.user.user_id, { maxAge: 1000 * 60 * 60 * 24 * 5 });
			res.cookie('ch', req.login.cookie, { maxAge: 1000 * 60 * 60 * 24 * 5 });
			if (req.body.redirect != undefined &&
				req.body.redirect != '' &&
				req.body.redirect != null
			) {
				res.redirect(req.body.redirect); 
			} else {
				res.redirect('/'); 
			}
		}
	}

	if (!req.login.loggedIn && req.cookies.uid != undefined && req.cookies.ch != undefined) {

		let auth = await user.cookieLogin(req.cookies.uid, req.cookies.ch);
		req.login = auth;

		if (req.query.logout != undefined) {

			req.login = { loggedIn: false };
			res.clearCookie('uid');
			res.clearCookie('ch');

		}

	}

	next();
}