
import express from "express"
import authController from "../controllers/authController.js";

const router = express.Router();

//@ts-ignore
router.post("/register" , authController.register)
//@ts-ignore
router.post("/login" , authController.login)
//@ts-ignore
router.post("/login-admin" , authController.loginAsAdmin)

export default router
