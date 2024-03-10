import express from 'express'
const missionsRouter = express.Router()
import { Site } from '../models/site.js';
import { Mission } from '../models/mission.js';

import authenticateJWT from '../middleWare/authenticateJWT.js';

missionsRouter.get("/",authenticateJWT,
	async (req, res) => {
		try{
			const missions = await Mission.find({ user_id: req.user.userId, site_id: req.body.site_id});
			res.status(200).json(missions)
		}
		catch{
			const error =
			new Error("Error! Something went wrong.");
			return res.sendStatus(500);
		}
    }
)

missionsRouter.post("/add",authenticateJWT,
	async (req, res) => {
        const {site_id,mission_name,alt,speed,waypoints} = req.body
		const user_id = req.user.userId
		const newMission =
			Mission({
				site_id,
				user_id,
				mission_name,
				alt,
				speed,
				waypoints
			});

		try {
			await newMission.save();
			await Site.findOneAndUpdate({ _id: site_id},  { $push: { missions_id: newMission._id } })
		} 
		catch {
			return res.sendStatus(500);
		}
        res
		.status(200)
		.json({
			"mission_id":newMission._id,
			"added_to" : site_id})
    }
)
missionsRouter.put("/update",authenticateJWT,
	async (req, res) => {
		const id = req.body._id
		try {
			const update = req.body.update
			update.$currentDate = { updated_at: true };
			console.log(id)
			const flag = await Mission.findOneAndUpdate({_id:id,user_id:req.user.userId},update)
			if(!flag){
				return res.sendStatus(403)
			}
		} catch {
			const error =
			new Error("Error! Something went wrong.");
			return res.sendStatus(500);
		}
        res
		.status(200)
		.json({"updated_mission_id":id})
    }
)
// missionsRouter.put("/move",authenticateJWT,
// 	async(req,res)=>{
// 		const {id,source_site_id,destination_site_id} = req.body;
// 		try{
//             await Mission.updateOne({_id:id},{site_id:destination_site_id})
// 			await Site.updateOne({_id:source_site_id},{ $pull: { missions_id: id }})
// 			const flag = await Site.updateOne({_id:destination_site_id},{ $push: { missions_id: id }})
// 			if(!flag){return res.sendStatus(403)}
// 		}catch(err) {
// 			console.log(err)
// 			return res.sendStatus(500);
// 		}
//         res
// 		.status(200)
// 		.json({"moved to":destination_site_id})
// 	})
missionsRouter.delete("/delete",authenticateJWT,
async (req, res) => {
	const id = req.body._id
	try {
		const flag = await Mission.findOneAndDelete({_id:id,user_id:req.user.userId})
		if(!flag){
			return res.sendStatus(403)
		}
	} catch {
		const error =
		new Error("Error! Something went wrong.");
		return res.sendStatus(500)
	}
	res
	.status(200)
	.json({"deleted_mission_id":id})
}
)
export default missionsRouter;