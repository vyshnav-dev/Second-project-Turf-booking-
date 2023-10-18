import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const bookingSchema = mongoose.Schema({
    turfname:{
        type:String,
        required:true
    },
    selectedTime:{
        type:String,
        required:false
    },
    selectedGame:{
        type:String,
        required:false
    },
    ownerId:{
        type:mongoose.Schema.Types.ObjectId,
        required:false
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:false
    },
    turfId:{
        type:mongoose.Schema.Types.ObjectId,
        required:false
    },
    selectedDate:{
        type:Date,
        required:false
    },
    isBooked:{
        type:Boolean,
        default:false
    },
    isCancel:{
        type:Boolean,
        default:false
    },
    isRejected:{
        type:Boolean,
        default:false
    },
    phoneNumber:{
        type:String,
        required:false
    },
    username:{
        type:String,
        required:false
    },
    price:{
        type:String,
        required:false
    }
   
},{
    timestamps:true

});

bookingSchema.plugin(mongoosePaginate);

const Booking = mongoose.model('Booking',bookingSchema);

export default Booking;