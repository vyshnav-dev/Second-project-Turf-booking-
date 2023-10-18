import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import Admin from "../models/adminModel.js";

const protect = asyncHandler(async (req, res, next) => {
  let token;

  token = req.cookies.Adjwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.admin = await Admin.findById(decoded.adminId).select("-password");

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized ,Invalid token");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized  no token");
  }
});

export { protect };

// import jwt from 'jsonwebtoken'
// import asyncHandler from 'express-async-handler'
// import Admin from '../models/adminModel.js';

// const getToken = ( req ) => {

//     let cookieHeaderValue = req.headers.cookie;
//     let token = null;

//     if (cookieHeaderValue) {
//       let cookies = cookieHeaderValue.split(";");

//       for (let cookie of cookies) {
//         let [cookieName, cookieValue] = cookie.trim().split("=");

//         if (cookieName === "vysh") {
//           token = cookieValue;
//           console.log(token)
//           return token
//           break;
//         }
//       }
// }

// }

// const adprotect = asyncHandler(async(req,res,next)=>{
//   let token = null;
// console.log(req.headers)

// //     let cookieHeaderValue = req.headers.cookie;
// //     let token = null;
// //     console.log(res.cookies.Adjwt)
// //     if (cookieHeaderValue) {
// //       let cookies = cookieHeaderValue.split(";");

// //       for (let cookie of cookies) {
// //         let [cookieName, cookieValue] = cookie.trim().split("=");

// //         if (cookieName === "Adjwt") {
// //           token = cookieValue;
// //           console.log(token)

// //           break;
// //         }
// //       }
// // }
// if (req.cookies && req.cookies.Adjwt) {
//   token = req.cookies.Adjwt;
//   console.log(token)
// }
//     // token= await getToken(req);

//  console.log("BLah")

//      if(token){
//         try{
//             const decoded = jwt.verify(token,process.env.JWT_SECRET);
//             req.admin = await  Admin.findById(decoded.userId).select('-password');
//             console.log("99999"+req.user);
//             next();
//         }catch(error){
//             res.status(401)
//             throw new Error('Not authorized ,Invalid token');
//         }
//      }else{
//         res.status(401);
//         throw new Error('Not authorized  no token');
//      }
// });

// export { adprotect }
