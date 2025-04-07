import React, { useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { uploadFile } from "../helpers/uploadFile.js";
import { backendURL } from "../constant.js";
import axios from "axios";
import { toast } from "react-toastify";

const RegisterPage = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    profilepic: "",
  });
  const [uploadPhoto, setUploadPhoto] = useState(null);
  const navigate = useNavigate();

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      toast.error("No file selected.");
      return;
    }

    try {
      console.log("Uploading file:", file); // Debugging

      const uploadedPhotoUrl = await uploadFile(file); // ✅ Fix: This now gets the actual URL
      console.log("Uploaded photo URL:", uploadedPhotoUrl?.secure_url); // Debugging

      if (uploadedPhotoUrl) {
        setUploadPhoto(file);
        setData((prev) => ({
          ...prev,
          profilepic: uploadedPhotoUrl?.secure_url, // ✅ Fix: Now correctly assigning the URL
        }));
      } else {
        toast.error("Failed to upload image.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Error uploading photo.");
    }
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };

  const handleClearUploadPhoto = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setUploadPhoto(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const URL = `${backendURL}/api/register`;

    try {
      const response = await axios.post(URL, data);
      console.log("response:", data);

      toast.success(response?.data?.message);

      if (response.data.success) {
        setData({
          name: "",
          email: "",
          password: "",
          profilepic: "",
        });

        navigate("/login");
      }
    } catch (error) {
      toast.error(error?.reponse?.data?.message);
      console.log("error:", error);
    }

    console.log("data:", data);
  };

  return (
    <div className="mt-5">
      <div className="bg-white w-full max-w-md mx-auto rounded overflow-hidden p-4 ">
        <h3>Welcome to Chat App</h3>

        <form className="grid gap-4 mt-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="name">Name :</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder=" Enter your name"
              className="bg-slate-100 px-2 py-1 focus:outline-primary rounded"
              value={data.name}
              onChange={handleOnChange}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="email">Email :</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder=" Enter your email"
              className="bg-slate-100 px-2 py-1 focus:outline-primary rounded"
              value={data.email}
              onChange={handleOnChange}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password">Password :</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder=" Enter your password"
              className="bg-slate-100 px-2 py-1 focus:outline-primary rounded"
              value={data.password}
              onChange={handleOnChange}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="profilepic">
              Photo :
              <div className="flex justify-center p-4">
                {data.profilepic ? (
                  <img
                    src={data?.profilepic}
                    alt="Profile Preview"
                    className="rounded-full w-50 h-50 object-cover border border-gray-300"
                  />
                ) : (
                  <div className="w-30 h-30 bg-gray-200 rounded-full flex items-center justify-center">
                    <p className="text-sm text-gray-500">No Image</p>
                  </div>
                )}
              </div>
              <div className="h-14 bg-slate-200 flex justify-center items-center border-3 border-transparent rounded hover:border-primary cursor-pointer">
                <p className="text-sm max-w-[300px] text-ellipsis line-clamp-1">
                  {uploadPhoto?.name
                    ? uploadPhoto?.name
                    : "Upload Profile Photo"}
                </p>

                {uploadPhoto?.name && (
                  <button
                    className="text-xl ml-2 hover:text-red-500"
                    onClick={handleClearUploadPhoto}
                  >
                    <IoMdCloseCircle />
                  </button>
                )}
              </div>
            </label>

            <input
              type="file"
              id="profilepic"
              name="profilepic"
              className="bg-slate-100 px-2 py-1 focus:outline-primary hidden"
              onChange={handleUploadPhoto}
            />
          </div>

          <button
            className="bg-primary text-lg px-4 py-1 hover:bg-secondary rounded mt-2 font-bold text-white leading-relaxed tracking-wide"
            type="submit"
          >
            Register
          </button>
        </form>

        <p className="mt-4 my-3 text-center">
          Already have an Account ?{" "}
          <Link to={"/email"} className="hover:text-secondary hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
