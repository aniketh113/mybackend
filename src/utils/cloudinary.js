import {v2 as cloudinary} from "cloudinary";
import fs from "fs";

cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
    });

const uploadOnCloudinary = async (localFilePath)=>{
try {
    if(!localFilePath) return null //file path is not provided
    //upload the file on cloudinary 
    const response =  await cloudinary.uploader.upload(localFilePath,{
        resource_type: "auto" //Automatically detect the type of file and upload it
    })
    //file upload success
    console.log("upload success on cloudinary ",response.url);
    return response; //return the response from cloudinary
} catch (error) {
    fs.unlinkSync(localFilePath) //remove locally saved temp file as the upload operation got failed.

}
}


export {uploadOnCloudinary}