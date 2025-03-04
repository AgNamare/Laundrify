import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";
import { useVerifyCode } from "../api/authApi";

const VerifyCodePage = () => {
  const [code, setCode] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const { verifyCode, isVerifying } = useVerifyCode();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleChange = (index, value) => {
    if (isNaN(value)) return; // Ignore non-numeric input

    const newCode = [...code];
    newCode[index] = value.slice(-1); // Only allow one digit
    setCode(newCode);

    // Move to next input if there's a value
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const verificationCode = code.join(""); // Combine the digits into a string

    if (verificationCode.length !== 4) {
      console.error("Please enter all 4 digits");
      return;
    }

    try {
      const response = await verifyCode({
        email: user.email,
        code: verificationCode,
      });

      if (response.success) {
        navigate("/dashboard"); // Redirect on success
      }
    } catch (error) {
      console.error("Verification failed:", error);
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="">
      <div className="flex flex-col items-center justify-center sm:min-h-screen sm:w-full mx-auto">
        <div className="flex flex-col items-center sm:border border-textSecondary p-8 rounded-xl">
          <div className="flex justify-end ">
            <Link to="/">
              <img src={logo} alt="Logo" className="w-32" />
            </Link>
          </div>
          <h1 className="text-3xl font-semibold mb-2">Verify Your Account</h1>
          <p className="text-textSecondary mb-4">
            Enter the 4-digit code sent to your email.
          </p>

          <div className="flex gap-2">
            {code.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                className="w-12 h-12 text-xl text-center border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                ref={(el) => (inputRefs.current[index] = el)}
              />
            ))}
          </div>

          <button
            onClick={handleSubmit}
            disabled={isVerifying || code.includes("")}
            className="w-full bg-primary text-white font-semibold py-3 rounded-full mt-4 transition hover:opacity-90"
          >
            {isVerifying ? "Verifying..." : "Verify"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyCodePage;
