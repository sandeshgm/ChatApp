const mongoose = require("mongoose");
const Conversation = require("./conversationModels");

const messsageSchema = new mongoose.Schema({
    senderId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    message:{
        type: String,
        required: true
    },
    ConversationId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Conversation",
        default:[]
    }
},{timestamps:true});

const Message = mongoose.model("Message",messsageSchema);

module.exports = Message;