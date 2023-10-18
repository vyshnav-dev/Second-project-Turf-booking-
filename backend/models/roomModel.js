import mongoose from "mongoose";
const roomSchema = mongoose.Schema({
    userID:{
        type:mongoose.Schema.Types.ObjectId,
        required:false
    },
    turfID:{
        type:mongoose.Schema.Types.ObjectId,
        required:false
    },
    notification:{
        type:Boolean,
        default:false
    },
    username:{
        type:String

    }
    

   
},{
    timestamps:true

});

const Room = mongoose.model('Room',roomSchema);

export default Room;