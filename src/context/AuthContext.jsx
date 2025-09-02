import React, { createContext, useContext, useEffect, useState } from "react";
import API from "../lib/api";

const Ctx = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const saved = localStorage.getItem("user");

    if (token && saved) {
      setUser(JSON.parse(saved));

      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await API.post("/auth/login", { email, password });

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    API.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

    setUser(data.user);
    return data.user;
  };

  const register = async (payload) => {
    const { data } = await API.post("/auth/register", payload);

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    API.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);

    delete API.defaults.headers.common["Authorization"];
  };

  return (
    <Ctx.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </Ctx.Provider>
  );
};

export const useAuth = () => useContext(Ctx);
