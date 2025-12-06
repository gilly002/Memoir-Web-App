import express from "express";
import auth from "../middleware/auth.js";
import upload from '../middleware/upload.js';

const router = express.Router();

import { getPosts, createMemory, updatePost, deletePost, likePost, commentPost, getPostsByCreator, getPostsBySearch, getPostsByPage } from '../controllers/posts.js';

router.get('/creator', getPostsByCreator);
router.get('/search', getPostsBySearch);
router.get('/', getPostsByPage);
router.get('/:id', getPosts);

router.post('/create', auth, upload.single('selectedFile'), createMemory);
router.patch('/update/:id', auth,  upload.single('selectedFile'), updatePost);
router.delete('/delete/:id', auth, deletePost);

router.patch('/likePost/:id', auth, likePost);
router.post('/commentPost/:id', auth, commentPost);

export default router;