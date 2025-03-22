import db from "../config/db.js"

const userModel = {
    createUser : async (email:string , pass_encrypt:string , name:string , role:string)=>{
        const response = await db.query("insert into users (email , password , name , role) values ($1, $2, $3, $4) returning *" , [email,pass_encrypt,name,role])

        return response.rows[0]
    },

    findUserByEmail : async (email:string)=>{
        const response = await db.query("select * from users where email=$1" , [email])
        return response.rows[0]
    }
}

export default userModel