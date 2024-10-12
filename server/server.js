import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

const PORT = "3001";

import { userRouter } from "./src/routes/users.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/v1/auth", userRouter);

app.get("/hello", (req, res) => {
	// Dev only log
	if (req) {
		console.log("/hello called");
	}
	// -------------
	res.status(200).json({ message: "Hello from server!!!" });
});

// MongoDB Connection

const dbuser = process.env.DBUSER;
const dbpassword = process.env.DBPASS;

mongoose
	.connect(
		`mongodb+srv://${dbuser}:${dbpassword}@recipeapp.uzjs8yi.mongodb.net/recipes?retryWrites=true&w=majority&appName=Recipeapp`,
	)
	.then(() => {
		console.log("Connected to MongoDB");
	})
	.catch((e) => {
		console.log("Connection to Mongodb Failed: ", e);
	});

app.listen(PORT, () => console.log(`Server Started on Port ${PORT}`));
