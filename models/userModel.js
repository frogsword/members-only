const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	username: { type: String, required: true },
	password: { type: String, required: true },
	isMember: { type: Boolean, default: false },
	isAdmin: { type: Boolean, default: false },
	joinDate: { type: Date, default: Date.now },
});

UserSchema.virtual("join_date_formatted").get(function () {
	return this.joinDate.toLocaleDateString("en-CA");
});

module.exports = mongoose.model("User", UserSchema);
