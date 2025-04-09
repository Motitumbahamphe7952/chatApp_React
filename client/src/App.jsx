// import React, { useEffect } from "react";
// import { Outlet } from "react-router-dom";
// import { Bounce, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { SocketProvider } from "./socketContext";
// import { useDispatch } from "react-redux";
// import { setToken } from "./redux/userSlice";
// import axios from "axios";
// const App = () => {
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       dispatch(setToken(token));
//     }
//   }, [dispatch]);

//   axios.interceptors.request.use((config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   }, (error) => {
//     return Promise.reject(error);
//   });
//   return (
//     <>
//       <ToastContainer
//         position="top-right"
//         autoClose={5000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick={false}
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="light"
//         transition={Bounce}
//       />
//       <SocketProvider>
//         <main>
//           <Outlet />
//         </main>
//       </SocketProvider>
//     </>
//   );
// };

// export default App;



import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SocketProvider } from "./socketContext";
import { useDispatch } from "react-redux";
import { setToken } from "./redux/userSlice";
import axios from "axios";

// Set up axios interceptors once outside the component
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add response interceptor to handle token expiration
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Verify token validity on initial load
          const response = await axios.get(`${backendURL}/api/validate-token`);
          if (response.data.valid) {
            dispatch(setToken(token));
          } else {
            localStorage.removeItem('token');
          }
        } catch (error) {
          localStorage.removeItem('token');
          console.error('Token validation failed:', error);
        }
      }
    };

    initializeAuth();
  }, [dispatch]);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      <SocketProvider>
        <main>
          <Outlet />
        </main>
      </SocketProvider>
    </>
  );
};

export default App;