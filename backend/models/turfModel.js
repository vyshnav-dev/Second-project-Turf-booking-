import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const turfSchema = mongoose.Schema({
    turfname:{
        type:String,
        required:true
    },
    // time:{
    //     type:[Object],
    //     required:true
    // },
     time: [
    {
        times: {
          type: String,
          required: true,
        },
        ishide: {
          type: Boolean,
          default: false,
        },
      },
    ],
    game:{
        type:[Object],
        required:true
    },
    price:{
        type:String,
        required:false
    },
    address:{
        type:String,
        required:false
    },
    location:{
        type:String,
        required:true
    },
    imagePath:{
        type:[String],
        required:true
    },
    description:{
        type:String,
        required:true
    },
    ownerId:{
        type:mongoose.Schema.Types.ObjectId,
        required:false
    },
    isAprooved:{
        type:Boolean,
        default:false
    },
    ownername:{
        type:String,
        required:false
    },
    isRejected:{
        type:Boolean,
        default:false
    },
    number:{
        type:String,
        required:false
    }

   
},{
    timestamps:true

});

turfSchema.plugin(mongoosePaginate);

const Turf = mongoose.model('Turf',turfSchema);

export default Turf;