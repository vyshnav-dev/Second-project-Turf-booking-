import  jwt from "jsonwebtoken";

const adgenerateToken = (res,adminId) =>{
        const token = jwt.sign({adminId},process.env.JWT_SECRET,{
            expiresIn:'30d'
        });
       

    res.cookie('Adjwt',token,{
        httpOnly:true,
        secure:process.env.NODE_ENV !== 'development',
        sameSite:'strict',
        maxAge:30*24*60*60*1000
    }) 
   
    
    
};

export default adgenerateToken;


