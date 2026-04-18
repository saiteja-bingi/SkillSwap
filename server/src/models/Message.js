import mongoose from "mongoose";

const messageSchema=new mongoose.Schema(
    {
        // which conversation this message belongs to
        conversation:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Conversation",
            required:true
        },

        // who sent the message
        sender:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },

        // message content
        text:{
            type:String,
            required:true,
            trim:true
        }
    },
    {timestamps:true}
);

const Message=mongoose.model("Message",messageSchema);
export default Message;