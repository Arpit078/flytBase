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
		catch(err){
			console.log(err)
			return res.sendStatus(500)
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
		const sendObj = {
			"creating_user_id":user_id,
			"created_site_id":newSite._id
		}
        res
		.status(200)
		.json(sendObj)
    }
)
sitesRouter.put("/update",authenticateJWT,
	async (req, res) => {
		const id = req.body._id
		try {
			const update = req.body.update
			const site = await Site.findOne({_id:id})
			if(site.user_id === req.user.userId){
				await Site.findOneAndUpdate({_id:id},update)
			}
			else{
				return res.sendStatus(403)
			}
		} catch(err) {
			console.log(err)
			return res.sendStatus(500);
		}
        res
		.status(200)
		.json({"updated_site_id":id})
    }
)
sitesRouter.delete("/delete",authenticateJWT,
async (req, res) => {
	const id = req.body._id
	try {
		const flag = await Site.findOneAndDelete({_id:id,user_id:req.user.userId})
		console.log(id,req.user.userId)
		if(!flag){
			return res.sendStatus(403)
		}
	} catch (err){
		console.log(err)
		return res.sendStatus(500)	
	}
	res
	.status(200)
	.json({"deleted_site_id":id})
}
)
export default sitesRouter;