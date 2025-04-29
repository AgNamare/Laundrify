import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetOrder, useUpdateOrder } from "../api/OrderApi";
import { useGetUsers } from "../api/UserApi"; // Hook to get drivers

const UpdateOrderPage = () => {
  const { orderId } = useParams();

  const { order, isLoading, isError } = useGetOrder(orderId);
  const { updateOrder, isUpdatingOrder } = useUpdateOrder();
  const { users: drivers, isLoading: isDriversLoading } = useGetUsers("driver");

  const [updateData, setUpdateData] = useState({
    delivery: {
      pickupLocation: { coordinates: [], type: "" },
      deliveryLocation: { coordinates: [], type: "" },
      deliveryStatus: "",
    },
    user: {
      role: "",
      _id: "",
      fName: "",
      lName: "",
      phoneNumber: "",
      email: "",
      isVerified: false,
      laundromat: "",
      verificationExpiresAt: "",
    },
    laundromat: {
      location: { type: "", coordinates: [] },
      _id: "",
      name: "",
      address: "",
      contactNumber: "",
      services: [],
    },
    services: [],
    totalPrice: 0,
    status: "",
    paymentStatus: "",
    paymentMethod: "",
    placedAt: "",
    estimatedDeliveryTime: "",
    createdAt: "",
    updatedAt: "",
    driver: "",
  });

  useEffect(() => {
    if (order) {
      setUpdateData({
        delivery: order.delivery,
        user: order.user,
        laundromat: order.laundromat,
        services: order.services,
        totalPrice: order.totalPrice,
        status: order.status,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        placedAt: order.placedAt,
        estimatedDeliveryTime: order.estimatedDeliveryTime || "",
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        driver: order.driver?._id || "",
      });
    }
  }, [order]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDeliveryLocationChange = (e) => {
    const { name, value } = e.target;
    setUpdateData((prev) => ({
      ...prev,
      delivery: {
        ...prev.delivery,
        [name]: value,
      },
    }));
  };

  const handleDriverChange = (e) => {
    setUpdateData((prev) => ({
      ...prev,
      driver: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...updateData,
      estimatedDeliveryTime: updateData.estimatedDeliveryTime
        ? new Date(updateData.estimatedDeliveryTime).toISOString()
        : null,
      driver: updateData.driver || null,
    };

    updateOrder({ orderId, updateData: payload });
  };

  if (isLoading) return <p className="text-center text-lg">Loading...</p>;
  if (isError) return <p className="text-center text-red-500">Error loading order</p>;

  return (
    <div className=" mx-auto p-2">
      <h1 className="text-2xl font-bold mb-6 text-center">Update Order</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        {/* Delivery Status */}
        <div className="flex flex-col">
          <label className="font-medium mb-2">Delivery Status:</label>
          <select
            name="deliveryStatus"
            value={updateData.delivery.deliveryStatus}
            onChange={handleDeliveryLocationChange}
            className="border rounded-md p-2"
          >
            <option value="Pending">Pending</option>
            <option value="On the Way">On the Way</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* User Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="font-medium mb-2">User's First Name:</label>
            <input
              type="text"
              name="fName"
              value={updateData.user.fName}
              onChange={handleInputChange}
              className="border rounded-md p-2"
            />
          </div>
          <div className="flex flex-col">
            <label className="font-medium mb-2">User's Last Name:</label>
            <input
              type="text"
              name="lName"
              value={updateData.user.lName}
              onChange={handleInputChange}
              className="border rounded-md p-2"
            />
          </div>
          <div className="flex flex-col md:col-span-2">
            <label className="font-medium mb-2">User's Email:</label>
            <input
              type="email"
              name="email"
              value={updateData.user.email}
              onChange={handleInputChange}
              className="border rounded-md p-2"
            />
          </div>
        </div>

        {/* Payment Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="font-medium mb-2">Payment Method:</label>
            <input
              type="text"
              name="paymentMethod"
              value={updateData.paymentMethod}
              onChange={handleInputChange}
              className="border rounded-md p-2"
            />
          </div>
          <div className="flex flex-col">
            <label className="font-medium mb-2">Total Price:</label>
            <input
              type="number"
              name="totalPrice"
              value={updateData.totalPrice}
              onChange={handleInputChange}
              className="border rounded-md p-2"
            />
          </div>
        </div>

        {/* Order Status */}
        <div className="flex flex-col">
          <label className="font-medium mb-2">Status:</label>
          <select
            name="status"
            value={updateData.status}
            onChange={handleInputChange}
            className="border rounded-md p-2"
          >
            <option value="Pending">Pending</option>
            <option value="Washing">Washing</option>
            <option value="Drying">Drying</option>
            <option value="Folding">Folding</option>
            <option value="Delivering">Delivering</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Estimated Delivery Time */}
        <div className="flex flex-col">
          <label className="font-medium mb-2">Estimated Delivery Time:</label>
          <input
            type="datetime-local"
            name="estimatedDeliveryTime"
            value={
              updateData.estimatedDeliveryTime
                ? new Date(updateData.estimatedDeliveryTime).toISOString().slice(0, 16)
                : ""
            }
            onChange={handleInputChange}
            className="border rounded-md p-2"
          />
        </div>

        {/* Driver Assignment */}
        <div className="flex flex-col">
          <label className="font-medium mb-2">Assign Driver:</label>
          {isDriversLoading ? (
            <p className="text-gray-600">Loading drivers...</p>
          ) : (
            <>
              {order?.driver && (
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Currently assigned:</strong> {order.driver.fName} {order.driver.lName} ({order.driver.phoneNumber})
                </p>
              )}
              <select
                name="driver"
                value={updateData.driver}
                onChange={handleDriverChange}
                className="border rounded-md p-2"
              >
                <option value="">-- Select Driver --</option>
                {drivers?.map((driver) => (
                  <option key={driver._id} value={driver._id}>
                    {driver.fName} {driver.lName} ({driver.phoneNumber})
                  </option>
                ))}
              </select>
            </>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isUpdatingOrder}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md disabled:opacity-50"
          >
            {isUpdatingOrder ? "Updating..." : "Update Order"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateOrderPage;
