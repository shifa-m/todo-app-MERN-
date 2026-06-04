import jwt, { decode } from "jsonwebtoken";

const requireAuth=async(req,res,next)=>{

            const {authorization}=req.headers;
           if(!authorization) {
            return res.status(404).json({
                        message:"Unauthorized"
            })

            }

            const token=authorization.split("")[1]+"";
            try{
                        const decoded=jwt.verify(token,process.env.JWT_SECRET);
                        req.user=decoded;/*Ab middleware request object mein user data attach kar raha h
                            req = {
   body: {},
   headers: {},
   user: {
      id: "123456",
      iat: 1710000000,
      exp: 1710259200
   }
}
                        */
                        req.token=token;
                        next();
            }catch(error){
                        res.status(404).json({
                                    message:error.message
                        })
            }
}

export default requireAuth