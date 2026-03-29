// import jwt from "jsonwebtoken";
// import { secret_key } from "../constant.js";
// import { User } from "../Schema/model.js";

// export const getUserDetailsFromToken = async (token) => {
//   if (!token) {
//     return {
//       message: "session out",
//       logout: true,
//     };
//   }

//   const decode = await jwt.verify(token, secret_key);
//   const user = await User.findById(decode.id);

//   return user;
// };


import jwt from "jsonwebtoken";
import { secret_key } from "../constant.js";
import { User } from "../Schema/model.js";

export const getUserDetailsFromToken = async (token) => {
  if (!token) {
    return {
      message: "Session expired",
      logout: true,
    };
  }

  try {
    const decoded = jwt.verify(token, secret_key); // Do NOT await this
    const user = await User.findById(decoded.id);

    if (!user) {
      return {
        message: "User not found",
        logout: true,
      };
    }

    return user;
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return {
        message: "Token expired",
        logout: true,
      };
    }

    console.error("JWT error:", err.message);

    return {
      message: "Invalid token",
      logout: true,
    };
  }
};
