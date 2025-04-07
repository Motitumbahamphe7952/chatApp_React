import React, { useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { uploadFile } from "../helpers/uploadFile.js";
import { backendURL } from "../constant.js";
import axios from "axios";
import { toast } from "react-toastify";
import { FaRegUserCircle } from "react-icons/fa";
import { PiUserCircleThin } from "react-icons/pi";

const CheckEmailPage = () => {
  const [data, setData] = useState({
    email: "",
  });
  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const URL = `${backendURL}/api/register`;

    try {
      const response = await axios.post(URL, data);

      toast.success(response?.data?.message);

      if (response.data.success) {
        setData({
          email: "",
        });

        navigate("/password");
      }
    } catch (error) {
      toast.error(error?.reponse?.data?.message);
      console.log("error:", error);
    }
  };

  return (
    <div className="mt-5">
      <div className="bg-white w-full max-w-md mx-auto rounded overflow-hidden p-4 ">
        <div className="w-fit mx-auto mb-2 ">
          <PiUserCircleThin size={80} className="text-dirtygreen" />
        </div>
        <h3>Welcome to Chat App</h3>

        <form className="grid gap-4 mt-3" onSubmit={handleSubmit}>
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
         
          <button
            className="bg-primary text-lg px-4 py-1 hover:bg-secondary rounded mt-2 font-bold text-white leading-relaxed tracking-wide"
            type="submit"
          >
            Register
          </button>
        </form>

        <p className="mt-4 my-3 text-center">
          New User ?{" "}
          <Link
            to={"/register"}
            className="hover:text-secondary hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CheckEmailPage;
