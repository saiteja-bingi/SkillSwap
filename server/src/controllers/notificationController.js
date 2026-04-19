import Notification from "../models/Notification.js";

export const getMyNotifications=async(req,res)=>{
    try{
        // find notifications for logged-in user
        const notifications=await Notification.find({user:req.user._id})
        .sort({createdAt:-1});

        // send latest first
        res.status(200).json({
            count:notifications.length,
            notifications
        });
    }
    catch(error){
        res.status(500).json({
            message:error.message
        });
    }
};

// mark notifications as read

export const markAsread=async(req,res)=>{
    try{
        // get notification id from url
        const {id}=req.params;

        // find notification
        const notification=await Notification.findById(id);

        // if not found
        if(!notification){
            return res.status(404).json({
                message:"Message not found"
            });
        }

        // security:only owner can mark read
        if(notification.user.toString()!==req.user._id.toString()){
            return res.status(403).json({
                message:"Not authorized to mark this notification as read"
            });
        }

        // mark as read
        notification.isRead=true;
        await notification.save();

        res.status(200).json({
            message:"Notification marked as read",
            notification
        });
    }
    catch(error){
        res.status(500).json({
            message:error.message
        });
    }
}