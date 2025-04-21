import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetOrder, useUpdateOrder } from "../api/OrderApi";

const UpdateOrderPage = () => {
  const { orderId } = useParams();

  const { order, isLoading, isError } = useGetOrder(orderId);
  const { updateOrder, isUpdatingOrder } = useUpdateOrder();

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
    estimatedDeliveryTime: "", // <-- new field
    createdAt: "",
    updatedAt: "",
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
        estimatedDeliveryTime: order.estimatedDeliveryTime || "", // <-- prefill if exists
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
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

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...updateData,
      estimatedDeliveryTime: updateData.estimatedDeliveryTime
        ? new Date(updateData.estimatedDeliveryTime).toISOString()
        : null,
    };

    updateOrder({ orderId, updateData: payload });
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading order</p>;

  return (
    <div>
      <h1>Update Order</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Delivery Status:
            <select
              name="deliveryStatus"
              value={updateData.delivery.deliveryStatus}
              onChange={handleDeliveryLocationChange}
            >
              <option value="Pending">Pending</option>
              <option value="On the Way">On the Way</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            User's First Name:
            <input
              type="text"
              name="fName"
              value={updateData.user.fName}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div>
          <label>
            User's Last Name:
            <input
              type="text"
              name="lName"
              value={updateData.user.lName}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div>
          <label>
            User's Email:
            <input
              type="email"
              name="email"
              value={updateData.user.email}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div>
          <label>
            Payment Method:
            <input
              type="text"
              name="paymentMethod"
              value={updateData.paymentMethod}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div>
          <label>
            Total Price:
            <input
              type="number"
              name="totalPrice"
              value={updateData.totalPrice}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div>
          <label>
            Status:
            <select
              name="status"
              value={updateData.status}
              onChange={handleInputChange}
            >
              <option value="Pending">Pending</option>
              <option value="Washing">Washing</option>
              <option value="Drying">Drying</option>
              <option value="Folding">Folding</option>
              <option value="Delivering">Delivering</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            Estimated Delivery Time:
            <input
              type="datetime-local"
              name="estimatedDeliveryTime"
              value={
                updateData.estimatedDeliveryTime
                  ? new Date(updateData.estimatedDeliveryTime)
                      .toISOString()
                      .slice(0, 16)
                  : ""
              }
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div>
          <button type="submit" disabled={isUpdatingOrder}>
            {isUpdatingOrder ? "Updating..." : "Update Order"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateOrderPage;
