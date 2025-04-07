import { useNavigate } from "react-router-dom";
import { useLogin } from "../api/AuthApi";
import LoginForm from "../forms/LoginForm";
import { useSelector, useDispatch } from "react-redux";
import { setUserDetails } from "../redux/userSlice";

const LoginPage = () => {
  const { login, isLoggingIn } = useLogin();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (data) => {
    try {
      const userData = await login(data);
      dispatch(setUserDetails(userData)); // Save user in state

      // Check the user's role and navigate accordingly
      if (userData.role === "admin") {
        localStorage.setItem("admin", JSON.stringify(userData));
        navigate("/register-laundromat");
      } else {
        navigate("/");
      }
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
