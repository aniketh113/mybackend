import {asyncHandler} from '../utils/asyncHandler.js';
import {apiError} from '../utils/apiError.js'
import {User} from '../models/user.models.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import { apiResponse  } from '../utils/apiResponse.js';
import jwt from "jsonwebtoken"
import mongoose from "mongoose";

const generateAccessAndRefreshTokens = async(userId)=>{
    try{
        const user = await User.findById(userId)
        const accessToken= user.generateAccessToken()
        const refreshToken= user.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})

        return {accessToken, refreshToken}
    }
    catch{
        throw new apiError('500',"Something went wrong while generating refresh and access token")
    }
}
const registerUser = asyncHandler(async (req, res) => {
    //get user details from frontend
    //validation from back end if its not empty
    //check if the user is already exists: username and email
    //check for images, check for avatar
    //if available then upload them to cloudinary
    //create  a user object -create entry in db
    //remove password and refresh token field from response
    //check if the user is created
    //return response 

    const {fullName, email, userName, password}=req.body    //extracting datapoints for the req.body

    // if(fullName===""){
    //     throw new apiError(400, "Fullname is required")
    // }

    if([fullName,email,userName,password].some((field)=>  //validation for empty string
    field?.trim()===""))
    {
        throw new apiError(400, "All fields are required")
    }

   const existedUser =  await User.findOne({              //here we are checking the existing user with username and email
        $or: [{userName}, {email}]
    })
    if(existedUser){                                      //if exists throw the error
        throw new apiError(409,"User with email or username already exits")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path   //extracting local path for the avatar image from multer using req.files   
    // const coverImageLocalPath = req.files?.coverImage[0]?.path

    let coverImageLocalPath;                             //extracting local path for the coverImage 
    if(req.files && Array.isArray(req.files.coverImage)&& req.files.coverImage.length >0){
        coverImageLocalPath = req.files.coverImage[0].path
    }
    if(!avatarLocalPath){                                //avatar is not available throw error here
        throw new apiError(400,"Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath) //if available upload to cloudinary by using utils cloudinary.js functions
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){   //is avatar is not uploaded to cloudinary throw same error as above
        throw new apiError(400,"Avatar file is required")

    }

   const user = await User.create({  //creating User for DB and saving it to DB
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        userName:userName.toLowerCase()
    })

   const createdUser=  await User.findById(user._id).select( //here we are taking out the password and refreshtoken for apiresponse
    "-password -refreshToken"
   )
   if(!createdUser){ //if user is not created throwing error
    throw new apiError(500, "Something went wrong while registering")
   }
   
   return res.status(201).json(new apiResponse(200,createdUser,"User Registered!")) //if user is registered giving success message and api reponse
    })

const loginUser =asyncHandler(async(req,res)=>{
    //get user from details
    //validation from backend if the area is empty
    //


    const {email,userName, password} = req.body
    if(!userName && !email){
        throw new apiError(400,"Username or Email is required")
    }

    const userExists= await User.findOne({
        $or: [{userName}, {email}]
    })
   
    if(!userExists){
        throw new apiError(400,"User does not exists")
    }

    const isPasswordValid= await userExists.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new apiError(401,"Password Incorrect")
    }

    const {accessToken, refreshToken}= await generateAccessAndRefreshTokens(userExists._id)

    const loggedInUser = await User.findById(userExists._id).select("-password -refreshToken")

    const options = {
        httpOnly:true,
        secure:true,
    }

    return res.status(200).cookie("accessToken", accessToken, options)
    .cookie("refreshToken",refreshToken,options)
    .json(new apiResponse(
        200,{
            userExists: loggedInUser,accessToken,refreshToken
        }
        ,"user logged in success!"
    ))
})

const logoutUser = asyncHandler(async(req,res)=>{
    //clear cookies
    
   await User.findByIdAndUpdate(
        req.user._id,{
            $set:{
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )
    const options = {
        httpOnly:true,
        secure:true,
    }
    return res.status(200).clearCookie("accessToken", options)
    .clearCookie("refreshToken", options).json(new apiResponse(
        200, {

        },"User Logged Out!"
    ))
})

const refreshAccessToken = asyncHandler(async(req,res)=>{

    const incomingRefreshToken =  req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new apiError(401, "Unauthorized access")
    }
    const decodedRefreshToken= jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
    
    const user1 = await User.findById(decodedRefreshToken?._id)

    if(!user1){
        throw new apiError(401,"Invalid refresh token")
    }

    if(incomingRefreshToken !== user1?.refreshToken){
        throw new apiError(401,"Invalid refresh token or used")
    }

    const options = {
        httpOnly:true,
        secure:true
    }
    const {newAccessToken, newRefreshToken}= await generateAccessAndRefreshTokens(user1._id)

    return res.status(200)
    .cookie("accessToken", newAccessToken)
    .cookie("refreshToken",newRefreshToken)
    .json(
        new apiResponse(
            200,
            {newAccessToken, newRefreshToken}
        )
    )

})


export { registerUser, loginUser, logoutUser, refreshAccessToken };