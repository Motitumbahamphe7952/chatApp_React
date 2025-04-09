

// import { createContext, useContext, useEffect, useState } from "react";
// import { io } from "socket.io-client";
// import { backendURL } from "./constant"; // Ensure this is the correct backend URL

// const SocketContext = createContext(null);

// export const SocketProvider = ({ children }) => {
//   const [socket, setSocket] = useState(null);
//   const [onlineUsers, setOnlineUsers] = useState([]);

//   useEffect(() => {
//     // Establish a connection to the backend WebSocket server
//     const newSocket = io(backendURL, {
//       auth: {
//         token: localStorage.getItem("token"), // Send auth token from localStorage
//       },
//     });

//     // Handle connection event
//     newSocket.on("connect", () => {
//       console.log("Connected to backend WebSocket with ID:", newSocket.id);
//     });

//     // Listen for the "onlineuser" event from the backend
//     newSocket.on("onlineuser", (data) => {
//       console.log("Online users received from backend:", data);
//       setOnlineUsers(data); // Update state with online users
//     });

//     // Handle "message-page" event (optional, if needed)
//     newSocket.on("message-page", (userId) => {
//       console.log("User is on message page:", userId);
//     });

//     // Save the socket instance in state
//     setSocket(newSocket);

//     return () => {
//       newSocket.disconnect(); // Cleanup on unmount
//     };
//   }, []);

//   return (
//     <SocketContext.Provider value={{ socket, onlineUsers }}>
//       {children}
//     </SocketContext.Provider>
//   );
// };

// // Custom hook to use socket context
// export const useSocket = () => useContext(SocketContext);


import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { backendURL } from "./constant"; // Ensure this is the correct backend URL

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    // Establish a connection to the backend WebSocket server
    const newSocket = io(backendURL, {
      // Ensure withCredentials is true if your server requires CORS with credentials
      withCredentials: true,
      
      // (Optional) specify transports if you want to force or allow fallback
      transports: ["websocket", "polling"],
      
      // Send auth token from localStorage (if your server uses socket.handshake.auth.token)
      auth: {
        token: localStorage.getItem("token"),
      },
    });

    // Handle connection event
    newSocket.on("connect", () => {
      console.log("Connected to backend WebSocket with ID:", newSocket.id);
    });

    // Listen for the "onlineuser" event from the backend
    newSocket.on("onlineuser", (data) => {
      console.log("Online users received from backend:", data);
      setOnlineUsers(data); // Update state with online users
    });

    // Handle "message-page" event (optional, if needed)
    newSocket.on("message-page", (userId) => {
      console.log("User is on message page:", userId);
    });

    // Save the socket instance in state
    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook to use socket context
export const useSocket = () => useContext(SocketContext);
