import { User } from "../Schema/model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { secret_key } from "../constant.js";
export const checkPassword = async (req, res) => {
  try {
    const { password, userid } = req.body;
    const user = await User.findById(userid);
    const verifyPassword = await bcryptjs.compare(password, user.password);
    if (!verifyPassword) {
      return res.status(400).json({
        message: "please check password",
        error: true,
      });
    }

    const tokenData = {
      id: user._id,
      email: user.email,
    };

    const token = jwt.sign(tokenData, secret_key, {
      expiresIn: "7d",
    });

    const cookieOption = {
      http : true,
      secure : true,
    };

    return res.cookie('token',token,cookieOption).status(200).json({
      message: "login successfully",
      data: user,
      token: token,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
};
