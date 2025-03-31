import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUserDetails } from "../redux/userSlice";
import { useGetLaundromatDetails } from "../api/laundromatApi";

const LaundromatHomepage = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user?.user?.user);
  const dispatch = useDispatch();

  // Access the laundromat ID from the user state (if applicable)
  const laundromatId = user?.laundromat;
  console.log("Laundromat ID:", laundromatId);

  // Example of fetching a single laundromat; adjust as needed if you have multiple
  const { laundromat, isLoading, isError, error } =
    useGetLaundromatDetails(laundromatId);

  // Handle loading and error states
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
        <div>Error: {error?.message}</div>
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

  // Example: If you have multiple nearby laundromats, you could store them in an array
  // For now, let's just mock a small list to demonstrate the layout
  const nearestLaundries = [
    {
      id: 1,
      name: "Roumah Laundry",
      distance: "250 m",
      price: "$0.5/pcs",
      rating: 5.0,
      imageUrl: "https://via.placeholder.com/80" // placeholder image
    },
    {
      id: 2,
      name: "Happy Laundry",
      distance: "300 m",
      price: "$0.5/pcs",
      rating: 5.0,
      imageUrl: "https://via.placeholder.com/80"
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-4">
      {/* Current Location */}
      <div className="mb-4">
        <p className="text-sm text-gray-500">Current Location</p>
        <h2 className="text-xl font-semibold">Semarang, East Java</h2>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Find the nearest laundromat"
          className="w-full p-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Banner / Notification */}
      <div className="bg-blue-50 p-4 rounded-lg mb-4">
        <h3 className="text-lg font-semibold text-blue-900">
          Your clothes will finish in 1 Day
        </h3>
        <button className="text-blue-600 mt-2 underline">
          View Details
        </button>
      </div>

      {/* Nearest laundry header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">Nearest laundry</h3>
        <Link to="#" className="text-blue-600 underline text-sm">
          See More
        </Link>
      </div>

      {/* Nearest laundry list */}
      <div className="space-y-4">
        {nearestLaundries.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow flex p-4 items-center"
          >
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-16 h-16 object-cover rounded"
            />
            <div className="ml-4">
              <h4 className="font-semibold text-gray-800">{item.name}</h4>
              <div className="text-sm text-gray-500">{item.distance}</div>
              <div className="text-sm text-gray-500">{item.price}</div>
              <div className="text-sm text-gray-500">Rating: {item.rating}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 
        You could place additional UI here, such as a bottom navigation, chat button, 
        or any other features from your original design.
      */}
    </div>
  );
};

export default LaundromatHomepage;
