import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import OrderStatusTimeline from "../components/OrderStatusTimeline";

const OrderDetails = () => {
  // Mock order data array
  const orders = [
    {
      shop: "Happy Laundry",
      orderId: "#2134587843",
      status: "washing",
      laundryIn: "March 30, 2025 / 07:25 pm",
      deliveryAddress: "Springfield, Gate C",
      estimatedTime: "Finish in 2 days",
      isPending: false,
    },
    {
      shop: "Fresh Cleaners",
      orderId: "#2134587855",
      status: "drying",
      laundryIn: "March 28, 2025 / 02:10 pm",
      deliveryAddress: "Westside, Block B",
      estimatedTime: "Finish in 1 day",
      isPending: true,
    },
    {
      shop: "QuickWash Hub",
      orderId: "#2134587899",
      status: "deliver",
      laundryIn: "March 26, 2025 / 11:45 am",
      deliveryAddress: "Downtown, Apt 21",
      estimatedTime: "Out for delivery",
      isPending: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-start mb-2">
        <Link to="/orders" className="text-gray-600">
          <ArrowLeft size={24} />
        </Link>
      </div>

      <h1 className="text-2xl font-semibold capitalize">History</h1>

      {/* Order Cards */}
      {orders.map((order, index) => (
        <div key={index} className="bg-white rounded-lg p-4 space-y-4">
          <div className="flex justify-between items-center">
            <p className="font-semibold text-xl capitalize">{order.shop}</p>
            {order.isPending ? (
              <span className="px-3 py-1 bg-yellow-400 capitalize text-white rounded-full text-sm">
                on going
              </span>
            ) : (
              <span className="px-3 py-1 bg-green-400 capitalize text-white rounded-full text-sm">
                Completed
              </span>
            )}
          </div>

          <div>
            <p className="text-slate-400 opacity-95">{order.laundryIn}</p>    
          </div>

          {/* Line Break */}
          <div className="border-t-2 border-gray-200" />

          {/* Status Timeline */}
          <OrderStatusTimeline status={order.status} />
        </div>
      ))}
    </div>
  );
};

export default OrderDetails;
