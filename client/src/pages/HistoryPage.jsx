import React, { useEffect, useState } from "react";
import axios from "axios";
import Empty from "../assets/illustrations/Empty.png"
import {
  Home,
  MessageSquare,
  History as HistoryIcon,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { format } from "date-fns";

const ProgressStep = ({ step, isCompleted, isCurrent }) => (
  <div className="flex items-center">
    <div
      className={`relative w-4 h-4 rounded-full ${
        isCompleted || isCurrent ? "bg-blue-500" : "bg-gray-300"
      }`}
    >
      {isCurrent && (
        <div className="absolute inset-[4px] bg-white animate-pulse rounded-full" />
      )}
    </div>
    <span className="mx-2 text-xs text-gray-600 capitalize">{step}</span>
  </div>
);

const LaundryHistoryItem = ({ laundryName, date, steps, status }) => {
  const formattedDate = format(new Date(date), "MMMM do yyyy / h:mma");

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-gray-800">{laundryName}</h3>
        <span
          className={`px-3 py-1 rounded-full text-sm ${
            status === "Completed"
              ? "bg-emerald-100 text-emerald-600"
              : "bg-yellow-400 text-white"
          }`}
        >
          {status}
        </span>
      </div>

      {/* Date */}
      <p className="text-xs text-gray-500 mb-3">{formattedDate}</p>

      {/* Divider */}
      <div className="border-t border-gray-200 my-3" />

      {/* Progress */}
      <div className="flex justify-between items-center">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          const isCompleted = step.completed;
          const isCurrent =
            !isCompleted &&
            (index === 0 || (steps[index - 1]?.completed && !step.completed));

          return (
            <ProgressStep
              key={step.name}
              step={step.name}
              isCompleted={step.completed}
              isCurrent={step.current}
            />
          );
        })}
      </div>
    </div>
  );
};

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center min-h-[calc(100vh-230px)]">
    <div className="w-56 h-56 mb-6">
      <img
        src={Empty}
        alt="No laundry history"
        className="w-full h-full object-contain"
      />
    </div>
    <h3 className="text-lg font-semibold text-gray-800 mb-2">
      No laundry history yet
    </h3>
    <p className="text-gray-600 text-center text-sm">
      Let's do laundry transactions now and feel the convenience
    </p>
  </div>
);

const History = () => {
  const [laundryHistory, setLaundryHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.user.user.user);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/v1/orders/user/${user._id}`
      );
      return response.data;
    } catch (error) {
      console.log(error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch laundry history"
      );
    }
  };

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await fetchHistory();

        const stepOrder = ["washing", "drying", "folding", "delivering"];
        const statusToStep = {
          "order placed": "washing",
          washing: "washing",
          drying: "drying",
          folding: "folding",
          delivering: "delivering",
          completed: "delivering",
        };

        if (Array.isArray(data)) {
          const transformed = data.map((order) => {
            const statusKey = order.status.toLowerCase();
            const currentStep = statusToStep[statusKey] || "washing";
            const currentIndex = stepOrder.indexOf(currentStep);

            return {
              laundryName: order.laundromat.name || "Unknown Laundry",
              date: order.createdAt,
              status: order.status,
              steps: stepOrder.map((step, index) => {
                const completed = index < currentIndex;
                const isCurrent = index === currentIndex;
                return {
                  name: step,
                  completed,
                  current: isCurrent,
                };
              }),
            };
          });

          setLaundryHistory(transformed);
        } else {
          console.error("Fetched data is not an array:", data);
          setLaundryHistory([]);
        }
      } catch (err) {
        console.error(err.message);
        setLaundryHistory([]);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  return (
    <div className="min-h-[calc(100vh-100px)]">
      <div className="">
        <h1 className="text-2xl font-semibold text-textPrimary mb-4">
          History
        </h1>

        {loading ? (
          <p className="text-gray-500 text-sm">Loading...</p>
        ) : laundryHistory.length > 0 ? (
          <div className="space-y-3">
            {laundryHistory.map((item, index) => (
              <LaundryHistoryItem
                key={index}
                laundryName={item.laundryName}
                date={item.date}
                steps={item.steps}
                status={item.status}
              />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
};

export default History;
