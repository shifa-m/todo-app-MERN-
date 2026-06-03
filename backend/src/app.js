import express from 'express'
import mongoose from 'mongoose'
import cors from "cors"
import dotenv from "dotenv"


dotenv.config()
const app = express()
mongoose.set('strictQuery',true);

app.use(express.json());
app.use(cors())



app.use("/api/user",)
app.use("/api/task",)
app.use("/api/forgotPassword",)



export default app