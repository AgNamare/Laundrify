import { useRef, useState, useEffect } from "react";
import { Autocomplete } from "@react-google-maps/api";
import { X } from "lucide-react"; // Importing close icon from Lucide React

const EditAddressModal = ({ onClose, setEditedDeliveryAddress }) => {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(true); // When modal is shown, start the animation
    return () => {
      setIsOpen(false); // When modal is closed, remove animation
    };
  }, []);

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();

    if (!place || !place.geometry) return;

    const address = place.formatted_address;
    const coordinates = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    };

    setEditedDeliveryAddress({ address, coordinates });
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-500 ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`bg-white rounded-2xl p-6 w-full max-w-md shadow-lg transition-transform duration-500 ${
          isOpen ? "scale-100" : "scale-95"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Edit Address</h2>
          <X
            className="w-6 h-6 cursor-pointer text-gray-600 hover:text-gray-900"
            onClick={onClose} // Close the modal when clicked
          />
        </div>

        <Autocomplete
          onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
          onPlaceChanged={handlePlaceChanged}
        >
          <input
            ref={inputRef}
            type="text"
            placeholder="Search for address"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-primary"
          />
        </Autocomplete>
      </div>
    </div>
  );
};

export default EditAddressModal;
