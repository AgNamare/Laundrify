import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft, MoreVertical, MapPin, LucideSprayCan } from "lucide-react";
import Machine from "../assets/illustrations/machine.svg";


import { setOrderDetails } from "../redux/orderSlice";
import { useGetLaundromatDetails } from "../api/LaundromatApi";
import { usePlaceOrder } from "../api/OrderApi";

import ServiceTabs from "../components/ServiceTabs";
import ClothesItem from "../components/ClothesItem";
import OptionalServices from "../components/OptionalServices";
import { toast } from "sonner";

const LaundryOrderPage = () => {
  const { laundromatId } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user?.user?.user);
  const order = useSelector((state) => state.order.order);
  const dispatch = useDispatch();

  const { laundromat, isLoading } = useGetLaundromatDetails(laundromatId);
  const { placeOrder } = usePlaceOrder();

  const [selectedService, setSelectedService] = useState(null);
  const [items, setItems] = useState([]);
  const [additionalInstructions, setAdditionalInstructions] = useState("");
  const [selectedAddons, setSelectedAddons] = useState([]);

  useEffect(() => {
    if (laundromat?.services?.length > 0) {
      setSelectedService(laundromat.services[0].category);
    }
  }, [laundromat]);

  useEffect(() => {
    if (laundromat && selectedService) {
      const service = laundromat.services.find(
        (s) => s.category === selectedService
      );
      if (service) {
        setItems(
          service.prices.map((price) => ({
            id: price.clothesType._id,
            image: price.clothesType.imageUrl,
            name: price.clothesType.name,
            price: price.customPrice,
            basePrice: price.customPrice,
            quantity: 0,
            unit: service.unit,
          }))
        );
        setSelectedAddons([]); // Reset addons on tab change
      }
    }
  }, [laundromat, selectedService]);

  const updateQuantity = (id, increment) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(0, item.quantity + increment),
            }
          : item
      )
    );
  };

  const handleAddonToggle = (addon, isChecked) => {
    const updatedItems = items.map((item) => {
      const originalPrice = item.basePrice;
      const adjustment =
        (originalPrice * (addon.priceIncreasePercentage || 0)) / 100;
      return {
        ...item,
        price: isChecked ? originalPrice + adjustment : originalPrice,
      };
    });

    setItems(updatedItems);

    setSelectedAddons((prev) =>
      isChecked
        ? [...prev, addon.category]
        : prev.filter((cat) => cat !== addon.category)
    );
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    const orderedItems = items.filter((item) => item.quantity > 0);
    if (orderedItems.length === 0) {
      toast.info("Please select at least one item.");
      return;
    }

    const orderData = {
      user: user._id, // User's ID
      laundromat: laundromat._id, // Laundromat's ID
      serviceType: selectedService,
      services: orderedItems.map((item) => ({
        clothesType: item.id, // Clothes type ID
        quantity: item.quantity, // Quantity of clothes
        unit: item.unit, // Unit of measurement
        price: item.price, // Price for the item
      })),
      optionalServices: selectedAddons, // Optional services selected
      totalPrice, // Total price of the order
      additionalInstructions, // Any additional instructions provided
    };

    // Dispatch the order details to the Redux store
    dispatch(setOrderDetails(orderData));

    // Navigate to the checkout page
    navigate("/app/checkout");
  };

  const selectedServiceObj = laundromat?.services?.find(
    (s) => s.category === selectedService
  );

  return (
    <div className="relative min-h-screen flex flex-col items-center">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('/path-to-background-image.jpg')" }}
      ></div>

      <div className="relative z-10 w-full max-w-lg rounded-lg pb-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 mt-4">
          <Link to="/app" className="text-gray-600">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-xl font-semibold">
            {laundromat?.name || "Laundromat"} Laundry
          </h1>
          <MoreVertical size={24} className="text-gray-600" />
        </div>

        {/* Info */}
        <div className="mb-4">
          <div className="flex items-center gap-1 justify-between mb-2">
            <p className="text-gray-600 flex items-center gap-1 text-sm border border-gray-300 px-2 py-1 rounded-lg">
              <MapPin size={16} className="text-blue-500" />
              <span className="text-xs">{laundromat?.address}</span>
            </p>
            <p className="text-gray-600 border border-gray-300 text-xs px-2 py-1 rounded-lg">
              ⭐ {laundromat?.rating || "N/A"} (Reviews)
            </p>
          </div>
          <img
            className="h-40 w-full rounded-lg object-cover"
            src={
              laundromat?.image ||
              "https://cdn.thewirecutter.com/wp-content/media/2022/05/washing-machine-2048px-8670.jpg"
            }
            alt="Laundromat"
          />
        </div>

        {/* Service Tabs */}
        <ServiceTabs
          services={laundromat?.services || []}
          selectedService={selectedService}
          onSelect={setSelectedService}
        />

        {/* Clothes Items */}
        <div className="space-y-4 mb-6">
          {items.map((item) => (
            <ClothesItem
              key={item.id}
              item={item}
              onQuantityChange={updateQuantity}
            />
          ))}
        </div>

        {/* Optional Add-ons */}
        {selectedServiceObj?.optionalServices?.length > 0 && (
          <OptionalServices
            options={selectedServiceObj.optionalServices}
            onToggle={handleAddonToggle}
          />
        )}

        {/* Instructions */}
        <h3 className="font-medium mb-2">Additional Instructions</h3>
        <textarea
          value={additionalInstructions}
          onChange={(e) => setAdditionalInstructions(e.target.value)}
          placeholder="E.g., Handle with care, separate colors"
          className="w-full h-24 p-3 bg-white mb-4 rounded-lg"
        />

        {/* Summary */}
        <div className="bg-white rounded-lg p-4 mb-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-gray-100 p-1 w-10 h-10 rounded-full flex items-center justify-center">
              <img src={Machine} alt="Machine" className="w-8 h-8" />
            </div>
            <div className="text-sm">
              <span className="text-xs text-gray-500">Total items</span>
              <div className="font-bold">{totalItems} Items</div>
            </div>
          </div>
          <div className="text-sm text-right">
            <span className="text-xs text-gray-500">Total Cost</span>
            <div className="font-bold">Ksh {totalPrice.toFixed(2)}</div>
          </div>
        </div>

        {/* Checkout */}
        <button
          onClick={handleCheckout}
          className="w-full bg-primary text-white py-4 rounded-lg hover:opacity-75"
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default LaundryOrderPage;
