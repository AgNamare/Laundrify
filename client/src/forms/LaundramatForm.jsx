import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/images/logo.png";
import { ChevronDown } from "lucide-react";
import Loader from "@/components/Loader";
import { GoogleMap, Marker, Autocomplete } from "@react-google-maps/api";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from "../config/firebase";

const formSchema = z.object({
  name: z.string().min(1, "Laundromat name is required."),
  address: z.string().min(1, "Address is required."),
  contactNumber: z.string().min(10, "Contact number should be at least 10 characters."),
  website: z.string().optional(),
  description: z.string().optional(),
  operatingHours: z.record(z.string()).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  image: z.string().optional(),
});

const LaundromatForm = ({ onSave, isLoading }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const [selectedPlace, setSelectedPlace] = useState("");
  const [markerPosition, setMarkerPosition] = useState(null);
  const [map, setMap] = useState(null);
  const autocompleteRef = useRef(null);
  const [isOperatingHoursVisible, setIsOperatingHoursVisible] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const toggleOperatingHours = () => {
    setIsOperatingHoursVisible((prev) => !prev);
  };

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    if (place.geometry) {
      const formattedAddress = place.formatted_address;
      const location = place.geometry.location;

      const lat = location.lat();
      const lng = location.lng();

      setSelectedPlace(formattedAddress);
      setMarkerPosition({ lat, lng });

      setValue("address", formattedAddress);
      setValue("latitude", lat);
      setValue("longitude", lng);

      if (map) map.panTo(location);
    }
  };

  const handleUpload = () => {
    if (!file) return;
    setUploading(true);

    const storage = getStorage(app);
    const filename = `${Date.now()}-${file.name}`;
    const storageRef = ref(storage, `laundromats/${filename}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      null,
      (error) => {
        console.error(error);
        setUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setValue("image", downloadURL);
          setUploading(false);
        });
      }
    );
  };

  return (
    <div className="bg-white sm:border border-textSecondary sm:rounded-xl w-full max-w-md mx-auto p-2 space-y-3">
      <div className="flex justify-end mt-6">
        <Link to="/">
          <img src={logo} alt="Logo" className="w-32" />
        </Link>
      </div>

      <h1 className="text-3xl font-semibold text-textPrimary">Add Laundromat</h1>
      <h3 className="text-textSecondary">Enter the details of your laundromat</h3>

      <form onSubmit={handleSubmit(onSave)} className="space-y-3">
        {/* Name */}
        <input
          {...register("name")}
          type="text"
          placeholder="Laundromat Name"
          className="w-full p-3 rounded-md border"
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

        {/* Address with Autocomplete */}
        <Autocomplete onLoad={(ref) => (autocompleteRef.current = ref)} onPlaceChanged={handlePlaceChanged}>
          <input
            type="text"
            value={selectedPlace}
            onChange={(e) => setSelectedPlace(e.target.value)}
            placeholder="Enter address"
            className="w-full p-3 rounded-md border"
          />
        </Autocomplete>
        {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}

        {/* Google Map */}
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "400px" }}
          zoom={12}
          center={markerPosition || { lat: -1.286389, lng: 36.817223 }}
          onLoad={(mapInstance) => setMap(mapInstance)}
        >
          {markerPosition && <Marker position={markerPosition} />}
        </GoogleMap>

        {/* Contact Number */}
        <input
          {...register("contactNumber")}
          type="text"
          placeholder="Contact Number"
          className="w-full p-3 rounded-md border"
        />
        {errors.contactNumber && <p className="text-red-500 text-sm">{errors.contactNumber.message}</p>}

        {/* Website */}
        <input
          {...register("website")}
          type="text"
          placeholder="Website (Optional)"
          className="w-full p-3 rounded-md border"
        />

        {/* Description */}
        <textarea
          {...register("description")}
          placeholder="Description (Optional)"
          className="w-full p-3 rounded-md border"
        />

        {/* Image Upload */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full p-2 border rounded-md"
          />
          {file && !uploading && (
            <button
              type="button"
              onClick={handleUpload}
              className="mt-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            >
              Upload Image
            </button>
          )}
          {uploading && <Loader />}
        </div>

        {/* Image Preview */}
        {watch("image") && (
          <div className="mt-3">
            <img src={watch("image")} alt="Uploaded" className="w-full h-48 object-cover rounded-md" />
          </div>
        )}

        {/* Operating Hours */}
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={toggleOperatingHours}
        >
          <h3>Operating Hours</h3>
          <ChevronDown className={`${isOperatingHoursVisible ? "rotate-180" : ""}`} />
        </div>

        {isOperatingHoursVisible &&
          ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
            <div key={day}>
              <input
                {...register(`operatingHours.${day}`)}
                type="text"
                placeholder={`${day} Hours`}
                className="w-full p-3 rounded-md border"
              />
            </div>
          ))}

        {/* Submit */}
        <button
          disabled={isLoading}
          type="submit"
          className="w-full bg-primary text-white font-semibold py-3 rounded-full mt-4"
        >
          {isLoading ? <Loader /> : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default LaundromatForm;
