import userModel from "../models/userModels";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import {createTransport} from "nodemailer"

dotenv.config()

const forgetPassword=async(req,res)=>{

            try{
                 const {email}=req.body;
                 
                 const user=await userModel.findOne({email});
                 if(!user){
                        res.status(404).json({
                                   message: "User not found"
                        })
                 }

                 const resetToken=crypto.randomBytes(20).toString("hex");
                 user.resetToken=resetToken;
                 await user.save();
               

                 const resetURL=`http://localhost:5173/resetPassword?token=${resetToken}`;
                 var transporter=createTransport({
                        service:"gmail",
                        host:"smtp.gmail.com",
                        port:465,
                        secure:true,
                        auth:{
                                    user:process.env.GMAIL_USER,
                                    pass:process.env.GMAIL_PASSWORD,
                        }

                 });

                 var mailOptions={
                        from:"smehreen9964@gmail.com",
                        to:email,
                        subject:"Reset Password",
                        html:`<h1>Reset Password</h1><h2>Click on the link to reset your Password</h2><h3>${resetUrl}</h3>`;
                 }

   await transporter.sendMail(mailOptions,function(error,info){
            if(error){
                        console.log(error);
            }else{
                        console/log(`Email sent :`+info.response);
            }
   }
   );
   res.status(200).json({message:"A link to reset your password have been sent to your email"})
   
  


   

}catch(error){

       res.status(404).json({
              error:"Error has been occured"
       })
}




       

}

 const resetPassword=async(req,res)=>{

       const {token,password}=req.body;

       console.log("token :",token);

       const user=await userModel.findOne({resetToken:token});

       if(!user){
            return  res.status(400).json({
                     message:"Invalid token"
              })
       }

       const salt=await bcrypt.genSalt(10);
       user.password=await bcrypt.hash(password,salt);
       user.resetToken=null;
       await user.save()

       res.status(200).json({
              message:"Password reset successfully"
       })
 }
export  {forgetPassword , resetPassword}
       


