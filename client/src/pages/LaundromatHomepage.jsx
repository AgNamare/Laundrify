import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { MapPin, Search, Star } from "lucide-react";
import { Bell } from "lucide-react";
import {
  useGetLaundromatDetails,
  useSearchLaundromats,
  useGetLaundromats,
} from "../api/LaundromatApi";
import { useDispatch } from "react-redux";
import washingMachine from "../assets/illustrations/washing_machine.png";
import { setUserLocation } from "../redux/locationSlice";

const LaundromatHomepage = () => {
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user?.user?.user);
  const reduxLocation = useSelector((state) => state.location);
  console.log(reduxLocation);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const { searchLaundromats, isSearchingLaundromats } = useSearchLaundromats();
  const { laundromats: nearbyLaundromats, isLoading: isLoadingLaundromats } =
    useGetLaundromats();
  const [location, setLocation] = useState(null);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [userCoords, setUserCoords] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true); // Step 1: isLoading state for geolocation

  useEffect(() => {
    if (navigator.geolocation) {
      setIsLoadingLocation(true); // Step 2: Set loading to true before fetching geolocation

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
              const formattedAddress = addressParts.join(",");
              setLocation(formattedAddress);

              // Dispatch the address to the Redux store
              dispatch(
                setUserLocation({
                  coords: [latitude, longitude],
                  address: formattedAddress,
                })
              );
            } else {
              setLocation("Location not found");
            }
          } catch (error) {
            console.error("Error fetching location:", error);
            setLocation("Error fetching location");
          }
          setIsLoadingLocation(false); // Step 3: Set loading to false once geolocation is fetched
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocation("Location access denied");
          setIsLoadingLocation(false); // Step 3: Set loading to false if there is an error
        }
      );
    } else {
      setLocation("Geolocation not supported");
      setIsLoadingLocation(false); // Step 3: Set loading to false if geolocation is not supported
    }
  }, []); // Empty dependency array to ensure this runs once on component mount

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

  return (
    <div className="flex flex-col h-screen w-full bg-transparent">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-gray-400">Current Location</p>
          <h2 className="text-lg font-semibold flex gap-1 items-center text-gray-900">
            <span>
              <MapPin className="text-primary" size={16} />
            </span>
            {isLoadingLocation
              ? "Fetching location..."
              : location || "Location not available"}
          </h2>
        </div>
        <Bell
          className="text-gray-600 p-2 rounded-lg border border-gray-300"
          size={36}
        />
      </div>

      <div className="relative mb-6 bg-white shadow-sm rounded-lg px-2 py-3">
        <div className="relative w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Find the nearest laundromat"
            className="w-full pl-10 focus:outline-none"
          />
          {/* Search Icon */}
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            <Search size={20} />
          </div>
        </div>

        {showSearchResults && (
          <div className="absolute w-full bg-white shadow-md rounded-lg mt-2 max-h-60 overflow-auto z-50">
            {searchResults.length > 0 ? (
              searchResults.map((item) => (
                <div
                  key={item._id}
                  className="p-3 border-b hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    navigate(`/app/laundry/${item._id}`);
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

      <div className="bg-primary p-5 shadow-xl rounded-lg mb-6 gap-10 flex items-center justify-between">
        <div>
          <h2 className="text-white text-xs opacity-85 ">Romah Laundry</h2>
          <h3 className="text-xl font-semibold text-white">
            Your clothes will finish in 1 Day
          </h3>
          <button className="text-white mt-2 underline font-medium">
            View Details
          </button>
        </div>
        <img
          src={washingMachine}
          alt="Laundry"
          className="w-fit h-28 object-cover "
        />
      </div>

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Nearest laundry</h3>
        <Link
          to="#"
          className="text-primary text-medium font-large font-semibold"
        >
          See More
        </Link>
      </div>

      <div className="space-y-5 overflow-auto">
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
              <Link
                to={`/app/laundry/${item._id}`}
                key={item._id}
              >
                <div className=" rounded-lg bg-white w-fit p-2 ">
                  <div
                    className="w-60 h-30 bg-cover bg-center rounded-lg border border-gray-300 relative"
                    style={{
                      backgroundImage: `url(${
                        item.imageUrl ||
                        "https://cdn.thewirecutter.com/wp-content/media/2022/05/washing-machine-2048px-8670.jpg?auto=webp&quality=75&crop=3:2&width=1024"
                      })`,
                    }}
                  >
                    {/* Rating positioned at top-left corner */}
                    <div className="absolute top-1 left-1 px-2 py-1 bg-white  text-textPrimary rounded-md opacity-80">
                      <span className="flex items-center gap-1 text-xs">
                        <Star
                          size={12}
                          className="text-yellow-500 fill-yellow-500"
                        />
                        {item.rating || "N/A"}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col justify-between ml-2">
                    <h4 className="text-lg mt-2 text-textPrimary font-semibold ">
                      {item.name}
                    </h4>
                    <div className="flex flex-between items-center justify-between mt-1">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPin size={16} className="text-primary" />
                        <span>{distance}</span>
                      </div>
                      <div className="text-sm text-gray-600 bg-white p-1 rounded-md">
                        {item.price || "Unknown price"}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
};

export default LaundromatHomepage;
