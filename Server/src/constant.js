import dotenv from "dotenv";
dotenv.config();

export const frontend_url = process.env.FRONTEND_URL;
export const port = process.env.PORT || 5000;
export const mongo_url = process.env.MONGODB_URL;
export const secret_key = process.env.SECRET_KEY;