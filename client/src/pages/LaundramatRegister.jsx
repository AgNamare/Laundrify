import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLaundromatRegistration } from "../api/AuthApi";
import LaundromatForm from "../forms/LaundramatForm";
import { setUserDetails } from "../redux/userSlice";
import { toast } from "sonner";

const LaundromatRegister = () => {
  const { registerLaundromat, isRegistering } = useLaundromatRegistration();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector((state) => state.user?.user?.user);
  console.log(user);

  const handleLaundromatRegister = async (data) => {
    try {
      // Combine latitude and longitude into location object
      const { latitude, longitude, ...rest } = data;

      const payload = {
        ...rest,
        location: {
          type: "Point",
          coordinates: [longitude, latitude], // Mongo expects [lng, lat]
        },
        admin: user._id, // Add the current user's ID
      };

      // Convert operatingHours object to Map format (if required)
      if (payload.operatingHours) {
        payload.operatingHours = new Map(
          Object.entries(payload.operatingHours)
        );
      }

      console.log("Laundromat registration attempt with data:", payload);

      const response = await registerLaundromat(payload);
      const { newLaundromat, adminUser } = response;

      dispatch(setUserDetails(adminUser)); // Save user in state
      console.log("Laundromat registration response:", newLaundromat);
      localStorage.setItem("laundromat", JSON.stringify(newLaundromat));
      navigate("/laundromat/dashboard");

      toast.success("Laundromat created successfully!");

      alert("Laundromat created successfully!");
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Failed to create laundromat");
    }
  };

  return (
    <div className="flex sm:min-h-screen items-center justify-center">
      <LaundromatForm
        onSave={handleLaundromatRegister}
        isLoading={isRegistering}
      />
    </div>
  );
};

export default LaundromatRegister;
