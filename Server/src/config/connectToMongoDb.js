// import mongoose from "mongoose";
// import { mongo_url } from "../constant.js";

// const connectToMongoDb = async () => {
//   try {
//     await mongoose.connect(mongo_url);
//     console.log("✅ MongoDB Connected Successfully");
//   } catch (error) {
//     console.error("❌ MongoDB Connection Failed:", error);
//     process.exit(1);
//   }
// };

// export default connectToMongoDb;

// import mongoose from "mongoose";
// import { mongo_url } from "../constant.js";

// const connectToMongoDb = async () => {
//   // Set up listeners first
//   const connection = mongoose.connection;

//   connection.on("connected", () => {
//     console.log("✅ MongoDB Connected Successfully");
//   });

//   connection.on("error", (err) => {
//     console.error("❌ MongoDB Connection Error:", err);
//   });

//   // Then attempt connection
//   try {
//     await mongoose.connect(mongo_url);
//   } catch (error) {
//     console.error("❌ MongoDB Initial Connection Failed:", error);
//     process.exit(1);
//   }
// };

// export default connectToMongoDb;

import mongoose from "mongoose";
import { mongo_url } from "../constant.js";

const connectToMongoDb = async () => {
  mongoose.connection.on("connected", () => {
    console.log("✅ MongoDB Connected Successfully");
  });

  mongoose.connection.on("error", (err) => {
    console.error("❌ MongoDB Connection Error:", err);
  });

  try {
    await mongoose.connect(mongo_url, {
      serverSelectionTimeoutMS: 5000, // timeout after 5 seconds
    });
  } catch (error) {
    console.error("❌ MongoDB Initial Connection Failed:", error);
    process.exit(1);
  }
};

export default connectToMongoDb;


/* Before connecting to MongoDB, it is essential to set up event listeners in advance. If they are added after eestablishing the connection, there is a risk that the events may have already been triggered, causing them to be missed. */
