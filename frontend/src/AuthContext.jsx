import React, { createContext, useContext, useState } from "react";
import { loginUser, registerUser, forgotPassword as forgotPasswordApi, resetPassword as resetPasswordApi } from "./services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("conferio_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    setError(null);
    try {
      const data = await loginUser(email, password);
      localStorage.setItem("conferio_token", data.token);
      localStorage.setItem("conferio_user", JSON.stringify(data.user));
      setUser(data.user);
      return true;
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed");
      return false;
    }
  };

  const register = async (email, password, name) => {
    setError(null);
    try {
      const data = await registerUser(email, password, name);
      localStorage.setItem("conferio_token", data.token);
      localStorage.setItem("conferio_user", JSON.stringify(data.user));
      setUser(data.user);
      return true;
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed");
      return false;
    }
  };

  const forgotPassword = async (email) => {
    setError(null);
    try {
      await forgotPasswordApi(email);
      return true;
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong. Please try again.");
      return false;
    }
  };

  const resetPassword = async (token, newPassword) => {
    setError(null);
    try {
      await resetPasswordApi(token, newPassword);
      return true;
    } catch (err) {
      setError(err.response?.data?.detail || "Could not reset password");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("conferio_token");
    localStorage.removeItem("conferio_user");
    setUser(null);
  };

  return (  
    <AuthContext.Provider value={{ user, login, register, logout, error, forgotPassword, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}