import mongoose from "mongoose";

const postSchema=new mongoose.Schema(
    {
        title:{
            type:String,
            required:true,
            trim:true
        },

        description:{
            type:String,
            required:true
        },

        skillOffered:{
            type:String,
            required:true,
            trim:true
        },

        skillWanted:{
            type:String,
            required:true,
            trim:true
        },

        createdBy:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },

        status:{
            type:String,
            enum:["open","closed"],
            default:"open"
        }
    },
    {timestamps:true}
);

const Post=mongoose.model("Post",postSchema);
export default Post;