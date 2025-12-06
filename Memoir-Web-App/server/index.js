import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import path from 'path';

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import postRoutes from './routes/posts.js';
import userRouter from "./routes/userRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use(bodyParser.json({ limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true}));
app.use(cors());



app.use('/posts', postRoutes);
app.use("/user", userRouter);


const CONNECTION_URL = 'mongodb+srv://juweria:HKys9IuLWTc9ZqaC@cluster0.rcdmo.mongodb.net/memoir_db';
const PORT = process.env.PORT || 5000;

mongoose.connect(CONNECTION_URL)
    .then(() => {
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
   }).catch((error) => console.log("Database not connected" + " " + error.message));
