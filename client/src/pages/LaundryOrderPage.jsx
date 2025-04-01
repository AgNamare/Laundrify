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
     <div className="relative min-h-screen bg-gray-50 flex flex-col items-center p-4">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('/path-to-background-image.jpg')" }}
      ></div>
      
      <div className="relative z-10 w-full max-w-lg bg-white shadow-lg rounded-lg p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="text-gray-600">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-xl font-semibold">
            {laundromat?.name || "Laundromat"} Laundry
          </h1>
          <button className="text-gray-600">
            <MoreVertical size={24} />
          </button>
        </div>

        {/* Laundry Info */}
        <div className="mb-6">
          <div className="flex items-center gap-1 justify-between px-1 mb-4">
            <p className="text-gray-600 flex items-center gap-1 text-sm border border-gray-300 px-2 py-1 rounded-lg">
              <MapPin size={16} className="text-blue-500" /> <span className="text-xs">{laundromat?.address}</span>
            </p>
            <p className="text-gray-600 border border-gray-300 text-xs px-2 py-1 rounded-lg">
              ⭐ {laundromat?.rating || "N/A"} (Reviews)
            </p>
          </div>
          <img
            className="h-40 w-full rounded-lg object-cover"
            src={
              laundromat?.imageUrl ||
              "https://cdn.thewirecutter.com/wp-content/media/2022/05/washing-machine-2048px-8670.jpg?auto=webp&quality=75&crop=3:2&width=1024"
            }
            alt="Laundromat"
          />
        </div>

        {/* Order List */}
        <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
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
                  <div className="flex flex-col">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">Ksh {item.price}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 border rounded-full flex justify-center items-center">
                    <Minus size={16} />
                  </button>
                  <span className="w-4 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 border rounded-full flex justify-center items-center">
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Instructions */}
        <textarea
          value={additionalInstructions}
          onChange={(e) => setAdditionalInstructions(e.target.value)}
          placeholder="E.g., Handle with care, separate colors"
          className="w-full h-24 p-3 border border-gray-300 rounded-lg"
        />

        {/* Order Summary */}
        <div className="bg-white rounded-lg p-4 mb-6">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Total items</span>
            <span>{totalItems} Items</span>
          </div>
          <div className="flex justify-between mt-2">
            <span className="font-semibold">Total Cost</span>
            <span className="font-semibold">Ksh {totalPrice.toFixed(2)}</span>
          </div>
        </div>

        {/* Checkout Button */}
        <button onClick={handleCheckout} className="w-full bg-blue-500 text-white py-4 rounded-lg hover:bg-blue-600">
          Checkout
        </button>
      </div>
    </div>
  );
};

export default LaundryOrderPage;
