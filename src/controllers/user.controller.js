import {asyncHandler} from '../utils/asyncHandler.js';
import {apiError} from '../utils/apiError.js'
import {User} from '../models/user.models.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import { apiResponse  } from '../utils/apiResponse.js';

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

    const {fullName, email, userName, password}=req.body 
    console.log("email: ", email);

    // if(fullName===""){
    //     throw new apiError(400, "Fullname is required")
    // }

    if([fullName,email,userName,password].some((field)=>
    field?.trim()===""))
    {
        throw new apiError(400, "All fields are required")
    }

   const existedUser =  User.findOne({
        $or: [{userName}, {email}]
    })
    if(existedUser){
        throw new apiError(409,"User with email or username already exits")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverImage[0]?.path
    if(!avatarLocalPath){
        throw new apiError(400,"Avatar file is required")
    }
    console.log(req.files) //remove later

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new apiError(400,"Avatar file is required")

    }

   const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        userName:userName.toLowerCase()
    })

   const createdUser=  await User.findById(user._id).select(
    "-password -refreshToken"
   )
   if(!createdUser){
    throw new apiError(500, "Something went wrong while registering")
   }
   
   return res.status(201).json(new apiResponse(200,createdUser,"User Registered!"))
    })





export { registerUser };