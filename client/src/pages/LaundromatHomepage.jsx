import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUserDetails } from "../redux/userSlice"; // Assuming you have this
import { useGetLaundromatDetails } from "../api/laundromatApi"; // Assuming you have this API call

const LaundromatHomepage = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user?.user?.user);
  const dispatch = useDispatch();

  // Access the laundromat ID from the user state
  const laundromatId = user?.laundromat;
  console.log("Laundromat ID:", user);

  const { laundromat, isLoading, isError, error } =
    useGetLaundromatDetails(laundromatId);

  if (isLoading) {
    return (
      <div className="flex sm:min-h-screen items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex sm:min-h-screen items-center justify-center">
        <div>Error: {error.message}</div>
      </div>
    );
  }

  if (!laundromat) {
    return (
      <div className="flex sm:min-h-screen items-center justify-center">
        <div>No laundromat found.</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <h1 className="text-2xl font-bold">
          {laundromat?.name || "Laundromat"}
        </h1>
      </div>
    </div>
  );
};

export default LaundromatHomepage;
