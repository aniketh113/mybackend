const asyncHandler= (requestHandler)=>{
    (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).
        catch((err)=>next(err))
    }
}

export {asyncHandler}


//2nd type of writing this function 
//this is higher order function, function which is taking function as a argument 
// const asyncHandler = (fn)=>async (req,res,next)=>{
// try {
//     await fn(req,res,next)
// } catch (error) {
//     res.status(error.code || 500).json({
//         success: false,
//         message: error.message
//     })
// }
// }