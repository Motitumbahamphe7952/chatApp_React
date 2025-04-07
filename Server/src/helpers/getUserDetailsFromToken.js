import jwt from "jsonwebtoken";
import { secret_key } from "../constant.js";
import { User } from "../Schema/model.js";

export const getUserDetailsFromToken = async (token) => {
  if (!token) {
    return {
      message: "session out",
      logout: true,
    };
  }

  const decode = await jwt.verify(token, secret_key);
  const user = await User.findById(decode.id);

  return user;
};
