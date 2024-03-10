import express from 'express'
const profileRouter = express.Router()
import User from '../models/user.js'

import authenticateJWT from '../middleWare/authenticateJWT.js';

profileRouter.get("/",authenticateJWT,
	async (req, res) => {
        const userData = await User.findOne({ email: req.user.email });
        res.json(userData)
    }
)
export default profileRouter;