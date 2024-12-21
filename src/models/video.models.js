import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new mongoose.Schema({

    videoFile:{
        type:String,
        required:true
    },
    thumbnail:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    description: {
        type:String,
        required:true
    },
    duration:{
        type:number,
        required:true
    },
    views:{
        type:number,
        default: 0
    },
    isPublished:{
        type:Boolean,
        default: true
    },
    owner:{
        type: Schema.Type.ObjectId,
        ref:"User"
    }

},{timestamps:true})
//for advanced schema usage in mongoDB
videoSchema.plugin(mongooseAggregatePaginate)
export const Video = mongoose.model("Video", videoSchema)