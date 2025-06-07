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

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 text-lg">Loading orders...</p>
      </div>
    );
  if (isError)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-lg">
          Error: {error?.message || "Something went wrong"}
        </p>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Order Management
      </h1>

      {/* Filters */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            name="user"
            value={filters.user}
            onChange={handleFilterChange}
            placeholder="Filter by User"
            className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <select
            name="service"
            value={filters.service}
            onChange={handleFilterChange}
            className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">All Services</option>
            <option value="Wash & Fold">Wash & Fold</option>
            <option value="Dry Cleaning">Dry Cleaning</option>
          </select>
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
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
            className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
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
            className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Order ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">User</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Total Price</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Placed At</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders && orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 border-t text-gray-600">{order._id}</td>
                  <td className="px-6 py-4 border-t text-gray-600">
                    {order.user.fName} {order.user.lName}
                  </td>
                  <td className="px-6 py-4 border-t text-gray-600">{order.status}</td>
                  <td className="px-6 py-4 border-t text-gray-600">
                    Ksh {order.totalPrice.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 border-t text-gray-600">
                    {format(new Date(order.placedAt), "yyyy-MM-dd HH:mm")}
                  </td>
                  <td className="px-6 py-4 border-t text-center">
                    <Link
                      to={`/laundromat/${laundromatId}/orders/${order._id}`}
                      className="inline-block bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-md transition duration-200"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="text-center px-6 py-8 text-gray-500 text-sm border-t"
                >
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderManagementPage;
