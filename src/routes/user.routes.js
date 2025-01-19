import { Router } from "express";
import {loginUser, logoutUser, refreshAccessToken, registerUser} from "../controllers/user.controller.js"
import {upload} from "../middleware/multer.middleware.js"
import { verifyJwt } from "../middleware/auth.middleware.js";

const router = Router();
router.route("/register").post(
    upload.fields([
        {name: "avatar",maxCount:1},{name:"coverImage", maxCount:1}
    ]),
    registerUser) //this will active the controller from the app.js
router.route("/login").post( 
     loginUser
) 

//secured routes
router.route("/logout").post(verifyJwt,logoutUser)
router.route("/refresh-token").post(refreshAccessToken)




export default router;