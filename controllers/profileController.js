const User = require("../models/userModel");
const Message = require("../models/messageModel");
const { body, validationResult } = require("express-validator");
require("dotenv").config();

exports.profile_get = async (req, res, next) => {
	try {
		const userMessages = await Message.find({ user: req.user._id }).sort({
			postDate: "descending",
		});
		res.render("profile-page", {
			user: res.locals.currentUser,
			userMessages: userMessages,
		});
	} catch (err) {
		return err;
	}
};

exports.become_member_get = (req, res, next) => {
	res.render("become-member", { errMsg: [], user: res.locals.currentUser });
};

exports.become_member_post = [
	body("code").trim(),

	async (req, res, next) => {
		if (req.body.code === process.env.MEMBER_CODE) {
			await User.findByIdAndUpdate(req.user._id, { isMember: true });

			res.redirect("/");
		} else {
			res.render("become-member", {
				errMsg: `WRONG CODE, THIS IS THE CODE: "${process.env.MEMBER_CODE}"`,
				user: res.locals.currentUser,
			});
		}
	},
];

exports.become_admin_get = (req, res, next) => {
	res.render("become-admin", { errMsg: [], user: res.locals.currentUser });
};

exports.become_admin_post = [
	body("code").trim(),

	async (req, res, next) => {
		if (req.body.code === process.env.ADMIN_CODE) {
			await User.findByIdAndUpdate(req.user._id, { isAdmin: true });

			res.redirect("/");
		} else {
			res.redirect("/become-admin", {
				errMsg: `Give it up`,
				user: res.locals.currentUser,
			});
		}
	},
];
