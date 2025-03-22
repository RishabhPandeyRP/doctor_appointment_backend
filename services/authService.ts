import dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken"
import userModel from "../models/userModel.js";
import bcrypt from 'bcrypt'


const authService = {
    register: async (name:string, email:string, password:string, role:string) => {
        try {
            const user =await userModel.findUserByEmail(email);
            if (user) {
                return {success : false , data :"user already exists"}
            }

            const salt = await bcrypt.genSalt(10)
            const encryptPass = await bcrypt.hash(password, salt);

            const newUser = await userModel.createUser(email, encryptPass, name, role)
            return {success : true , data :newUser}
        } catch (error:any) {
            console.log("error : authService > register" , error.message)
            return {success : false , data :error.message}
        }
    },

    login: async (email:string, password:string) => {
        try {
            const user = await userModel.findUserByEmail(email)
            if (!user) {
                throw new Error("invalid credentials")
            }

            const isCorrectPass = await bcrypt.compare(password, user.password)
            if (!isCorrectPass) {
                throw new Error("Incorrect password")
            }

            const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'jwt-secret', { expiresIn: '1d' })

            return { success:true ,data :{token, user} }
        } catch (error:any) {
            console.log("error : authService > login ", error.message)
            return {success : false , data :error.message}
        }

    },

    loginAsAdmin: async (email:string, password:string) => {
        try {
            const user = await userModel.findUserByEmail(email)
            if (!user) {
                throw new Error("invalid credentials")
            }

            const isCorrectPass = await bcrypt.compare(password, user.password)
            if (!isCorrectPass) {
                throw new Error("Incorrect password")
            }

            const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'jwt-secret', { expiresIn: '1d' })

            return { success:true ,data :{token, user} }
        } catch (error:any) {
            console.log("error : authService > loginAsAdmin ", error.message)
            return {success : false , data :error.message}
        }

    },
}

export default authService