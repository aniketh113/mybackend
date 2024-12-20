import dotenv from "dotenv";
import connectDB from "./db/db.js";
dotenv.config({
    path: './env'
})

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000)
    console.log(`Server is running on ${process.env.PORT}`)
})
.catch((err)=>{
    console.log('MongoDB connection Error: ',err)
})






// const app = express()

// (async ()=>{
//     try{ 
//       await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`) 

//       app.on("error",(error)=>{
//         console.log("Error: ", error);
//         throw error
//       })

//       app.listen(process.env.PORT,()=>{
//         console.log(`App is listning on port${process.env.PORT}`)
//       })
//     }
//     catch(error){
//         console.error("Error:",error);
//         throw err
//     }
// })( )