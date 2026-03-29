import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SocketProvider } from "./socketContext";
import { useDispatch } from "react-redux";
import { setToken } from "./redux/userSlice";
const App = () => {
  const dispatch = useDispatch();
  const [tokenReady, setTokenReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(setToken(token));
    }
    setTokenReady(true);
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

      {tokenReady && localStorage.getItem("token")?(
        <SocketProvider>
        <main>
          <Outlet />
        </main>
      </SocketProvider>
      ):(
        <main>
          <Outlet />
        </main>
      )}
      
    </>
  );
};

export default App;
