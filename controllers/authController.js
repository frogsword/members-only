const User = require("../models/userModel");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const passport = require("passport");

exports.signup_get = (req, res, next) => {
	res.render("signup", { title: "Sign Up", user: res.locals.currentUser, errors: [] });
};

exports.signup_post = [
	body("username")
		.trim()
		.isLength({ min: 1 })
		.escape()
		.withMessage("username must be at least one character"),
	body("password")
		.trim()
		.isLength({ min: 1 })
		.escape()
		.withMessage("password must be at least one character"),
	body("confirm")
		.trim()
		.isLength({ min: 1 })
		.escape()
		.withMessage("passwords must match"),

	async (req, res, next) => {
		const duplicateUsername = await User.find({
			username: req.body.username,
		});

		const errors = validationResult(req);
		//if error
		if (!errors.isEmpty()) {
			res.render("signup", {
				errors: errors.array(),
				user: res.locals.currentUser,
			});
		}

		//if passwords dont match
		if (req.body.password !== req.body.confirm) {
			res.render("signup", {
				errors: [{msg: 'passwords must match!'}],
				user: res.locals.currentUser,
			});
		}

		//if username is taken
		else if (duplicateUsername.length > 0) {
			res.render("signup", {
				errors: [{ msg: "username already taken" }],
				user: res.locals.currentUser,
			});
		}
		//username not taken & no errors
		else {
			bcrypt.hash(req.body.password, 10, (err, hashedPass) => {
				if (err) {
					return next(err);
				} else {
					const user = new User({
						username: req.body.username,
						password: hashedPass,
					});

					user.save();

					res.redirect("signin");
				}
			});
		}
	},
];

exports.signin_get = (req, res, next) => {
	res.render("signin", { title: "Sign In", user: res.locals.currentUser });
};

exports.signin_post = passport.authenticate("local", {
	successRedirect: "/",
	failureRedirect: "/signin",
	failureFlash: true,
});

exports.signout = (req, res, next) => {
	req.logout((err) => {
		if (err) {
			return next(err);
		}
	});
	res.redirect("/");
};
