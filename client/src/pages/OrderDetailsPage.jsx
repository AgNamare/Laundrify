import { ArrowLeft, MoreVertical } from 'lucide-react';
import { Link } from 'react-router-dom';
import OrderStatusTimeline from '../components/OrderStatusTimeline';

const OrderDetails = () => {
  // Mock order data - in real app, this would come from API/Redux
  const orderData = {
    orderId: '#2134587843',
    status: 'washing', // can be: washing, cleaning, drying, deliver
    laundryIn: 'March 30,2025/07:25 pm',
    deliveryAddress: 'Springfield, Gate C',
    estimatedTime: 'Finish in 2 days',
    isPending: true
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link to="/orders" className="text-gray-600">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-lg font-semibold">Details order</h1>
        <button className="text-gray-600">
          <MoreVertical size={24} />
        </button>
      </div>

      {/* Order Status Icon */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <img 
            src="/icons/washing-machine.svg" 
            alt="Washing" 
            className="w-12 h-12 text-blue-500"
          />
        </div>
        <p className="text-gray-600 text-center">
          Your clothes are still washed,<br />
          will be finished soon.
        </p>
      </div>

      {/* Status Timeline */}
      <OrderStatusTimeline status={orderData.status} />

      {/* Order Details */}
      <div className="bg-white rounded-lg p-4 mt-8 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-500">{orderData.orderId}</span>
          {orderData.isPending && (
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
              Pending
            </span>
          )}
        </div>
        
        <div className="space-y-3">
          <div>
            <p className="text-gray-500 text-sm">Laundry in</p>
            <p className="font-medium">{orderData.laundryIn}</p>
          </div>
          
          <div>
            <p className="text-gray-500 text-sm">Delivery address</p>
            <p className="font-medium">{orderData.deliveryAddress}</p>
          </div>
          
          <div>
            <p className="text-gray-500 text-sm">Estimated time</p>
            <p className="font-medium">{orderData.estimatedTime}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;