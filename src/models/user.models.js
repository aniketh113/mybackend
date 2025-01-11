 import mongoose from "mongoose";
 import bcrypt from "bcrypt";
 import { JsonWebToken } from "jsonwebtoken";

 const userSchema = new mongoose.Schema({
    userName:{
        type:String,
        required: true,
        lowercase: true,
        unique:true,
        trim: true, //this is for removing the white spaces in the username
        index: true //this is for indexing the username and it will make it more effiecient to search the username in the database
    },
    email:{
        type:String,
        required: true,
        lowercase: true,
        unique:true,
        trim: true
    },
    fullName:{
        type:String,
        required: true,
        trim: true,
        index: true
    },
    avatar:{
        type:String,
        required:true
    },
    coverImage:{
       type:String
    },
    watchHistory: [
    {
        type: Schema.Types.ObjectId,
        ref: "Video"
    }
],
password: {
    type: String, 
    required: [true, 'Password is required'] 
},
refreshToken:{
    type:String,  
}



 },{Timestamp: true})

//this is for password encryption when password is modified
userSchema.pre("save",async function(next){   //here is the pre hook that have pre existing methods like save, update,
//  delete etc so it will be executed right before the save to the database. 
    if(!this.isModified("password")) return next();  //if password is not modified then it will go to next
    this.password = await bcrypt.hash(this.password, 10) //if password is modified then it will encrypt the password eith 10 rounds
    next() //then it will go to next
})

//here this methods is for checking if the password is correct as it is encrypted by bcrypt
userSchema.methods.isPasswordCorrect = async function (password){  // this is for checking the password is correct or not
return await bcrypt.compare(password, this.password)    //this will compare the password with the encrypted password
}

//
userSchema.methods.generateAccessToken = function(){
   return jwt.sign({
        _id: this._id,
        email: this.email,
        userName:this.userName,
        fullName:this.fullName
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
)
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
        _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
)
}

export const User = mongoose.model('User', userSchema)