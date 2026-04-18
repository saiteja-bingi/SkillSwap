import mongoose from "mongoose";

const conversationSchema=new mongoose.Schema(
    {
        // stores both users who can chat
        participants:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"User",
                required:true
            }
        ],

        // which accepted request created this conversation
        request:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Request",
            required:true
        },
    },
    {timestamps:true}
);

const Conversation=mongoose.model("Conversation",conversationSchema);
export default Conversation;