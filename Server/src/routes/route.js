// import express from "express";
// import { registerUser } from "../controller/register.js";
// import { checkEmail } from "../controller/checkEmail.js";
// import { checkPassword } from "../controller/checkPassword.js";
// import { userDetails } from "../controller/userDetails.js";
// import { logout } from "../controller/logout.js";
// import { updateUserDetails } from "../controller/updateUserDetails.js";

// export const router = express.Router();

// //create user api
// router.post("/register", registerUser);
// //checkuser email
// router.post("/email", checkEmail);
// //check user password
// router.post("/password", checkPassword);
// //login user details
// router.get("/userdetails", userDetails);
// //login user
// router.post("/login", login);
// //logout user
// router.get("/logout", logout);
// //update user details
// router.post("/updateuser", updateUserDetails);

import express from "express";
import { registerUser } from "../controller/register.js";
import { checkEmail } from "../controller/checkEmail.js";
import { checkPassword } from "../controller/checkPassword.js";
import { userDetails } from "../controller/userDetails.js";
import { login } from "../controller/login.js";
import { logout } from "../controller/logout.js";
import { updateUserDetails } from "../controller/updateUserDetails.js";
import { searchUser } from "../controller/searchUser.js";

export const router = express.Router();

// User registration and details
router.route("/register").post(registerUser); // Create a new user

router.route("/userdetails").get(userDetails); // Get user details

// Email and password checks
router.route("/email").post(checkEmail); // Check if email exists

router.route("/password").post(checkPassword); // Check if password is valid

// Login and logout
router.route("/login").post(login); // Login user

router.route("/logout").get(logout); // Logout user

// Update user details
router.route("/updateuser").patch(updateUserDetails); // Update user details

router.route("/searchuser").post(searchUser); // Search for users
