// src/context/SocketContext.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const SocketProvider = ({ user, children }) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const audioRef = useRef(null);

  useEffect(() => {
    if (user) {
      const s = io(import.meta.env.VITE_BACKEND_URL, {
        auth: { token: localStorage.getItem("token") }, // optional
      });

      s.on("connect", () => {
        console.log("Socket connected", s.id);
        // register userId to backend
        s.emit("register_user", user._id);
      });

      setSocket(s);
      return () => s.disconnect();
    }
  }, [user]);

  useEffect(() => {
    if (!socket) return;
    socket.on("phishing_check_complete", (data) => {
      console.log({ phishing_check_complete: data });
      audioRef?.current?.play();
      setNotifications((prev) => [...data.newResults, ...prev]);
    });

    return () => {
      console.log("return socket");
      // socket.off("phishing_check_complete");
    };
  }, [socket]);

  return (
    <SocketContext.Provider
      value={{ socket, setNotifications, notifications, audioRef }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
