import express from "express";
import upload from '../middleware/profilePics.js';
import auth from '../middleware/auth.js';
const router = express.Router();



import { signin, signup, updateUser, getUser } from "../controllers/usersController.js";

router.post("/signin", signin);
router.post("/signup", signup);
router.patch("/edituser/:id", auth, upload.single('profPics'), updateUser);
router.get("/profile", auth, getUser);

export default router;



