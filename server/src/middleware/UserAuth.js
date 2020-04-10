const Db = require('../../libary/sqlBulider');
const app = require('../../libary/CommanMethod');
const DB = new Db();
const passRoute = [
	'/app-information',
	'/forgot-password',
	'/user/login',
	'/user',
	'/social-login',
];
const UserAuth = async (req, res, next) => {
	try {
		if (passRoute.indexOf(req.path) > -1) {
			return next();
		}
		if (!req.headers.hasOwnProperty('authorization_key')) {
			throw { code: 400, message: 'authorization_key key is required' };
		}
		let user_details = await DB.find('users', 'first', {
			conditions: {
				authorization_key: req.headers.authorization_key,
			},
			fields: [
				'id',
				'name',
				'status',
				'email',
				'profile',
				'authorization_key',
				'phone',
				'otp',
				'password',
			],
		});
		if (user_details) {
			req.body.user_id = user_details.id;
			req.body.userInfo = user_details;
			if (req.path === '/user/verify' || user_details.status === 1) {
				return next();
			}
		}
		throw { code: 401, message: 'Invaild Authorization' };
	} catch (err) {
		return app.error(res, err);
	}
};

module.exports = UserAuth;
