// import { getUserDetailsFromToken } from "../helpers/getUserDetailsFromToken";
// import { User } from "../Schema/model.js";
// import { checkEmail } from "./checkEmail.js";

// export const login = async  (req,res)=>{
// try{
//         const token = req.cookies.token || "";
//         const user = await getUserDetailsFromToken(token);
//         let _id = user._id;
//         let email = user.email;
//         let password = user.password;

//         if(user){
            

//         }
       

// }catch(error){
  
    
// }
// }


import { User } from "../Schema/model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { secret_key } from "../constant.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User does not exist",
        error: true,
      });
    }

    // Verify the password
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid password",
        error: true,
      });
    }

    // Generate JWT token
    const tokenData = {
      id: user._id,
      email: user.email,
    };

    const token = jwt.sign(tokenData, secret_key, { expiresIn: "7d" });

    // Cookie options
    const cookieOptions = {
      httpOnly: true,
      secure: true,
    };

    return res.cookie("token", token, cookieOptions).status(200).json({
      message: "Login successful",
      data: {
        id: user._id,
        email: user.email,
      },
      token,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
      error: true,
    });
  }
};
