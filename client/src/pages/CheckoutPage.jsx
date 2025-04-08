import { useDispatch, useSelector } from "react-redux";
import { setOrderDetails } from "../redux/orderSlice";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Mastecard from "../assets/images/Mastercard.png";
import Mpesa from "../assets/images/Mpesa.png";
import PaymentSuccess from "../components/PaymentSuccess";
import { usePlaceOrder } from "@/api/OrderApi"; 
import EditAddressModal from "../components/EditAddressModal";

// Back Button
const BackButton = ({ onClick }) => (
  <button onClick={onClick} className="p-2 rounded-full hover:bg-gray-100">
    <ArrowLeft className="w-6 h-6" />
  </button>
);

// Reusable Payment Option
const PaymentMethodOption = ({
  imageSrc,
  label,
  value,
  selected,
  onSelect,
}) => (
  <label className="flex items-center justify-between px-3 py-5 border-b-1 border-b-slate-300 cursor-pointer">
    <div className="flex items-center space-x-3">
      <img src={imageSrc} alt={label} className="w-6 h-6 text-gray-600" />
      <span>{label}</span>
    </div>
    <input
      type="radio"
      name="payment"
      value={value}
      checked={selected === value}
      onChange={() => onSelect(value)}
      className="form-radio text-primary"
    />
  </label>
);

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const address = useSelector((state) => state.location);
  const totalPrice = useSelector((state) => state.order?.order?.totalPrice);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [showCardForm, setShowCardForm] = useState(false);
  const [showMpesaForm, setShowMpesaForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvc: "",
  });
  const [mpesaNumber, setMpesaNumber] = useState("");
  const [showEditAddressModal, setShowEditAddressModal] = useState(false);
  const [editedDeliveryAddress, setEditedDeliveryAddress] = useState(null);
  const { placeOrder, isPlacingOrder } = usePlaceOrder();


  const orderData = useSelector((state) => state.order.order);

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
    setShowCardForm(method === "card");
    setShowMpesaForm(method === "mpesa");
  };

  const handleCardSubmit = () => {
    const orderDetails = {
      paymentMethod: "Credit Card",
      totalPrice: totalPrice,
      delivery: {
        pickupLocation: {
          coordinates: address.coords,
        },
        deliveryLocation: {
          coordinates: editedDeliveryAddress?.coordinates || address.coords,
        },
        deliveryStatus: "Pending",
      },
      cardDetails,
    };

    console.log("Order Details (Card):", orderDetails);
    dispatch(setOrderDetails(orderDetails));
    setShowSuccess(true);
  };

  const handleMpesaSubmit = async () => {
    const orderDetails = {
      ...orderData,
      paymentMethod: "M-Pesa",
      totalPrice: totalPrice,
      delivery: {
        pickupLocation: {
          coordinates: address.coords,
        },
        deliveryLocation: {
          coordinates: editedDeliveryAddress?.coordinates || address.coords,
        },
        deliveryStatus: "Pending",
      },
      mpesaNumber,
    };

    try {
      await placeOrder(orderDetails);
      setShowSuccess(true);
    } catch (error) {
      console.error("M-Pesa order failed:", error);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center mb-6">
        <BackButton onClick={() => navigate(-1)} />
        <h1 className="text-xl font-semibold ml-4">Checkout</h1>
      </div>

      {/* Service Type */}
      <div className="bg-white rounded-lg p-4 mb-4">
        <div className="space-y-2">
          <label className="flex items-center space-x-3 border-b-2 border-slate-200 pb-3">
            <input type="radio" name="service" value="self" className="form-radio text-primary" />
            <span>Self service</span>
          </label>
          <label className="flex items-center space-x-3">
            <input
              type="radio"
              name="service"
              value="delivery"
              className="form-radio text-primary"
              defaultChecked
            />
            <span>Delivery service</span>
          </label>
          <div className="pl-7">
            <p className="text-gray-500 text-sm">
              {editedDeliveryAddress?.address || address.address || "Address not set"}
            </p>
          </div>
          <div className="text-right">
            <span
              onClick={() => setShowEditAddressModal(true)}
              className="text-primary cursor-pointer underline font-medium text-sm"
            >
              Edit Address
            </span>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <h2 className="font-semibold mb-4">Payment method</h2>
      <div className="bg-white rounded-lg p-4 mb-4">
        <div className="space-y-3">
          <PaymentMethodOption
            imageSrc={Mastecard}
            label="Credit card"
            value="card"
            selected={paymentMethod}
            onSelect={handlePaymentMethodSelect}
          />
          <PaymentMethodOption
            imageSrc={Mpesa}
            label="M-Pesa"
            value="mpesa"
            selected={paymentMethod}
            onSelect={handlePaymentMethodSelect}
          />
        </div>

        {/* Card Form */}
        {showCardForm && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCardSubmit();
            }}
            className="mt-4 space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700">Card Number</label>
              <input
                type="text"
                placeholder="Enter your card number"
                className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:outline-primary"
                value={cardDetails.number}
                onChange={(e) =>
                  setCardDetails({ ...cardDetails, number: e.target.value })
                }
              />
            </div>
            <div className="flex space-x-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:outline-primary"
                  value={cardDetails.expiry}
                  onChange={(e) =>
                    setCardDetails({ ...cardDetails, expiry: e.target.value })
                  }
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700">CVC</label>
                <input
                  type="text"
                  placeholder="CVC"
                  className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:outline-primary"
                  value={cardDetails.cvc}
                  onChange={(e) =>
                    setCardDetails({ ...cardDetails, cvc: e.target.value })
                  }
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold"
            >
              Pay with Card (ksh{totalPrice})
            </button>
          </form>
        )}

        {/* Mpesa Form */}
        {showMpesaForm && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleMpesaSubmit();
            }}
            className="mt-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700">M-Pesa number</label>
              <input
                type="tel"
                placeholder="Enter your M-Pesa number"
                className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:outline-primary"
                value={mpesaNumber}
                onChange={(e) => setMpesaNumber(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold mt-4"
            >
              Checkout Ksh {totalPrice}
            </button>
          </form>
        )}
      </div>

      {/* Edit Address Modal */}
      {showEditAddressModal && (
        <EditAddressModal
          onClose={() => setShowEditAddressModal(false)}
          setEditedDeliveryAddress={(newAddress) => {
            setEditedDeliveryAddress(newAddress);
          }}
        />
      )}

      {/* Success Modal */}
      {showSuccess && (
        <PaymentSuccess
          onClose={() => {
            setShowSuccess(false);
            navigate("/");
          }}
        />
      )}
    </div>
  );
};

export default CheckoutPage;
