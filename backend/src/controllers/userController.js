import userModel from "../models/userModels"
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import validator from "validator";

const createToken=(id)=>{
            return jwt.sign({id},process.env.JWT_SECRET,{
                        expiresIn:3*24*60*60
            })
}

const loginUser =async(req,res)=>{
            const {emai,password}=req.body;

            try{
                        if(!email || !password){
                               return res.status(400).json({
                                    message:"Please enter all Fields";
                               })
                        }

                        const user=await userModel.findOne({email})

                        if(!user){
                                    return res.status(501).json({
                                                message:"User does not exists"
                                    })
                        }


                        const isMatch=await bcrypt.compare(password,user.password)
                        if(!isMatch){
                                    return res.status.json({
                                                message:"Invalid credentials"
                                    })
                        }

                        const token=createToken(user._id)
                        res.status(200).json({user,token})

            }catch(error){
                        res.status(501).json({
                                    message:error.message
                        })

            }
}