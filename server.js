import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import authRouter from './routes/auth.js';
import profileRouter from './routes/profile.js';
import sitesRouter from './routes/sites.js';
import missionsRouter from './routes/missions.js';
import dronesRouter from './routes/drones.js';
import categoriesRouter from './routes/categories.js';

const PORT = process.env.PORT||3000
const app = express();
app.use(express.json());
app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/sites",sitesRouter);
app.use("/missions",missionsRouter);
app.use("/drones",dronesRouter);
app.use("/categories",categoriesRouter)

mongoose
  .connect(process.env.CONNECTION_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log('Server is listening on port ',PORT);
    });
  })
  .catch((err) => {
    console.log('Error Occurred:', err);
});

