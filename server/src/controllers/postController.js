import Post from "../models/Post.js";

// create new post
export const createPost=async(req,res)=>{
    try{
        const {title,description,skillOffered,skillWanted}=req.body;
        const post=await Post.create({
            title,
            description,
            skillOffered,
            skillWanted,
            createdBy:req.user._id
        });
        res.status(201).json({
            message:"Post created Successfully",
            post
        });
    }
    catch(error){
        res.status(500).json({
            message:error.message
        });
    }
};


// Get all posts
export const getAllPosts=async(req,res)=>{
    try{
        // get search text from url
        const {search} =req.query;
        
        // create empty filter object
        let filter={};

        // if user typed search text
        if(search){
            filter={
                $or:[
                    {title:{$regex:search,$options:"i"}},
                    {description:{$regex:search,$options:"i"}},
                    {skillOffered:{$regex:search,$options:"i"}},
                    {skillWanted:{$regex:search,$options:"i"}}
                ]
            };
        }

        // find posts using filter
        const posts=await Post.find(filter)
        .populate("createdBy","name email")
        .sort({createdAt:-1});

        res.status(200).json({
            count:posts.length,
            posts
        });
    }
    catch(error){
        res.status(500).json({
            message:error.message
        });
    }
};

// populate("createdBy","name email") -> this is used to get the name and email of the user who created the post
// sort({createdAt:-1}) -> this is used to sort the posts in descending order of their creation time



// Get logged-in user's posts
export const getMyPosts=async(req ,res)=>{
    try{
        const posts=await Post.find({
            createdBy:req.user._id
        }).sort({createdAt:-1});
        res.status(200).json(posts);
    }
    catch(error){
        res.status(500).json({
            message:error.message
        });
    }
};


// update Own Post
export const updatePost=async(req,res)=>{
    try{
        const post=await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json(
                {
                    message:"Post not found"
                }
            );
        }

        // check ownership
        if(post.createdBy.toString()!==req.user._id.toString()){
            return res.status(403).json(
                {
                    message:"Not authorized to update this post"
                }
            );
        }

        const updatedPost=await Post.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true,runValidators:true}
        );

        res.status(200).json({
            message:"Post Updated Successfully",
            post:updatedPost
        });
    }
    catch(error){
        res.status(500).json({
            message:error.message
        });
    }
};

// 404 -> not found
// 401 -> unauthorized
// 403 -> forbidden
// 500 -> internal server error

// runValidators:true -> this is used to validate the post data (checks the schema)



// delete own post
export const deletePost=async(req,res)=>{
    try{
        const post=await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({
                message:"Post not found"
            });
        }
        
        // check ownership
        if(post.createdBy.toString()!==req.user._id.toString()){
            return res.status(403).json({
                message:"Not authorized to delet this post"
            });
        }

        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({
            message:"Post deleted Successfully"
        });
    }
    catch(error){
        res.status(500).json({
            message:error.message
        });
    }
};