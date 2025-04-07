import { User } from "../Schema/model.js";

export const searchUser = async (req, res) => {
  try {
    const { search } = req.body;
    const query = new RegExp(search, "ig"); //The RegExp constructor only accepts two parameters:

    const user = await User.find({
      $or: [{ name: query }, { email: query }, { profilepic: query }],
    }).select("-password");
    return res.status(200).json({
      message: " All User",
      success: true,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
};

// import { User } from "../Schema/model";

// export const searchUser = async (req, res) => {
//     try {
//         const { search } = req.body;

//         // Validate input
//         if (!search) {
//             return res.status(400).json({
//                 message: "Search term is required",
//                 success: false
//             });
//         }

//         // Query database using MongoDB regex
//         const users = await User.find({
//             "$or": [
//                 { name: { $regex: search, $options: "i" } },
//                 { email: { $regex: search, $options: "i" } }
//             ]
//         });

//         return res.status(200).json({
//             message: "All Users",
//             success: true,
//             data: users,
//         });
//     } catch (error) {
//         return res.status(500).json({
//             message: error.message || "Internal Server Error",
//             error: true,
//         });
//     }
// };
