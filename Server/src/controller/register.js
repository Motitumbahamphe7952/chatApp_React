import bcryptjs from "bcryptjs";
import { User } from "../Schema/model.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, profilepic } = req.body;

    const checkEmail = await User.findOne({ email }); // {name,email} // null

    if (checkEmail) {
      return res.status(400).json({
        message: "Email already exists",
        error: true,
      });
    }
    //password into hashpassword
    const salt = await bcryptjs.genSalt(10);
    const hashpassword = await bcryptjs.hash(password, salt);

    const payload = {
      name,
      email,
      password: hashpassword,
      profilepic,
    };
    const user = new User(payload);
    const userSave = await user.save();
    return res.status(200).json({
      message: "User Registered Successfully",
      success: true,
      data: userSave,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
};
