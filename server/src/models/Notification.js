import mongoose from "mongoose";

const notificationSchema=new mongoose.Schema({
    // who should recieve notification
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    // notification text
    message:{
        type:String,
        required:true,
        trim:true
    },

    // read or unread
    isRead:{
        type:Boolean,
        default:false
    }
},{timestamps:true});

const Notification=mongoose.model("Notification",notificationSchema);

export default Notification;