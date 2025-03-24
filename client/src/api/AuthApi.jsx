import { useMutation } from "react-query";
import axios from "@/api/axios.js";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import {
  setUserDetails,
  setLoading,
  setError,
  clearError,
} from "../redux/userSlice"; // Import Redux actionsl

export const useRegister = () => {
  const registerRequest = async (userData) => {
    try {
      const response = await axios.post("/api/v1/auth/register", userData);
      return response.data;
    } catch (error) {
      console.log(error);
      throw new Error(error.response?.data?.message || "An error occurred");
    }
  };

  const { mutateAsync: register, isLoading: isRegistering } = useMutation(
    registerRequest,
    {
      onSuccess: () => {
        toast.success("Registration Successful");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );

  return { register, isRegistering };
};

const loginRequest = async (userData) => {
  const response = await axios.post("/api/v1/auth/login", userData);
  return response.data;
};

export const useLogin = () => {
  const dispatch = useDispatch();

  const { mutateAsync: login, isLoading: isLoggingIn } = useMutation(
    loginRequest,
    {
      onMutate: () => {
        dispatch(setLoading(true));
        dispatch(clearError());
      },
      onSuccess: (data) => {
        if (data.success) {
          dispatch(setUserDetails(data.user));
          toast.success("Login Successful");
        } else {
          dispatch(setError(data.message));
          toast.error(data.message);
        }
      },
      onError: (error) => {
        const errorMessage =
          error.response?.data?.message || "An error occurred";
        dispatch(setError(errorMessage));
        toast.error(errorMessage);
      },
      onSettled: () => {
        dispatch(setLoading(false));
      },
    }
  );

  return { login, isLoggingIn };
};

const verifyCodeRequest = async (verificationData) => {
  const response = await axios.post(
    "/api/v1/auth/verify-code",
    verificationData
  );
  return response.data;
};

export const useVerifyCode = () => {
  const { mutateAsync: verifyCode, isLoading: isVerifying } = useMutation(
    verifyCodeRequest,
    {
      onSuccess: (data) => {
        if (data.success) {
          toast.success("Verification Successful");
        } else {
          toast.error(data.message);
        }
      },
      onError: (error) => {
        const errorMessage = error.response?.data || "An error occurred";
        toast.error(errorMessage);
      },
    }
  );

  return { verifyCode, isVerifying };
};

const registerLaundromatRequest = async (laundromatData) => {
  console.log(laundromatData);
  const response = await axios.post("/api/v1/auth/register-landromat", laundromatData);
  return response.data; // Assuming the response contains the newly created laundromat data
};

// Custom hook for laundromat registration
export const useLaundromatRegistration = () => {
  const { mutateAsync: registerLaundromat, isLoading: isRegistering } =
    useMutation(registerLaundromatRequest, {
      onSuccess: (data) => {
        console.log("Laundromat registered successfully:", data);
      },
      onError: (error) => {
        console.error("Error during laundromat registration:", error);
        // Handle error, you can also dispatch to show a toast or something else
      },
    });

  return { registerLaundromat, isRegistering };
};
