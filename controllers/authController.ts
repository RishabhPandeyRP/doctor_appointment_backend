import authService from "../services/authService.js";
import {Request , Response} from "express"
interface AuthResponse<T> {
    success: boolean;
    data: T;
  }
  
  interface UserData {
    name: string;
    email: string;
    role: string;
  }

const authController = {
    register : async(req:Request,res:Response)=>{
        try {
            const {name , email , password, role} = req.body
            const response: AuthResponse<UserData | string> = await authService.register(name , email , password , role || 'patient')
            if(response.success){
                return res.status(200).json({message:"signed up successfully",username:(response.data as UserData).name})
            }
            res.status(200).json({message : response.data})
        } catch (error:any) {
            console.log("error : authcontroller > register" , error.message)
            res.status(500).json({message :error.message ||  "error in controller auth"})
        }
    },

    login : async(req: Request , res : Response)=>{
        try {
            const {email , password} = req.body
            const response  = await authService.login(email , password)

            if(response.success){
                return res.status(200).json({username : response.data.user.name , token : response.data.token})
            }
            res.status(500).json({message:"logged in successfully",data : response.data})
        } catch (error:any) {
            console.log("error : authcontroller > login" , error.message)
            res.status(500).json({message : error.message || "error : authcontroller > login"})
        }
    },

    loginAsAdmin : async(req: Request , res : Response)=>{
        try {
            const {email , password} = req.body
            const response  = await authService.loginAsAdmin(email , password)

            if(response.success){
                return res.status(200).json({username : response.data.user.name , token : response.data.token})
            }
            res.status(500).json({message:"logged in successfully",data : response.data})
        } catch (error:any) {
            console.log("error : authcontroller > loginAsAdmin" , error.message)
            res.status(500).json({message : error.message || "error : authcontroller > loginAsAdmin"})
        }
    },
}

export default authController