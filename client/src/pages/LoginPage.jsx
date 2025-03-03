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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <img src={logo} alt="Laundrify Logo" className="mx-auto mb-4 w-32" />
        <h1 className="text-2xl font-semibold text-center mb-4">Login</h1>
        <LoginForm onSave={handleLogin} isLoading={isLoggingIn} />
      </div>
    </div>
  );
};

export default LoginPage;
