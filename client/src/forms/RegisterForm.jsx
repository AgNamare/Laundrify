import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import logo from "../assets/images/logo.png";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import Loader from "@/components/Loader";
import { useState } from "react";

// Define form validation schema with role
const formSchema = z
  .object({
    fName: z.string().min(3, "First name must be at least 3 characters."),
    lName: z.string().min(3, "Last name must be at least 3 characters."),
    phoneNumber: z.string().min(10, "Enter a valid phone number."),
    email: z.string().email("Enter a valid email address."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string().min(8, "Confirm password must match."),
    role: z.enum(["user", "admin"], {
      errorMap: () => {
        return { message: "Please select a valid role." };
      },
    }), // Added role validation
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

const RegisterForm = ({ onSave, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(formSchema) });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="bg-white sm:border border-textSecondary sm:rounded-xl w-full max-w-md mx-auto p-2  space-y-3">
      {/* Logo */}
      <div className="flex justify-end mt-6">
        <Link to="/">
          <img src={logo} alt="Logo" className="w-32" />
        </Link>
      </div>

      {/* Heading */}
      <div className="flex gap-1 flex-col">
        <h1 className=" text-3xl font-semibold text-textPrimary">Register</h1>
        <h3 className="text-textSecondary  text-textPrimary">
          Create new Account For You
        </h3>
      </div>

      {/* Form */}
      <form className="space-y-3" onSubmit={handleSubmit(onSave)}>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <input
              {...register("fName")}
              type="text"
              placeholder="First Name"
              className={`w-full p-3 rounded-md border ${
                errors.email
                  ? "border-red-300"
                  : "border-gray-300 focus:border-primary"
              }  focus:outline-none`}
            />
            {errors.fName && (
              <p className="text-red-500 text-sm">{errors.fName.message}</p>
            )}
          </div>
          <div>
            <input
              {...register("lName")}
              type="text"
              placeholder="Last Name"
              className={`w-full p-3 rounded-md border ${
                errors.email
                  ? "border-red-500"
                  : "border-gray-300 focus:border-primary"
              }  focus:outline-none`}
            />
            {errors.lName && (
              <p className="text-red-500 text-sm">{errors.lName.message}</p>
            )}
          </div>
        </div>

        <input
          {...register("phoneNumber")}
          type="text"
          placeholder="Phone Number"
          className={`w-full p-3 rounded-md border ${
            errors.email
              ? "border-red-200"
              : "border-gray-300 focus:border-primary"
          }  focus:outline-none`}
        />
        {errors.phoneNumber && (
          <p className="text-red-400 text-sm">{errors.phoneNumber.message}</p>
        )}

        <input
          {...register("email")}
          type="email"
          placeholder="Email Address"
          className={`w-full p-3 rounded-md border ${
            errors.email
              ? "border-red-500"
              : "border-gray-300 focus:border-primary"
          }  focus:outline-none`}
        />
        {errors.email && (
          <p className="text-red-400 text-sm">{errors.email.message}</p>
        )}

        {/* Password Fields */}
        <div className="relative">
          <input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className={`w-full p-3 rounded-md border ${
              errors.email
                ? "border-red-500"
                : "border-gray-300 focus:border-primary"
            }  focus:outline-none`}
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
          <p className="text-red-400 text-sm">{errors.password.message}</p>
        )}

        <div className="relative">
          <input
            {...register("confirmPassword")}
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            className={`w-full p-3 rounded-md border ${
              errors.email
                ? "border-red-500"
                : "border-gray-300 focus:border-primary"
            }  focus:outline-none`}
          />
          <button
            type="button"
            className="absolute top-3 right-3 text-gray-500"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-red-400 text-sm">
            {errors.confirmPassword.message}
          </p>
        )}

        {/* Role Field */}
        <div>
          <label htmlFor="role" className="block text-sm text-gray-600 mb-1">
            Select Role
          </label>
          <select
            {...register("role")}
            id="role"
            className={`w-full p-3 rounded-md border ${
              errors.role ? "border-red-500" : "border-gray-300"
            } focus:outline-none`}
          >
            <option value="user">User</option>
            <option value="admin">Laundromat Admin</option>
          </select>
          {errors.role && (
            <p className="text-red-500 text-sm">{errors.role.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          disabled={isLoading}
          type="submit"
          className="w-full bg-primary text-white font-semibold py-3 rounded-full mt-4 transition hover:opacity-90"
        >
          {isLoading ? <Loader /> : "Sign Up"}
        </button>
      </form>

      {/* Login Redirect */}
      <div className="text-center text-textSecondary">
        Already have an account?{" "}
        <Link to="/login" className="text-primary font-small hover:underline">
          Login
        </Link>
      </div>
    </div>
  );
};

export default RegisterForm;
