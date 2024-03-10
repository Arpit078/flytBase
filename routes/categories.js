import express from 'express'
const categoriesRouter = express.Router()
import { Drone } from '../models/drone.js';
import { Mission } from '../models/mission.js';
import { Category } from '../models/category.js';
import authenticateJWT from '../middleWare/authenticateJWT.js';

categoriesRouter.get("/",authenticateJWT,
	async (req, res) => {
        let allCategories;
		try{
			allCategories = await Category.find({ user_id: req.user.userId});
		}
		catch(err){
            console.log(err)
			return res.sendStatus(500);
		}
		res.status(200).json(allCategories)

    }
)
categoriesRouter.put("/update/drones",authenticateJWT,
	async (req, res) => {
        const {drone_id,category_name} = req.body
		try{
            const flag = await Category.findOne({category_name:category_name});
			await Drone.updateOne({_id:drone_id,user_id:req.user.userId},{category:category_name});
			if(!flag)return res.sendStatus(403)
		}
		catch(err){
            console.log(err)
			return res.sendStatus(500);
		}
        res.status(200).json({"updated drone":drone_id})

    }
)
categoriesRouter.put("/update/missions",authenticateJWT,
	async (req, res) => {
        const {mission_id,category_name} = req.body
		try{
            const flag = await Category.findOne({category_name:category_name});
			await Mission.updateOne({_id:mission_id,user_id:req.user.userId},{category:category_name});
			if(!flag)return res.sendStatus(403)
           
		}
		catch(err){
            console.log(err)
			return res.sendStatus(500);
		}
        res.status(200).json({"updated mission":mission_id})
    }
)
categoriesRouter.get("/drones",authenticateJWT,
	async (req, res) => {
        const {category_name} = req.body
        let dronesInCategory;
		try{
			dronesInCategory = await Drone.find({category:category_name,user_id:req.user.userId});
			if(!dronesInCategory)return res.sendStatus(403)
            
		}
		catch(err){
            console.log(err)
			return res.sendStatus(500);
		}
        res.status(200).json(dronesInCategory)
    }
)
categoriesRouter.get("/missions",authenticateJWT,
	async (req, res) => {
        const {category_name} = req.body
        let missionInCategory;
		try{
			missionInCategory = await Mission.find({category:category_name,user_id:req.user.userId});
			if(!missionInCategory)return res.sendStatus(403)
            
		}
		catch(err){
            console.log(err)
			return res.sendStatus(500);
		}
        res.status(200).json(missionInCategory)
    }
)
categoriesRouter.post("/add",authenticateJWT,
    async (req, res) => {
        const {category_name,color,tag_name} = req.body
        const user_id = req.user.userId
        const newCategory =
            Category({
                category_name,
                user_id,
                color,
                tag_name
            });

        try {
            await newCategory.save();
        }catch(err){
            console.log(err)
            return res.sendStatus(500);
        }
        res
        .status(200)
        .json({"created":category_name})
    }
)        
categoriesRouter.put("/update",authenticateJWT,
    async (req, res) => {
    const {category_name,update} = req.body
	update.$currentDate = { updated_at: true };
    try {
        const flag = await Category.updateOne({category_name:category_name},update)
        if(!flag)return res.sendStatus(403)
    }catch(err){
        console.log(err)
        return res.sendStatus(500);
    }
    res
    .status(200)
    .json({"updated":category_name})
})      
categoriesRouter.delete("/delete",authenticateJWT,
async (req,res)=>{
    const {category_name} = req.body
    try{
        const flag = await Category.findOneAndDelete({category_name:category_name})
        if(!flag)return res.sendStatus(403)   
    }catch(err){
        console.log(err)
        return res.sendStatus(500);
    }
    res
    .status(200)
    .json({"deleted":category_name})
})
export default categoriesRouter