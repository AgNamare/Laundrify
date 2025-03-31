import { useState } from 'react';
import { FaCreditCard } from 'react-icons/fa';
import { SiMpesa } from 'react-icons/si';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

const PaymentSuccess = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-center mb-2">Payment Success</h2>
          <p className="text-gray-600 text-center mb-6">
            Your payment was successful. Just wait your clean clothes arrive at home
          </p>
          <button
            onClick={() => onClose()}
            className="w-full bg-white border-2 border-blue-500 text-blue-500 py-3 rounded-lg mb-3"
          >
            Details order
          </button>
          <button
            onClick={() => onClose()}
            className="w-full bg-blue-500 text-white py-3 rounded-lg"
          >
            Back home
          </button>
        </div>
      </div>
    </div>
  );
};

const Checkout = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showCardForm, setShowCardForm] = useState(false);
  const [showMpesaForm, setShowMpesaForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: '',
  });
  const [mpesaNumber, setMpesaNumber] = useState('');

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
    setShowCardForm(method === 'card');
    setShowMpesaForm(method === 'mpesa');
  };

  const handleCardSubmit = (e) => {
    e.preventDefault();
    // Here you would typically handle card payment processing
    setShowSuccess(true);
  };

  const handleMpesaSubmit = (e) => {
    e.preventDefault();
    // Here you would typically handle Mpesa payment processing
    setShowSuccess(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <IoArrowBack className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold ml-4">Checkout</h1>
      </div>

      {/* Service Type Selection */}
      <div className="bg-white rounded-lg p-4 mb-4">
        <div className="space-y-3">
          <label className="flex items-center space-x-3">
            <input
              type="radio"
              name="service"
              value="self"
              className="form-radio text-blue-500"
            />
            <span>Self service</span>
          </label>
          <label className="flex items-center space-x-3">
            <input
              type="radio"
              name="service"
              value="delivery"
              className="form-radio text-blue-500"
              defaultChecked
            />
            <span>Delivery service</span>
          </label>
          <div className="pl-7">
            <p className="text-gray-500 text-sm">Springville, Gate C</p>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-lg p-4 mb-4">
        <h2 className="font-semibold mb-4">Payment method</h2>
        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
            <div className="flex items-center space-x-3">
              <FaCreditCard className="w-6 h-6 text-gray-600" />
              <span>Credit card</span>
            </div>
            <input
              type="radio"
              name="payment"
              value="card"
              checked={paymentMethod === 'card'}
              onChange={() => handlePaymentMethodSelect('card')}
              className="form-radio text-blue-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
            <div className="flex items-center space-x-3">
              <SiMpesa className="w-6 h-6 text-gray-600" />
              <span>M-Pesa</span>
            </div>
            <input
              type="radio"
              name="payment"
              value="mpesa"
              checked={paymentMethod === 'mpesa'}
              onChange={() => handlePaymentMethodSelect('mpesa')}
              className="form-radio text-blue-500"
            />
          </label>
        </div>

        {/* Card Form */}
        {showCardForm && (
          <form onSubmit={handleCardSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Card number</label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={cardDetails.number}
                onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Expiry date</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={cardDetails.expiry}
                  onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">CVC</label>
                <input
                  type="text"
                  placeholder="123"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={cardDetails.cvc}
                  onChange={(e) => setCardDetails({ ...cardDetails, cvc: e.target.value })}
                />
              </div>
            </div>
          </form>
        )}

        {/* Mpesa Form */}
        {showMpesaForm && (
          <form onSubmit={handleMpesaSubmit} className="mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">M-Pesa number</label>
              <input
                type="tel"
                placeholder="Enter your M-Pesa number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={mpesaNumber}
                onChange={(e) => setMpesaNumber(e.target.value)}
              />
            </div>
          </form>
        )}
      </div>

      {/* Pay Button */}
      <button
        onClick={() => paymentMethod && setShowSuccess(true)}
        className="w-full bg-blue-500 text-white py-4 rounded-lg font-semibold"
        disabled={!paymentMethod}
      >
        Pay ($52.0)
      </button>

      {/* Success Modal */}
      {showSuccess && <PaymentSuccess onClose={() => {
        setShowSuccess(false);
        navigate('/');
      }} />}
    </div>
  );
};

export default Checkout; 