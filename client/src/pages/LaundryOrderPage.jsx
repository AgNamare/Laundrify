import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft, MoreVertical, Minus, Plus, MapPin } from "lucide-react";
import { setOrderDetails } from "../redux/orderSlice";
import { useGetLaundromatDetails } from "../api/laundromatApi";
import { usePlaceOrder } from "../api/OrderApi"; // Custom hook defined in orderApi.js

const LaundryOrderPage = () => {
  const { laundromatId } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user?.user?.user);

  const dispatch = useDispatch();

  const { laundromat, isLoading } = useGetLaundromatDetails(laundromatId);
  const { placeOrder, isPlacingOrder } = usePlaceOrder();

  const [selectedService, setSelectedService] = useState(null);
  const [items, setItems] = useState([]);
  const [additionalInstructions, setAdditionalInstructions] = useState("");

  // Set the default selected service to the first service's category
  useEffect(() => {
    if (laundromat && laundromat.services.length > 0) {
      setSelectedService(laundromat.services[0].category);
    }
  }, [laundromat]);

  // When the selected service changes, update the order items accordingly
  useEffect(() => {
    if (laundromat && selectedService) {
      const service = laundromat.services.find(
        (service) => service.category === selectedService
      );
      if (service) {
        setItems(
          service.prices.map((price) => ({
            id: price.clothesType._id,
            image: price.clothesType.imageUrl,
            name: price.clothesType.name,
            price: price.customPrice,
            quantity: 0,
            unit: service.unit,
          }))
        );
      }
    }
  }, [laundromat, selectedService]);

  const updateQuantity = (id, increment) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const newQuantity = item.quantity + increment;
          return {
            ...item,
            quantity: newQuantity >= 0 ? newQuantity : 0,
          };
        }
        return item;
      })
    );
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Checkout handler: Build order data and make a POST request with the order information
  const handleCheckout = () => {
    const orderedItems = items.filter((item) => item.quantity > 0);
    if (orderedItems.length === 0) {
      alert("Please select at least one item.");
      return;
    }
    const orderData = {
      user: user._id,
      laundromat: laundromat._id,
      services: orderedItems.map((item) => ({
        category: selectedService,
        clothesType: item.id,
        quantity: item.quantity,
        unit: item.unit,
        price: item.price,
      })),
      totalPrice,
      additionalInstructions,
    };

    dispatch(setOrderDetails(orderData));
    console.log("Order stored in Redux:", orderData);
    navigate("/checkout"); // Navigate to checkout for further processing
  };


  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link to="/" className="text-gray-600">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-xl font-semibold">
          {isLoading ? "Loading..." : laundromat?.name || "Laundromat"} Laundry
        </h1>
        <button className="text-gray-600">
          <MoreVertical size={24} />
        </button>
      </div>

      {/* Laundry Info */}
      <div className="mb-6">
        <div className="flex items-center justify-between px-1 mb-4">
          <p className="text-gray-600 flex items-center gap-1 text-sm border border-textSecondary px-2 py-1 rounded rounde-3xl">
            <span>
              <MapPin size={16} className="text-primary" />
            </span>
            {laundromat?.address}
          </p>
          <p className="text-gray-600 border border-textSecondary text-sm px-2 py-1 rounded rounde-3xl">
            ⭐ {laundromat?.rating || "N/A"} (Reviews)
          </p>
        </div>
        <img
          className="h-40 w-full rounded-lg"
          src={
            laundromat?.imageUrl ||
            "https://cdn.thewirecutter.com/wp-content/media/2022/05/washing-machine-2048px-8670.jpg?auto=webp&quality=75&crop=3:2&width=1024"
          }
          alt=""
        />
      </div>

      {/* Service Selection Tabs */}
      <div className="flex justify-between overflow-x-auto border-b mb-6">
        {laundromat?.services.map((service) => (
          <button
            key={service.category}
            onClick={() => setSelectedService(service.category)}
            className={`p-2 border-b-2 ${
              selectedService === service.category
                ? "border-blue-500 font-semibold"
                : "border-transparent text-gray-600"
            }`}
          >
            {service.category}
          </button>
        ))}
      </div>

      {/* Order List */}
      <div className="bg-white rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold">Order list</h2>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <div className="flex gap-2">
                <img
                  src={item.image || "https://via.placeholder.com/50"}
                  alt={item.name}
                  className="w-10 h-10 object-cover rounded-full shadow-sm"
                />
                <div className="flex flex-col space-y-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    Ksh {item.price} {item.unit}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => updateQuantity(item.id, -1)}
                  className="w-8 h-8 flex items-center justify-center text-gray-500 border border-gray-300 rounded-full"
                >
                  <Minus size={16} />
                </button>
                <span className="w-4 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, 1)}
                  className="w-8 h-8 flex items-center justify-center text-gray-500 border border-gray-300 rounded-full"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Instructions */}
      <div className="bg-white rounded-lg p-4 mb-6">
        <h2 className="text-medium font-semibold mb-4">
          Additional Instructions
        </h2>
        <textarea
          value={additionalInstructions}
          onChange={(e) => setAdditionalInstructions(e.target.value)}
          placeholder="E.g., Handle with care, separate colors"
          className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>Total items</span>
          <span>{totalItems} Items</span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="font-semibold">Total Cost</span>
          <span className="font-semibold">Ksh {totalPrice.toFixed(2)}</span>
        </div>
      </div>

      {/* Checkout Button */}
      <button
        onClick={handleCheckout}
        className="w-full bg-blue-500 text-white py-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
      >
        {isPlacingOrder ? "Placing Order..." : "Checkout"}
      </button>
    </div>
  );
};

export default LaundryOrderPage;
