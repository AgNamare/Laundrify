import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import logo from "../assets/images/logo.png";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import Loader from "@/components/Loader";

const formSchema = z.object({
  email: z.string().email("Please enter a valid Email Address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const LoginForm = ({ onSave, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(formSchema) });

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="bg-white sm:border sm:border-textSecondary sm:rounded-xl w-full max-w-md mx-auto p-2 space-y-3">
      {/* Logo */}
      <div className="flex justify-end mt-6">
        <Link to="/">
          <img src={logo} alt="Logo" className="w-32" />
        </Link>
      </div>

      {/* Heading */}
      <div className="flex gap-1 flex-col">
        <h1 className="text-3xl font-semibold text-textPrimary">
          Let's get Started
        </h1>
        <h3 className="text-textSecondary text-textPrimary">
          LogIn into your account
        </h3>
      </div>

      {/* Form */}
      <form className="space-y-3" onSubmit={handleSubmit(onSave)}>
        <input
          {...register("email")}
          type="email"
          placeholder="Email Address"
          className={`w-full p-3 rounded-md border ${
            errors.email ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}

        <div className="relative">
          <input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className={`w-full p-3 rounded-md border ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
          />
          <button
            type="button"
            className="absolute top-3 right-3 text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}

        {/* Submit Button */}
        <button
          disabled={isLoading}
          type="submit"
          className="w-full bg-primary text-white font-semibold py-3 rounded-full mt-4 transition hover:opacity-90"
        >
          {isLoading ? <Loader /> : "Login"}
        </button>
      </form>

      {/* Register Redirect */}
      <div className="text-center text-textSecondary">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="text-primary font-small hover:underline"
        >
          Register
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
