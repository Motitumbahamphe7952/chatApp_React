import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { backendURL } from "../constant.js";
import axios from "axios";
import { toast } from "react-toastify";
import { PiUserCircleThin } from "react-icons/pi";
import { useDispatch } from "react-redux";
import { setToken } from "../redux/userSlice.js";
const LoginPage = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
    const URL = `${backendURL}/api/login`;

    try {
      const response = await axios({
        method: "post",
        url: URL,
        data: {
          userId: data._id,
          email: data.email,
          password: data.password,
        },
        withCredentials: true,
      });

      toast.success(response?.data?.message);

      if (response.data.success) {
        dispatch(setToken(response?.data?.token));
        localStorage.setItem("token", response?.data?.token);

        setData({
          email: "",
          password: "",
        });

        navigate("/");
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

          <button
            className="bg-primary text-lg px-4 py-1 hover:bg-secondary rounded mt-2 font-bold text-white leading-relaxed tracking-wide"
            type="submit"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
