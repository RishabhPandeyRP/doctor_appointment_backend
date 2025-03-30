import dotenv from "dotenv";
dotenv.config();
import pkg from "pg"
const {Pool} = pkg
const dbUrl = process.env.dbConnectionUrl

const pool = new Pool({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false },
})

pool.query("select now()" , (err , res)=>{
    if(err){
        console.log(dbUrl)
        console.error("db connect err " , err)
    }
    else{
        console.log("connected with db" , res.rows[0])
    }
})

export default {
    query: (text: string, params?: any[]) => pool.query(text, params),
  };
  