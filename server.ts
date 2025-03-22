import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import docRoutes from "./routes/docRoutes.js"
import slotRoutes from "./routes/slotRoutes.js"
import appointmentRoutes from "./routes/appointmentRoutes.js"

dotenv.config();
const PORT = process.env.PORT || 5000
const app = express()

app.use(express.json())
app.use(cors())
app.use(helmet())
app.use(morgan('dev'))

app.use("/auth" , authRoutes)
app.use("/doctors" , docRoutes)
app.use("/slots" , slotRoutes)
app.use("/appointment" , appointmentRoutes)


app.listen(PORT , ()=>{
    console.log("server listening on port " , PORT)
})