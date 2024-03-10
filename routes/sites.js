import express from 'express'
const sitesRouter = express.Router()
import User from '../models/user.js';
import { Site } from '../models/site.js';

import authenticateJWT from '../middleWare/authenticateJWT.js';

sitesRouter.get("/",authenticateJWT,
	async (req, res) => {
		try{
			const doc= await Site.find({user_id:req.user.userId})
			res
			.status(200)
			.json(doc)
		}
		catch{
			const error =
				new Error("Error! Something went wrong.");
			return next(error);
		}
    }
)

sitesRouter.post("/add",authenticateJWT,
	async (req, res) => {
        const {site_name,position} = req.body
		const user_id = req.user.userId
		const newSite =
			Site({
				site_name,
				user_id,
				position,
			});

		try {
			await newSite.save();
			console.log(newSite._id)
			await User.findOneAndUpdate({ _id: req.user.userId },  { $push: { sites_id: newSite._id } })
		}catch(err){
            console.log(err)
			return res.sendStatus(500);
		}
        res
		.status(200)
		.json(newSite._id)
    }
)
sitesRouter.put("/update",authenticateJWT,
	async (req, res) => {
		try {
			const  id = req.body._id
			const update = req.body.update
			const site = await Site.findOne({_id:id})
			if(site.user_id === req.user.userId){
				await Site.findOneAndUpdate({_id:id},update)
			}
			else{
				return res.sendStatus(403)
			}
		} catch {
			const error =
			new Error("Error! Something went wrong.");
			return res.sendStatus(403);
		}
        res
		.status(200)
		.json({"updated":id})
    }
)
sitesRouter.delete("/delete",authenticateJWT,
async (req, res) => {
	try {
		const  id = req.body._id
		const site = await Site.findOne({_id:id})
		if(site.user_id === req.user.userId){
			await Site.findOneAndDelete({_id:id})
		}
		else{
			return res.sendStatus(403)
		}
	} catch {
		const error =
			new Error("Error! Something went wrong.");

		return next(error);
	}
	res
	.status(200)
	.json({"deleted":id})
}
)
export default sitesRouter;