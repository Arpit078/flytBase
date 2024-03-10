import express from 'express'
const dronesRouter = express.Router()
import { Site } from '../models/site.js';
import { Drone } from '../models/drone.js';
import authenticateJWT from '../middleWare/authenticateJWT.js';

dronesRouter.get("/",authenticateJWT,
	async (req, res) => {
		try{
			const drones = await Drone.find({ user_id: req.user.userId, site_id: req.body.site_id});
			res.status(200).json(drones)
		}
		catch{
			const error =
			new Error("Error! Something went wrong.");
			return res.sendStatus(500);
		}
    }
)

dronesRouter.post("/add",authenticateJWT,
	async (req, res) => {
        const {
            site_id,
            drone_id,
            drone_type,
            make_name,
            name} = req.body
		const user_id = req.user.userId
		const newDrone =
			Drone({
				site_id,
				user_id,
				drone_id,
				drone_type,
				make_name,
				name
			});

		try {
			await newDrone.save();
			await Site.findOneAndUpdate({ _id: site_id},  { $push: { drones_id: newDrone._id } })
		} 
		catch(err){
			console.log(err)
			return res.sendStatus(500);
		}
        res
		.status(200)
		.json({
			"drone_added_to_site_with_id" : site_id,
			"created_drone_id":newDrone._id
	})
    }
)
dronesRouter.put("/update",authenticateJWT,
	async (req, res) => {
		const id = req.body._id
		try {
			const update = req.body.update;
			update.$currentDate = { updated_at: true };
			const flag = await Drone.findOneAndUpdate({_id:id,user_id:req.user.userId},update)
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
		.json({"updated_drone_id":id})
    }
)
dronesRouter.put("/move",authenticateJWT,
	async(req,res)=>{
		const {id,source_site_id,destination_site_id} = req.body;
		try{
            await Drone.updateOne({_id:id},{site_id:destination_site_id})
			await Site.updateOne({_id:source_site_id},{ $pull: { drones_id: id }})
			const flag = await Site.updateOne({_id:destination_site_id},{ $push: { drones_id: id }})
			if(!flag){return res.sendStatus(403)}
		}catch(err) {
			console.log(err)
			return res.sendStatus(500);
		}
        res
		.status(200)
		.json({"moved_drone_to":destination_site_id})
	})
dronesRouter.delete("/delete",authenticateJWT,
async (req, res) => {
	const id = req.body._id
	try {
		const flag = await Drone.findOneAndDelete({_id:id,user_id:req.user.userId})
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
	.json({"deleted_drone_id":id})
}
)
dronesRouter.put("/remove",authenticateJWT,
async (req,res)=>{
    const id = req.body._id
    try{
        const flag = await Drone.updateOne({_id:id,user_id:req.user.userId},{
            deleted_by:req.user.email,
            deleted_on:Date.now(),
            site_id :""
        })
        if(!flag){return res.sendStatus(403)}
    }catch {
		const error =
		new Error("Error! Something went wrong.");
		return res.sendStatus(500)
	}
	res
	.status(200)
	.json({"removed_drone_id":id})
})

export default dronesRouter;