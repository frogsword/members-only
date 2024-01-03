const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
	user: { type: Schema.Types.ObjectId, ref: "User", required: true },
	title: { type: String, required: true },
	message: { type: String, required: true },
	postDate: { type: Date, default: Date.now },
});

MessageSchema.virtual("post_date_formatted").get(function () {
	time = this.postDate.toLocaleTimeString("en-US");
	date = this.postDate.toDateString();
	return `${time} • ${date}`;
});

module.exports = mongoose.model("Message", MessageSchema);
