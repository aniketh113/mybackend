import express from "express";
import cors from "cors";
import cookieParser  from "cookie-parser";

const app =express()
// this below line are used for CORS while we are getting data from different resources or servers, we can use all different origins 
// coming from many servers and we can create whitelist from here 
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
}))
//here we are managing the data coming from the sources like json 
app.use(express.json({limit:"16kb"}))
//when data is sending in URL then some browsers will convert the words like when you search for aniketh reddy it will pass as aniketh+reddy
//to handle this data we should have some configuration
//extended when we are setting objects under object this will handle that problem(nested objects)
app.use(express.urlencoded({extended:true, limit:"16kb"}))
//when we want to store some files or folders for public
app.use(express.static("public"))

//when you want make CRED operations or any other manipulation on cookies
app.use(cookieParser())
export default app