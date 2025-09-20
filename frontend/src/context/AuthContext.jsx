import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [userLoading, setUserLoading] = useState(true);

  const getUserProfile = async () => {
    if (!userLoading && !token) {
      setToken(null);
      setUser(null);
      return;
    }

    try {
      setUserLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Correct spelling
          },
        }
      );
      console.log(res);
      setUser(res.data.user)
    } catch (error) {
      console.log({ error });
    } finally {
      setUserLoading(false);
    }
  };

  // Persist in localStorage
  useEffect(() => {
    if (token && user) {
      localStorage.setItem("token", token);
    }
  }, [token, user]);

  

  useEffect(() => {
    if (!userLoading && !token) return;
    getUserProfile();
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
        userLoading,
        setUserLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
