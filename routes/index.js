var express = require("express");
var router = express.Router();
const Message = require("../models/messageModel");
const User = require("../models/userModel");

const authController = require("../controllers/authController");
const messageController = require("../controllers/messageController");
const profileController = require("../controllers/profileController");

//check if logged in
function isLoggedIn(req, res, next) {
	if (req.user) {
		next();
	} else {
		res.redirect("/signin");
	}
}

//check if authorized to delete message (user is admin or author of message)
function isAuthorizedToDelete(req, res, next) {
	Message.findOne({ _id: req.params.id })
		.populate("user")
		.then((owner) => {
			const isOwner =
				JSON.stringify(owner.user._id) === JSON.stringify(req.user._id);

			if (isOwner || req.user.isAdmin) {
				next();
			} else {
				res.redirect("/");
			}
		});
}

/* GET home page. */
router.get("/", async function (req, res, next) {
	try {
		const allMessages = await Message.find()
			.sort([["postDate", "descending"]])
			.populate("user");

		res.render("index", {
			title: "Members Only",
			user: res.locals.currentUser,
			messages: allMessages,
		});
	} catch (err) {
		return next(err);
	}
});

//auth routes
router.get("/signup", authController.signup_get);

router.post("/signup", authController.signup_post);

router.get("/signin", authController.signin_get);

router.post("/signin", authController.signin_post);

router.get("/signout", authController.signout);

//message routes
router.get("/create-message", isLoggedIn, messageController.create_message_get);

router.post(
	"/create-message",
	isLoggedIn,
	messageController.create_message_post,
);

router.get(
	"/delete-message/:id",
	isLoggedIn,
	isAuthorizedToDelete,
	messageController.delete_message_get,
);

router.post(
	"/delete-message/:id",
	isAuthorizedToDelete,
	messageController.delete_message_post,
);

//profile routes
router.get("/user/:id", isLoggedIn, profileController.profile_get);

router.get("/become-member", isLoggedIn, profileController.become_member_get);

router.post("/become-member", isLoggedIn, profileController.become_member_post);

router.get("/become-admin", isLoggedIn, profileController.become_admin_get);

router.post("/become-admin", isLoggedIn, profileController.become_admin_post);

module.exports = router;
