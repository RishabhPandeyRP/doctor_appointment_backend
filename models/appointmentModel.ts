import db from "../config/db.js";

interface AppointmentInterface{
    id?: number;
  doctor_id: number;
  patient_id: number;
  doctor_slot_id: number;
  appointment_date: string;
  start_time: string;
  end_time: string;
  type: "online" | "offline";
  status?: "pending" | "approved" | "declined" | "completed";
  patient_details?: object;
}

const appointmentModel = {

    bookAppointment : async(appointment : AppointmentInterface)=>{
        const {doctor_id,patient_id,doctor_slot_id,appointment_date,start_time,end_time,type,status,patient_details} = appointment

        const slotIsAvail = await db.query("select * from doctor_slots where id=$1 and is_available=true" , [doctor_slot_id])
        if(slotIsAvail.rows.length === 0){
            throw new Error("Slot not available")
        }

        const conflictForDoc = await db.query("select * from appointments where doctor_id = $1 and appointment_date = $2 and (start_time <= $3 and end_time > $3 ) or (start_time < $4 and end_time >= $4 )" , [doctor_id,appointment_date,start_time,end_time])
        if(conflictForDoc.rows.length > 0){
            throw new Error("Doctor is already booked")
        }

        const conflictForPatient = await db.query("select * from appointments where patient_id = $1 and appointment_date = $2 and (start_time <= $3 and end_time > $3 ) or (start_time < $4 and end_time >= $4 )" , [patient_id,appointment_date,start_time,end_time])
        if(conflictForPatient.rows.length > 0){
            throw new Error("Patient is already booked")
        }

        const response  = await db.query("insert into appointments (doctor_id,patient_id,doctor_slot_id,appointment_date,start_time,end_time,type,status,patient_details) values ($1, $2, $3, $4, $5, $6, $7, $8, $9) returning *" , [doctor_id,patient_id,doctor_slot_id,appointment_date,start_time,end_time,type,status || 'pending',patient_details])

        await db.query("update doctor_slots set is_available = false where id = $1" , [doctor_slot_id])

        return response.rows[0]
    },

    getAppByPatient : async(patient_id:number)=>{
        const response = await db.query(`SELECT appointments.*, doctors.specialty, users.name AS doctor_name 
       FROM appointments 
       INNER JOIN doctors ON appointments.doctor_id = doctors.id
       INNER JOIN users ON doctors.user_id = users.id
       WHERE appointments.patient_id = $1` , [patient_id])
        return response.rows
    },

    getAppByDoc : async(doctor_id:number)=>{
        const response = await db.query(`SELECT appointments.*, users.name AS patient_name 
       FROM appointments 
       INNER JOIN users ON appointments.patient_id = users.id
       WHERE appointments.doctor_id = $1` , [doctor_id])
        return response.rows
    },

    updateApp : async(id:number , status:string)=>{
        const response = await db.query("update appointments set status = $1 where id = $2 returning *",[status , id])

        if(status==="completed" || status==="declined"){
            await db.query("update doctor_slots set is_available = true where id = (select doctor_slot_id from appointments where id = $1)",[id])
        }

        return response.rows[0]
    },

    deleteApp: async(id:number)=>{
        const response = await db.query("delete from appointments where id = $1 returning *",[id])

        await db.query("update doctor_slots set is_available = true where id = (select doctor_slot_id from appointments where id = $1)",[id])

        return response.rows[0]
    }
}

export default appointmentModel