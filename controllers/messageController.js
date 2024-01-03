const { body, validationResult } = require("express-validator");
const Message = require("../models/messageModel");

exports.create_message_get = (req, res) => {
	res.render("create-message-form", {
		user: res.locals.currentUser,
		errors: [],
	});
};

exports.create_message_post = [
	body("title").trim().isLength({ min: 1 }),
	body("message").trim().isLength({ min: 1 }),

	async (req, res) => {
		const errors = validationResult(req);
		// if error
		if (!errors.isEmpty()) {
			res.render("create-message-form", {
				errors: errors.array(),
				user: res.locals.currentUser,
			});
		}

		const message = new Message({
			user: req.user._id,
			title: req.body.title,
			message: req.body.message,
		});

		message.save();
		res.redirect("/");
	},
];

exports.delete_message_get = (req, res, next) => {
	Message.findById(req.params.id)
		.populate("user")
		.then((result) => {
			res.render("delete-message", {
				user: res.locals.currentUser,
				message: result,
			});
		});
};

exports.delete_message_post = (req, res, next) => {
	Message.findByIdAndDelete(req.params.id).then(() => res.redirect(`/`));
};
