import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        userId:{
            type:String,
            unique:true,
        },
        name:{
            type:String,
            required:true,
            trim: true
        },
        email:{
            type:String,
            unique:true,
            trim:true,
            lowercase:true,
            required:true
        },
        password:{
            type:String,
            required:[true, "password is required"]
        },
        role:{
            type:String,
            enum:["user","admin"],
            default:"user"
        },
        
    },{timestamps:true}
)

const User = mongoose.model("User", userSchema);
export default User