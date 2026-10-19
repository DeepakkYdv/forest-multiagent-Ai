import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    firebaseUid:{
        type:String,
        unique:true,
        sparse:true
    },
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    passwordHash:{
        type:String,
        select:false
    },
    avatar:{
        type:String
    }
},{timestamps:true});

const User = mongoose.model("User",userSchema);
export default User;
