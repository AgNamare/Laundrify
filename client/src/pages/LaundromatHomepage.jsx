import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { MapPin } from "lucide-react";
import { Bell } from "lucide-react";

import {
  useGetLaundromatDetails,
  useSearchLaundromats,
  useGetLaundromats,
} from "../api/laundromatApi";

const LaundromatHomepage = () => {
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY; //import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  const navigate = useNavigate();
  const user = useSelector((state) => state.user?.user?.user);

  const laundromatId = user?.laundromat;
  console.log("Laundromat id: ", laundromatId)
  const { laundromat, isLoading, isError, error } =
    useGetLaundromatDetails(laundromatId);

  console.log(laundromat)

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const { searchLaundromats, isSearchingLaundromats } = useSearchLaundromats();
  const { laundromats: nearbyLaundromats, isLoading: isLoadingLaundromats } =
    useGetLaundromats();
  const [location, setLocation] = useState(null);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [userCoords, setUserCoords] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setUserCoords({ latitude, longitude });
          try {
            const response = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
            );
            const data = await response.json();
            if (data.results.length > 0) {
              let fullAddress = data.results[0].formatted_address;
              let addressParts = fullAddress.split(",");
              if (addressParts.length > 1) {
                addressParts.pop();
              }
              setLocation(addressParts.join(","));
            } else {
              setLocation("Location not found");
            }
          } catch (error) {
            console.error("Error fetching location:", error);
            setLocation("Error fetching location");
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocation("Location access denied");
        }
      );
    } else {
      setLocation("Geolocation not supported");
    }
  }, []);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(2);
  };

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim().length > 1) {
      try {
        const results = await searchLaundromats(query);
        setSearchResults(results);
        setShowSearchResults(true);
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
      setShowSearchResults(false); 
    }
  };

  if (isLoading)
    return (
      <div className="flex sm:min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  if (isError)
    return (
      <div className="flex sm:min-h-screen items-center justify-center">
        Error: {error?.message}
      </div>
    );
  if (!laundromat)
    return (
      <div className="flex sm:min-h-screen items-center justify-center">
        No laundromat found.
      </div>
    );

  return (
    <div className="flex flex-col h-screen w-full bg-white px-6 py-4">
    <div className="flex items-center justify-between mb-6">
      <div>
        <p className="text-sm text-gray-400">Current Location</p>
        <h2 className="text-lg font-semibold flex gap-1 items-center text-gray-900">
          <span><MapPin className="text-primary" size={16}/></span>{location || "Fetching location..."}
        </h2>
      </div>
      <Bell className="text-gray-600 p-2 rounded-lg border border-gray-300" size={36} />
    </div>

    <div className="relative mb-6">
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Find the nearest laundromat"
        className="w-full p-3 rounded-lg border border-gray-300 focus:border-primary shadow-sm"
      />
      {showSearchResults && (
        <div className="absolute w-full bg-white shadow-md rounded-lg mt-2 max-h-60 overflow-auto z-50">
          {searchResults.length > 0 ? (
            searchResults.map((item) => (
              <div
                key={item._id}
                className="p-3 border-b hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  navigate(`/laundromat/${item._id}`);
                  setShowSearchResults(false);
                }}
              >
                {item.name}
              </div>
            ))
          ) : (
            <div className="p-3 text-gray-500">No results found</div>
          )}
        </div>
      )}
    </div>

    <div className="bg-blue-200 p-5 rounded-lg mb-6">
      <h3 className="text-lg font-semibold text-blue-900">
        Your clothes will finish in 1 Day
      </h3>
      <button className="text-primary mt-2 underline font-medium">View Details</button>
    </div>

    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-900">Nearest laundry</h3>
      <Link to="#" className="text-primary underline text-sm font-medium">
        See More
      </Link>
    </div>

    <div className="space-y-5 flex-grow overflow-auto">
      {isLoadingLaundromats ? (
        <p className="text-gray-500">Loading nearby laundromats...</p>
      ) : (
        nearbyLaundromats.map((item) => {
          const distance = userCoords
            ? calculateDistance(
                userCoords.latitude,
                userCoords.longitude,
                item.location.coordinates[1],
                item.location.coordinates[0]
              ) + " km"
            : "Unknown distance";
          return (
            <div
              key={item._id}
              className="bg-white rounded-lg shadow-md flex p-4 items-center border border-gray-200"
            >
              <img
                src={item.imageUrl || "https://cdn.thewirecutter.com/wp-content/media/2022/05/washing-machine-2048px-8670.jpg?auto=webp&quality=75&crop=3:2&width=1024"}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-lg border border-gray-300"
              />
              <div className="ml-5">
                <h4 className="font-semibold text-gray-900">{item.name}</h4>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <MapPin size={16} className="text-primary" />
                  <span>{distance}</span>
                </div>
                <div className="text-sm text-gray-600">
                  {item.price || "Unknown price"}
                </div>
                <div className="text-sm text-gray-600">
                  Rating: {item.rating || "N/A"}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  </div>


);
};

export default LaundromatHomepage;
