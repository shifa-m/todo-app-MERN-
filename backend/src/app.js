import express from 'express'
import mongoose from 'mongoose'
import cors from "cors"
import dotenv from "dotenv"


import userRouter from "./routes/userRoute.js"
import taskRouter from "./routes/taskRoute.js"
import forgotPassword from "./routes/forgotPassword.js"

dotenv.config()
const app = express()
mongoose.set('strictQuery',true);

app.use(express.json());
app.use(cors())



app.use("/api/user",userRouter)
app.use("/api/task",taskRouter)
app.use("/api/forgotPassword",forgotPassword)



export default app