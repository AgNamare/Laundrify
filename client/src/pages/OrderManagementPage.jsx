import React, { useState } from "react";
import { useGetOrders } from "../api/OrderApi";
import { format } from "date-fns";
import { Link, useParams } from "react-router-dom";

const OrderManagementPage = () => {
  const { laundromatId } = useParams();
  const [filters, setFilters] = useState({
    status: "",
    service: "",
    user: "",
    startDate: "",
    endDate: "",
  });

  const { orders, isLoading, isError, error } = useGetOrders(
    laundromatId,
    filters
  );

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value ? new Date(value).toISOString() : "",
    }));
  };

  if (isLoading) return <p>Loading orders...</p>;
  if (isError) return <p>Error: {error?.message || "Something went wrong"}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Order Management</h1>

      <div className="filters mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            type="text"
            name="user"
            value={filters.user}
            onChange={handleFilterChange}
            placeholder="Filter by User"
            className="border p-2 rounded"
          />
          <select
            name="service"
            value={filters.service}
            onChange={handleFilterChange}
            className="border p-2 rounded"
          >
            <option value="">All Services</option>
            <option value="Wash & Fold">Wash & Fold</option>
            <option value="Dry Cleaning">Dry Cleaning</option>
          </select>
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="border p-2 rounded"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Ready for Pickup">Ready for Pickup</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <input
            type="date"
            name="startDate"
            value={
              filters.startDate
                ? format(new Date(filters.startDate), "yyyy-MM-dd")
                : ""
            }
            onChange={handleDateChange}
            className="border p-2 rounded"
          />
          <input
            type="date"
            name="endDate"
            value={
              filters.endDate
                ? format(new Date(filters.endDate), "yyyy-MM-dd")
                : ""
            }
            onChange={handleDateChange}
            className="border p-2 rounded"
          />
        </div>
      </div>

      <table className="table-auto w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border p-2">Order ID</th>
            <th className="border p-2">User</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Total Price</th>
            <th className="border p-2">Placed At</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {orders && orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order._id}>
                <td className="border p-2">{order._id}</td>
                <td className="border p-2">
                  {order.user.fName} {order.user.lName}
                </td>
                <td className="border p-2">{order.status}</td>
                <td className="border p-2">Ksh {order.totalPrice}</td>
                <td className="border p-2">
                  {format(new Date(order.placedAt), "yyyy-MM-dd HH:mm")}
                </td>
                <td className="border p-2">
                  <Link
                    to={`/laundromat/${laundromatId}/orders/${order._id}`}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="border p-2 text-center">
                No orders found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrderManagementPage;
