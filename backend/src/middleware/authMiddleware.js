import jwt from 'jsonwebtoken';
import User from '../models/User.js';


//middleware to protect routes

export const portectRoute = async (req,res,next) => {
    //getting token from cookies

    try{
        const token = req.cookies.jwt;

        //  if token is not present

      if(!token){
        return res.status(401).json({message:'Not authorized, no token provided'});
      }

      //verifying token
       const decode = jwt.verify(token,process.env.JWT_SECRET_KEY);

       //if token is invalid
       if(!decode){
        return res.status(401).json({message:'Not authorized, invalid token'});
       }

         //finding user by id from token
       const user = await User.findById(decode.userId).select('-password');
        
         //if user not found
       if(!user){
        return res.status(401).json({message:'Not authorized, user not found'});
       }
       

       //attaching user to request object
       req.user = user;
       next();
       
       //proceed to next middleware or route handler
    }catch(error){
        console.log('Error in auth middleware:',error);
        res.status(500).json({message:'Internal Server Error'});
    }
}