
import express from "express"
import authController from "../controllers/authController.js";

const router = express.Router();

//@ts-ignore
router.post("/register" , authController.register)
//@ts-ignore
router.post("/login" , authController.login)
//@ts-ignore
router.post("/login-admin" , authController.loginAsAdmin)
//@ts-ignore
router.post("/request-password-reset" , authController.requestPasswordReset)
//@ts-ignore
router.post("/reset-password" , authController.resetPassword)
//@ts-ignore
router.get("/verifyToken/:token" , authController.verifyToken)
export default router
