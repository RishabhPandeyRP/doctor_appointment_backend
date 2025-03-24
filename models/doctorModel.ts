import db from "../config/db.js"

interface Doctor {
    id?: number;
    user_id: number;
    specialty: string;
    experience: number;
    photo_url?: string;
    rating?: number;
    location: string;
    gender: "male" | "female" | "other";
    diseases?: string[];
  }

const doctorModel = {
    createDoc : async (doctor : Doctor)=>{
        const { user_id, specialty, experience, photo_url, location, gender, diseases , rating } = doctor;

        const response = await db.query("insert into doctors (user_id, specialty, experience, photo_url, location, gender, diseases, rating) values ($1, $2, $3, $4, $5, $6, $7, $8) returning *" , [user_id, specialty, experience, photo_url, location, gender, diseases, rating])

        return response.rows[0]
    },

    getAllDoc : async()=>{
        const response = await db.query("select doctors.* , users.name as doctor_name from doctors inner join users on doctors.user_id = users.id")
        return response.rows
    },

    getDocById : async (id:number)=>{
        const response = await db.query("select doctors.* , users.name as doctor_name from doctors inner join users on doctors.user_id = users.id where doctors.id=$1" , [id])
        return response.rows[0]
    },

    updateDoc: async(id: number, updates: Partial<Doctor>) =>{
        const fields = Object.keys(updates).map((key, index) => `${key} = $${index + 2}`).join(", ");
        const values = Object.values(updates);
    
        const query = `UPDATE doctors SET ${fields} WHERE id = $1 RETURNING *`;
        const result = await db.query(query, [id, ...values]);
        return result.rows[0];
      }
}

export default doctorModel