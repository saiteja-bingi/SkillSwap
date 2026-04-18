import Request from "../models/Request.js";
import Post from "../models/Post.js";
import Conversation from "../models/Conversation.js";
// send request
export const sendRequest=async(req,res)=>{
    try {
        const {postId}=req.params;
        const {message}=req.body;

        const post=await Post.findById(postId);
        if(!post){
            res.status(404).json({
                message:"Post not found"
            });
        }

        // cannot request own post
        if(post.createdBy.toString()===req.user._id.toString()){
            return res.status(400).json({
                message:"You cannot request your own post"
            });
        }

        // check duplicate pending request
        const existingRequest=await Request.findOne({
            post:postId,
            sender:req.user._id,
            status:"pending"
        });

        if(existingRequest){
            return res.status(400).json({
                message:"request already sent"
            }); 
        }

        const request=await Request.create({
            post:postId,
            sender:req.user._id,
            receiver:post.createdBy,
            message
        });

        res.status(201).json({
            message:"Request sent successfully",
            request
        });

    } catch (error) {
        res.status(500).json({
            message:error.message
        });
    }
};

// get my requests
export const getMyRequests=async(req,res)=>{
    try{
        const userId=req.user._id;
        
        const sentRequests=await Request.find({sender:userId})
        .populate("post","title skillOffered skillWanted status")
        .populate("receiver","name email")
        .sort({createdAt:-1})

        const recievedRequests=await Request.find({receiver:userId})
        .populate("post","title skillOffered skillWanted status")
        .populate("sender","name email")
        .sort({createdAt:-1})

        res.status(200).json({
            sentRequests,
            recievedRequests
        })
    }
    catch(error){
        res.status(500).json({
            message:error.message
        })
    }
}

// accept request
export const acceptRequest=async(req,res)=>{
    try{
        // get request if from params
        const {requestId}=req.params
        
        // find that request in db
        const request=await Request.findById(requestId);

        if(!request){
            return res.status(404).json({
                message:"Request not found"
            });
        }

        // check if user is receiver
        if(request.receiver.toString()!==req.user._id.toString()){
            return res.status(403).json({
                message:"You are not allowed to accept this request"
            });
        }

        // if already accepted or rejected
        if(request.status!=="pending"){
            return res.status(400).json({
                message:"Request already handled"
            });
        }

        // accept request
        request.status="accepted";
        await request.save();

        // create conversation automatically
        const conversation =await Conversation.create({
            participants:[request.sender,request.receiver],
            request:request._id
        });

        // send success response
        res.status(200).json({
            message:"Request accepted and chat created",
            request,
            conversation
        });

    }
    catch(error){
        res.status(500).json({
            message:error.message
        });
    }
};


// reject request
export const rejectRequest=async(req,res)=>{
    try{
        const {requestId}=req.params;

        const request=await Request.findById(requestId);

        // if request not found
        if(!request){
            return res.status(404).json({
                message:"Request not found"
            });
        }

        // check if user is reciever
        if(request.receiver.toString()!==req.user._id.toString()){
            return res.status(403).json({
                message:"You are not authorized to reject this request"
            });
        }

        // if already accepted or rejected
        if(request.status!=="pending"){
            return res.status(400).json({
                message:"Request already handled"
            });
        }

        // reject request
        request.status="rejected";
        await request.save();

        // send success response
        res.status(200).json({
            message:"Request rejected successfully",
            request
        });

    }
    catch(error){
        res.status(500).json({
            message:error.message
        })
    }
}