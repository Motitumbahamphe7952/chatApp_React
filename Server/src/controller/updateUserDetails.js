import { getUserDetailsFromToken } from "../helpers/getUserDetailsFromToken.js";
import { User } from "../Schema/model.js";

export const updateUserDetails = async (req, res) => {
  try {
    const token = req.cookies.token || "";
    const user = await getUserDetailsFromToken(token);

    let _id = user._id;
    let data = req.body;
    delete data.email;
    delete data.password;

    await User.findByIdAndUpdate(_id, data, { new: true });
    let userdata = await User.findById(_id);

    return res.status(200).json({
      message: "User details updated successfully",
      success: true,
      data: userdata
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
};



/* 
import { getUserDetailsFromToken } from "../helpers/getUserDetailsFromToken.js";
import { User } from "../Schema/model.js";

export const updateUserDetails = async (req, res) => {
    try {
        const token = req.cookies.token || "";
        const user = await getUserDetailsFromToken(token);

        const { name, profilepic } = req.body;
        await User.updateOne({_id : user._id}, {name, profilepic});

        const userInformation = await User.findById(user._id);
        return res.status(200).json({
            message: "User details updated successfully",
            success: true,
            data: userInformation,
        });

    }catch(error){
        return res.status(500).json({
            message: error.message || error,
            error: true,
        });
    }
}


*/
