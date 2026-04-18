import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

export const sendMessage=async(req,res)=>{
    try{
        // get conversation id from url
        const {conversationId}=req.params;

        // get message text from body
        const {text}=req.body;

        // find conversation
        const conversation=await Conversation.findById(conversationId);

        // if conversation not found
        if(!conversation){
            return res.status(404).json({
                messgae:"Conversation not found"
            });
        }

        // security check
        // only participant can send messgaes
        const isParticipant=conversation.participants.some(
            userId=>userId.toString()===req.user._id.toString()
        );

        if(!isParticipant){
            return res.status(403).json({
                message:"You are not part of this conversation"
            });
        }

        // create new message
        const message=await Message.create({
            conversation:conversationId,
            sender:req.user._id,
            text
        });

        // success response
        res.status(201).json({
            message:"message sent Successfully",
            data:message
        });

    }
    catch(error){
        res.status(500).json({
            message:error.message
        })
    }
}

// get my conversations

export const getMyConversations=async(req,res)=>{
    try{
        // find conversations where logged-in user is participant
        const conversations=await Conversation.find({
            participants:req.user._id
        })
        .populate("participants","name email")
        .sort({updateAt:-1});

        // send result
        res.status(200).json({
            conversations
        });
    }
    catch(error){
        res.status(500).json({
            message:error.message
        });
    }
};

// get messages for specific conversation
export const getMessages=async(req,res)=>{
    try{
        // get conversation id from url
        const {conversationId}=req.params;

        // find conversation first
        const conversation = await Conversation.findById(conversationId);

        // if not found
        if(!conversation){
            return res.status(404).json({
                messgae:"Conversation not found"
            });
        }

        // only participants can view messages
        const isParticipant=conversation.participants.some(
            userId=>userId.toString()===req.user._id.toString()
        );

        if(!isParticipant){
            return res.status(403).json({
                message:"You are not part of this conversation"
            });
        }

        // get messages
        const messages=await Message.find({
            conversation:conversationId
        })
        .populate("sender","name email")
        .sort({createdAt:1});

        // send result
        res.status(200).json({
            messages
        });
    }
    catch(error){
        res.status(500).json({
            message:error.message
        });
    }
};