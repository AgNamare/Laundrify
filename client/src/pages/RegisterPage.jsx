
// src/pages/AdminLoginPage.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import RegisterForm from "../forms/RegisterForm";
import { useRegister } from "../api/authApi";

const RegisterPage = () => {
  const { register, isRegistering } = useRegister();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleRegister = async (data) => {
    console.log("Admin login attempt with data:", data);
    try {
      const newUser = await register(data);
      localStorage.setItem("user", JSON.stringify(newUser));
      navigate("/verify");
      console.log(newUser);
    } catch (error) {
      console.error("Login failed:", error);
      console.error("Error response:", error.response);
    }
  };

  return (
    <div className="flex sm:min-h-screen items-center justify-center ">
      <RegisterForm onSave={handleRegister} isLoading={isRegistering} />
    </div>
  );
};

export default RegisterPage;