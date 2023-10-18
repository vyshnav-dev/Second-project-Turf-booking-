import mongoose from "mongoose";
const chatSchema = mongoose.Schema({
    userID:{
        type:mongoose.Schema.Types.ObjectId,
        required:false
    },
    turfID:{
        type:mongoose.Schema.Types.ObjectId,
        required:false
    },
    roomID:{
        type:mongoose.Schema.Types.ObjectId,
        required:false
    },
    message:{
        type:String
    },
    sender:{
        type:String

    },
    username:{
        type:String

    }
    // notification:{
    //     type:Boolean,
    //     default:false
    // }
    

   
},{
    timestamps:true

});

const Chat = mongoose.model('Chat',chatSchema);

export default Chat;