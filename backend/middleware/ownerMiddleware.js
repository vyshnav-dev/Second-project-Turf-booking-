import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import Owner from '../models/ownerModel.js'

const ownerprotect = asyncHandler(async(req,res,next)=>{
    let token;

    token =req.cookies.owjwt;
    console.log('cmcx',token);
    
     if(token){
        try{
            const decoded = jwt.verify(token,process.env.JWT_SECRET);
            req.owner = await  Owner.findById(decoded.userId).select('-password');
            console.log("ppppp"+req.owner);
            next();
        }catch(error){
            res.status(401)
            throw new Error('Not authorized ,Invalid token');
        }
     }else{
        res.status(401);
        throw new Error('Not authorized  no token');
     }
});

export { ownerprotect }