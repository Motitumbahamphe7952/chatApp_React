// import React, { useEffect } from "react";
// import { Outlet, useLocation, useNavigate } from "react-router-dom";
// import { backendURL } from "../constant.js";
// import axios from "axios";
// import { useDispatch, useSelector } from "react-redux";
// import { logout,  setUser } from "../redux/userSlice.js";
// import Sidebar from "../components/Sidebar.jsx";
// import logo from "../assets/logo.png";
// import io from "socket.io-client";

// const Home = () => {
//   const user = useSelector((state) => state.user);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();

//   console.log("redux user", user);
//   const fetchUserDetails = async () => {
//     try {
//       const URL = `${backendURL}/api/userdetails`;
//       const response = await axios({
//         method: "GET",
//         url: URL,
//         withCredentials: true,
//       });

//       // console.log(response);

//       dispatch(setUser(response?.data?.data));

//       if (response.data.data.logout) {
//         dispatch(logout());
//         navigate("/login");
//       }
//       // console.log("current user details", response?.data?.data);
//     } catch (error) {
//       console.log("error:", error);
//     }
//   };
//   useEffect(() => {
//     fetchUserDetails();
//   }, []);

//   // socket connection
//   useEffect(()=>{
//     const socketConnection = io(backendURL, {
//       auth: {
//         token: localStorage.getItem("token")
//       }
//     })

//     socketConnection.on("onlineuser", (data) => {
//       console.log(data);
//       dispatch(setOnlineUser(data));
//     });

//     dispatch(setSocketConnection(socketConnection))

//     return ()=>{
//       socketConnection.disconnect()
//     }
//   },[])


//   // console.log("location:", location);
//   const basePath = location.pathname === "/";
//   return (
//     <div className="grid lg:grid-cols-[320px_auto] h-screen max-h-screen">
//       <section className={`bg-white ${!basePath && "hidden"} lg:block`}>
//         <Sidebar />
//       </section>

//       <section className={`${basePath && "hidden"}`}>
//         <Outlet />
//       </section>

//       <div className={`flex-col items-center justify-center hidden pb-20 ${!basePath ? "hidden":"lg-flex"}`}>
//         <div className="mb-[-100px]">
//           <img
//             src={logo}
//             width="500"
//             alt="image preview"
//             className="opacity-60"
//           />
//         </div>
//         <p className="text-3xl text-slate-500/40 mt-0 leading-none">
//           Select user to send message
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Home;


import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { backendURL } from "../constant.js";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { logout, setUser } from "../redux/userSlice.js"; 
import Sidebar from "../components/Sidebar.jsx";
import logo from "../assets/logo.png";
import { useSocket } from "../socketContext.jsx"; // ✅ Use context API

const Home = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { onlineUsers } = useSocket(); // ✅ Get online users from context

  console.log("redux user", user);
  console.log("online users", onlineUsers); // ✅ Now onlineUsers come from Context API

  const fetchUserDetails = async () => {
    try {
      const URL = `${backendURL}/api/userdetails`;
      const response = await axios({
        method: "GET",
        url: URL,
        withCredentials: true,
      });

      dispatch(setUser(response?.data?.data));

      if (response.data.data.logout) {
        dispatch(logout());
        navigate("/login");
      }
    } catch (error) {
      console.log("error:", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const basePath = location.pathname === "/";
  return (
    <div className="grid lg:grid-cols-[320px_auto] h-screen max-h-screen">
      <section className={`bg-white ${!basePath && "hidden"} lg:block`}>
        <Sidebar />
      </section>

      <section className={`${basePath && "hidden"}`}>
        <Outlet />
      </section>

      <div
        className={`flex-col items-center justify-center hidden pb-20 ${
          !basePath ? "hidden" : "lg-flex"
        }`}
      >
        <div className="mb-[-100px]">
          <img
            src={logo}
            width="500"
            alt="image preview"
            className="opacity-60"
          />
        </div>
        <p className="text-3xl text-slate-500/40 mt-0 leading-none">
          Select user to send message
        </p>
      </div>
    </div>
  );
};

export default Home;
