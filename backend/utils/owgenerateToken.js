import  jwt from "jsonwebtoken";

const owgenerateToken = (res,userId) =>{
        const token = jwt.sign({userId},process.env.JWT_SECRET,{
            expiresIn:'30d'
        });
       

    res.cookie('owjwt',token,{
        httpOnly:true,
        secure:process.env.NODE_ENV !== 'development',
        sameSite:'strict',
        maxAge:30*24*60*60*1000
    }) 
    
};

export default owgenerateToken;