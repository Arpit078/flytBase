import express from 'express'
const authRouter = express.Router()
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import User from '../models/user.js'
import dotenv from 'dotenv';
dotenv.config();

async function generateSaltAndHash(password) {
    const saltRounds = 10;
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    } catch (err) {
        console.error(err);
    }
}
async function validatePassword(password,hash) {
	const matchBool =  await bcrypt.compare(password, hash)
	return matchBool
}
authRouter.post("/login",
	async (req, res, next) => {
		let { email, password } = req.body;
		let existingUser;
		try {
			existingUser =
				await User.findOne({ email: email });
		} catch {
			const error =
				new Error(
					"Error! Something went wrong."
				);
			return next(error);
		}
		if (!existingUser
			|| !(await validatePassword(password,existingUser.passwordHash))) {
			const error =
				Error(
					"Wrong details please check at once"
				);
			return next(error);
		}
		let token;
		try {
			//Creating jwt token
			token = jwt.sign(
				{
					userId: existingUser.id,
					email: existingUser.email
				},
				process.env.JWT_SECRET,
				{ expiresIn: "60d" }
			);
		} catch (err) {
			console.log(err);
			const error =
				new Error("Error! Something went wrong.");
			return next(error);
		}

		res
			.status(200)
			.json({
				success: true,
				data: {
					userId: existingUser.id,
					email: existingUser.email,
					token: token,
				},
			});
	});

authRouter.post("/signup",
	async (req, res, next) => {
		const {name,email,password,sites} = req.body
		const passwordHash = await generateSaltAndHash(password)
		const newUser =
			User({
				name,
				email,
				passwordHash,
				sites
			});

		try {
			await newUser.save();
		} catch(err) {
			return next(err);
		}
		let token;
		try {
			token = jwt.sign(
				{
					userId: newUser.id,
					email: newUser.email
				},
				process.env.JWT_SECRET,
				{ expiresIn: "60d" }
			);
		} catch (err) {
			return next(err);
		}
		res
			.status(201)
			.json({
				success: true,
				data: {
					userId: newUser.id,
					email: newUser.email,
					token: token
				},
			});
	});

export default authRouter;