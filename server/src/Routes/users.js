import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { UserModel } from "../models/Users.js";

const router = express.Router();

try {
	router.post("/register", async (req, res) => {
		const { username, password } = req.body;
		const user = await UserModel.findOne({ username });
		if (user) return res.status(400).json({ message: "User already exists!" });

		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = new UserModel({ username, password: hashedPassword });
		await newUser
			.save()
			.then(res.json({ message: "New user created successfully!" }));
	});
} catch (e) {
	console.error("Server error", e);
	res.status(500).json({ message: "Server Error", status: 500 });
}

router.get("/count", async (req, res) => {
	const count = (await UserModel.countDocuments()).toString();
	res.status(200).send({ count: count });
});

router.post("/login", async (req, res) => {
	const { username, password } = req.body;
	const user = await UserModel.findOne({ username });
	if (!user) {
		return res.status(400).json({ message: "User doesn't exists!" });
	}
	const isPasswordValid = await bcrypt.compare(password, user.password);
	if (isPasswordValid) {
		console.log("True");
		return res.status(200).json({ message: "User valid", status: 200 });
	}
	if (!isPasswordValid) {
		console.log("Not Valid");
		return res
			.status(400)
			.json({ message: "Username or password incorrect", status: 400 });
	}
});

export { router as userRouter };
