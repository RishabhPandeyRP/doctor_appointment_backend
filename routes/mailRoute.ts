import express from "express";
import mailController from "../controllers/mailController.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

const router = express.Router()

//@ts-ignore
router.post("/mail" ,authMiddleware.isAuthenticated , mailController.sendMail)

export default router