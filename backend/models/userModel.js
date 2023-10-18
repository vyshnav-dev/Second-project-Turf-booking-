import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import bcrypt from "bcryptjs";
const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phone:{
        type:String,
        required:false,
        unique:true
    },

    profileGoogleImage:{
        type:String,
        required:false
    },
    profileImage:{
        type:String,
        required:false
    },
    verified:{
        type:Boolean,
        default:false
    },
    isBlocked:{
        type:Boolean,
        default:false
    },
    password:{
        type:String,
        required:false
    },
    imagePath:{
        type:String,
    },
    otp:{
        type:String,
    },
},{
    timestamps:true

});

userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt)
});

userSchema.methods.matchPassword = async function (enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}

userSchema.plugin(mongoosePaginate);
const User = mongoose.model('User',userSchema);

export default User;