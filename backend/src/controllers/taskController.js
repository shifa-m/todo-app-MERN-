import taskModel from "../models/taskModel";
import userModel from "../models/userModels";
import {createTransport} from "nodemailer";
import dotenv from "dotenv"

dotenv.config()

const sentMail=async(email,subject,title,description)=>{

            var transporter=createTransport({
                        service:'gmail',
                        auth:{
                                    user:process.env.USERNAME,
                                    pass:process.env.PASSWORD
                        }

            })
  
            var mailOptions={
                        from:"smehreen9964@gmail.com",
                        to:email,
                        subject:subject,
                        html:`<h1>Task added successfully</h1><h2>Title:${title}</h2><h3>Description:${description}</h3>`
            };

            transporter.sendMail(mailOptions,function(error,info){
                        if(error){
                                    console.log(error)
                        }else{
                                    console.log("Email sent :"+info.response)
                        }
            })}


            const addTask=async(req,res)=>{

                        const {title,description}=req.body;
                        const userId=req.user.id;
                        const user=await userModel.find({_id:userId});
                        const newTask=new taskModel({title,description,completed:false,userId});
                        newTask.save()
                        .then(()=>{
                                    sendMail(user[0].email,"Task Added",title,description)
                                    return res.status(200).json({
                                                message:"Task added Successfully"
                                    })
                        })
                        .catch((error)=>{
                                    return (
                                                res.status(404).json({
                                                            message:error.message
                                                })
                                    )
                        })
            }

            const removeTask=(req,res)=>{
                        const {id}=req.body;
                        console.log("id :",id)

                        taskModel.findByIdAndDelete(id)
                        .then(()=>
                                    res.status(200).json({
                                                message:"Task deleted successfully";
                                    })

                        )
                        .catch((error)=>
                        res.status(501).json({
                                    message:error.message
                        }))
            }


            const getTask=(req,res)=>{
                        taskModel.find({userId:req.user.id})
                        .then((data)=>
                        res.status(200).json(data))
                        .catch((error)=>
                        res.status(501).json({
                                    message:error.message
                        }))
            }

export {addTask,removeTask,getTask}


