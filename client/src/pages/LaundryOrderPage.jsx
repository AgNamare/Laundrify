import { useState } from 'react';
import { ArrowLeft, MoreVertical, Minus, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const LaundryOrderPage = () => {
  const [items, setItems] = useState([
    { id: 1, name: 'T-Shirt', price: 2.5, quantity: 0 },
    { id: 2, name: 'Jeans', price: 5.5, quantity: 0 },
    { id: 3, name: 'Short', price: 3.5, quantity: 0 },
    { id: 4, name: 'Long dress', price: 6.5, quantity: 0 }
  ]);

  const [selectedSoftener, setSelectedSoftener] = useState('');
  const [additionalInstructions, setAdditionalInstructions] = useState('');

  const softeners = [
    { id: 'downy', name: 'Downy' },
    { id: 'stasoft', name: 'Sta Soft' },
    { id: 'cuddles', name: 'Cuddles' },
    { id: 'none', name: 'None' }
  ];

  const updateQuantity = (id, increment) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + increment;
        return {
          ...item,
          quantity: newQuantity >= 0 ? newQuantity : 0
        };
      }
      return item;
    }));
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link to="/" className="text-gray-600">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-xl font-semibold">Roumah Laundry</h1>
        <button className="text-gray-600">
          <MoreVertical size={24} />
        </button>
      </div>

      {/* Laundry Info */}
      <div className="mb-6">
        <div className="bg-white rounded-lg overflow-hidden">
          <img 
            src="/images/laundry-machines.jpg" 
            alt="Laundry Machines" 
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <div className="flex items-center text-sm text-gray-600 space-x-4">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                4 Jemput no 03 Santri
              </span>
              <span>⭐ 5.0 (254 Reviews)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Order List */}
      <div className="bg-white rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Order list</h2>
          <button className="text-blue-500 text-sm">Add Category</button>
        </div>

        <div className="space-y-4">
          {items.map(item => (
            <div key={item.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img 
                  src={`/icons/${item.name.toLowerCase().replace(' ', '-')}.svg`} 
                  alt={item.name}
                  className="w-8 h-8"
                />
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">${item.price}</p>
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

      {/* Softener Selection */}
      <div className="bg-white rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">Laundry Softener</h2>
        <div className="space-y-3">
          {softeners.map(softener => (
            <label key={softener.id} className="flex items-center space-x-3">
              <input
                type="radio"
                name="softener"
                value={softener.id}
                checked={selectedSoftener === softener.id}
                onChange={(e) => setSelectedSoftener(e.target.value)}
                className="w-4 h-4 text-blue-500 border-gray-300 focus:ring-blue-500"
              />
              <span>{softener.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Additional Instructions */}
      <div className="bg-white rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">Additional Instructions</h2>
        <textarea
          value={additionalInstructions}
          onChange={(e) => setAdditionalInstructions(e.target.value)}
          placeholder="E.g., Sensitive black trouser"
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
          <span className="font-semibold">Cost</span>
          <span className="font-semibold">${totalPrice.toFixed(2)}</span>
        </div>
      </div>

      {/* Checkout Button */}
      <button 
        onClick={() => {/* Handle checkout */}}
        className="w-full bg-blue-500 text-white py-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
      >
        Checkout
      </button>
    </div>
  );
};

export default LaundryOrderPage; 