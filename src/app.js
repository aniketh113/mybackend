import express from "express";
import cors from "cors";
import cookieParser  from "cookie-parser";

const app =express()
//Below are all configurations which are used to handle the data coming from the sources like json, url, cookies etc
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



//Routes import

import userRouter from "./routes/user.routes.js";  //from here it will rediret to user routes



//routes declaration 
app.use("/api/v1/users",userRouter) //when the application hits it wil come from api/v1/users and the it will redirect to userRouter in the top



export {app}