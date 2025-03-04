import { useNavigate } from "react-router-dom";
import { useLogin } from "../api/authApi";
import LoginForm from "../forms/LoginForm";
import logo from "../assets/images/logo.png";

const LoginPage = () => {
  const { login, isLoggingIn } = useLogin();
  const navigate = useNavigate();

  const handleLogin = async (data) => {
    try {
      await login(data);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="flex sm:min-h-screen items-center justify-center ">
        <LoginForm onSave={handleLogin} isLoading={isLoggingIn} />
    </div>
  );
};

export default LoginPage;
