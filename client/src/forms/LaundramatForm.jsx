import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/images/logo.png";
import { ChevronDown } from "lucide-react";
import Loader from "@/components/Loader";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";

const formSchema = z.object({
  name: z.string().min(1, "Laundromat name is required."),
  address: z.string().min(1, "Address is required."),
  contactNumber: z
    .string()
    .min(10, "Contact number should be at least 10 characters."),
  website: z.string().optional(),
  description: z.string().optional(),
  operatingHours: z.record(z.string()).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

const LaundromatForm = ({ onSave, isLoading }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const [selectedPlace, setSelectedPlace] = useState("");
  const [markerPosition, setMarkerPosition] = useState(null);
  const [map, setMap] = useState(null);
  const autocompleteRef = useRef(null);
  const libraries = ["places"];
  const [isOperatingHoursVisible, setIsOperatingHoursVisible] = useState(false);

  const toggleOperatingHours = () => {
    setIsOperatingHoursVisible(!isOperatingHoursVisible);
  };

  const handlePlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry) {
        const formattedAddress = place.formatted_address;
        const location = place.geometry.location;

        setSelectedPlace(formattedAddress);
        setMarkerPosition({ lat: location.lat(), lng: location.lng() });
        setValue("address", formattedAddress);
        setValue("latitude", location.lat());
        setValue("longitude", location.lng());

        if (map) {
          map.panTo(location);
        }
      }
    }
  };

  return (
    <div className="bg-white sm:border border-textSecondary sm:rounded-xl w-full max-w-md mx-auto p-2 space-y-3">
      <div className="flex justify-end mt-6">
        <Link to="/">
          <img src={logo} alt="Logo" className="w-32" />
        </Link>
      </div>

      <h1 className="text-3xl font-semibold text-textPrimary">
        Add Laundromat
      </h1>
      <h3 className="text-textSecondary">
        Enter the details of your laundromat
      </h3>

      <LoadScript
        googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
        libraries={libraries}
      >
        <form onSubmit={handleSubmit(onSave)} className="space-y-3">
          <input
            {...register("name")}
            type="text"
            placeholder="Laundromat Name"
            className="w-full p-3 rounded-md border"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}

          <Autocomplete
            onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
            onPlaceChanged={handlePlaceChanged}
          >
            <input
              type="text"
              value={selectedPlace}
              onChange={(e) => setSelectedPlace(e.target.value)}
              placeholder="Enter address"
              className="w-full p-3 rounded-md border"
            />
          </Autocomplete>
          {errors.address && (
            <p className="text-red-500 text-sm">{errors.address.message}</p>
          )}

          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "400px" }}
            zoom={12}
            center={markerPosition || { lat: -1.286389, lng: 36.817223 }}
            onLoad={(mapInstance) => setMap(mapInstance)}
          >
            {markerPosition && <Marker position={markerPosition} />}
          </GoogleMap>

          <input
            {...register("contactNumber")}
            type="text"
            placeholder="Contact Number"
            className="w-full p-3 rounded-md border"
          />
          {errors.contactNumber && (
            <p className="text-red-500 text-sm">
              {errors.contactNumber.message}
            </p>
          )}

          <input
            {...register("website")}
            type="text"
            placeholder="Website (Optional)"
            className="w-full p-3 rounded-md border"
          />

          <textarea
            {...register("description")}
            placeholder="Description (Optional)"
            className="w-full p-3 rounded-md border"
          />

          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={toggleOperatingHours}
          >
            <h3>Operating Hours</h3>
            <ChevronDown
              className={`${isOperatingHoursVisible ? "rotate-180" : ""}`}
            />
          </div>

          {isOperatingHoursVisible &&
            [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ].map((day) => (
              <div key={day}>
                <input
                  {...register(`operatingHours.${day}`)}
                  type="text"
                  placeholder={`${day} Hours`}
                  className="w-full p-3 rounded-md border"
                />
              </div>
            ))}

          <button
            disabled={isLoading}
            type="submit"
            className="w-full bg-primary text-white font-semibold py-3 rounded-full mt-4"
          >
            {isLoading ? <Loader /> : "Submit"}
          </button>
        </form>
      </LoadScript>
    </div>
  );
};

export default LaundromatForm;
