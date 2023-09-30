import mongoose from "mongoose";
import bcrypt from "bcrypt";

// model 형태 정의
const userSchema = mongoose.Schema({
	email: { type: String, required: true, unique: true },
	socialOnly: { type: Boolean, default: false },
	username: { type: String, required: true, unique: true },
	password: { type: String },
	name: { type: String },
	location: String,
	avatarUrl: String,
	videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
	comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
});

userSchema.pre("save", async function () {
	if (this.isModified("password")) {
		this.password = await bcrypt.hash(this.password, 5);
	}
});

// model 생성
const User = mongoose.model("User", userSchema);

export default User;
