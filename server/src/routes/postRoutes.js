import express from "express";
import protect from "../middleware/authMiddleware.js";
import {createPost,getAllPosts,getMyPosts,updatePost,deletePost} from "../controllers/postController.js";

const router=express.Router();

router.get("/mine",protect,getMyPosts);
router.get("/",getAllPosts);
router.post("/",protect,createPost);
router.put("/:id",protect,updatePost);
router.delete("/:id",protect,deletePost);

export default router;