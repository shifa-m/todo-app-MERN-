import userModel from "../models/userModels.js"
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


const registerUser=async(req,res)=>{

            const {name ,email,password}=req.body;

            try{

                        const exists=await userModel.findOne({email});

                        if(exists){
                                    return res.status(400).json({
                                                message:"User already Exists"
                                    })
                        }

                        if(validator.isEmpty(name)||validator.isEmpty(email)||validator.isEmpty(password)){
                                    return res.status(400).json({
                                                message:'Please enter all fields'
                                    })
                        }

                        if(!validator.isEmail(email)){
                                    return res.status(404).json({
                                                message:"Please enter a valid email"
                                    })
                        }

                        if(!validator.isStrongPassword(password)){
                                    return res.status(404).json({
                                                message:"Please enter a Strong Password"
                                    })
                        }

                        const salt=await bcrypt.genSalt(10);
                        const hashedPassword=await bcrypt.hash(password,salt);

                        const newUser=new userModel({name,email,password:hashedPassword});
                        const user=await newUser.save();
                        const token=createToken(user._id);
                        res.status(200).json({user,token});


            }catch(error){
                        
                        res.status(404).json({
                                    message:error.message
                        })
}
}

const getUser=async(req,res)=>{
            const id=req.body;
            try{
                        const user=await userModel.find({_id:id})
                        res.status(200).json({user:user[0]})
            }catch(error){
                        res.status(404).json({
                                    message:error.message
                        })
            }
}

export {loginUser,registerUser,getUser}
