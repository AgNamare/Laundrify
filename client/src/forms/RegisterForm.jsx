import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import logo from "../assets/images/logo.png";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import Loader from "@/components/Loader";
import { useState } from "react";

const formSchema = z
  .object({
    fName: z.string().min(3, "Name must be at least 3 characters long."),
    lName: z.string().min(3, "Name must be at least 3 characters long."),
    phoneNumber: z.string().min(10, "Please enter a valid phone number."),
    email: z.string().email("Please enter a valid email address."),
    password: z.string().min(8, "Password must be at least 8 characters long."),
    confirmPassword: z.string().min(8, "Confirm Password must match Password."),
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
  } = useForm({
    resolver: zodResolver(formSchema),
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="bg-white h-fit w-screen md:max-w-[500px] p-4 md:p-12 md:border rounded-xl">
      <div className="flex flex-col gap-3">
        <Link to="/">
          <img src={logo} alt="Logo" className="w-28 h-fit" />
        </Link>
        <h1 className="text-3xl">Create an Account</h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSave)}>
          <input
            {...register("fName")}
            type="text"
            placeholder="Enter First Name"
            className={`w-full border-b pb-5 outline-none ${
              errors.fName ? "border-[#E71926]" : "border-[#194A3491]"
            }`}
          />
          {errors.fName && <p className="text-[#E71926]">{errors.fName.message}</p>}
          <input
            {...register("lName")}
            type="text"
            placeholder="Enter Last Name"
            className={`w-full border-b pb-5 outline-none ${
              errors.lName ? "border-[#E71926]" : "border-[#194A3491]"
            }`}
          />
          {errors.lName && <p className="text-[#E71926]">{errors.lName.message}</p>}
          

          <input
            {...register("phoneNumber")}
            type="text"
            placeholder="Enter Phone Number"
            className={`w-full border-b pb-5 outline-none ${
              errors.phoneNumber ? "border-[#E71926]" : "border-[#194A3491]"
            }`}
          />
          {errors.phoneNumber && (
            <p className="text-[#E71926]">{errors.phoneNumber.message}</p>
          )}

          <input
            {...register("email")}
            type="text"
            placeholder="Enter Email Address"
            className={`w-full border-b pb-5 outline-none ${
              errors.email ? "border-[#E71926]" : "border-[#194A3491]"
            }`}
          />
          {errors.email && <p className="text-[#E71926]">{errors.email.message}</p>}

          <div className="relative">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className={`w-full border-b pb-5 outline-none ${
                errors.password ? "border-[#E71926]" : "border-[#194A3491]"
              }`}
            />
            <button
              type="button"
              className="absolute right-2 top-2"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-[#E71926]">{errors.password.message}</p>
          )}

          <div className="relative">
            <input
              {...register("confirmPassword")}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className={`w-full border-b pb-5 outline-none ${
                errors.confirmPassword ? "border-[#E71926]" : "border-[#194A3491]"
              }`}
            />
            <button
              type="button"
              className="absolute right-2 top-2"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-[#E71926]">{errors.confirmPassword.message}</p>
          )}

          <button
            disabled={isLoading}
            type="submit"
            className={`bg-primary flex justify-center items-center text-white p-3 w-full rounded-3xl transition-colors duration-200 hover:opacity-80 ${
              isLoading ? "opacity-60 cursor-default" : "cursor-pointer"
            }`}
          >
            {isLoading ? <Loader /> : "Register"}
          </button>

          <div className="flex items-center">
            <div className="flex-1 mr-5 border-t border-[#1E4E38]"></div>
            <div className="text-[#1E4E38]">Already have an account?</div>
            <div className="flex-1 ml-5 border-t border-[#1E4E38]"></div>
          </div>
          <Link to="/login">
            <div className="cursor-pointer border-[1px] text-center p-3 text-primary border-primary transition duration-300 ease-in-out transform hover:scale-105 hover:border-[#194A45]">
              Login
            </div>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
