import React from 'react';
import { useSelector } from 'react-redux';
import { FaHome, FaComments, FaHistory, FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ProgressStep = ({ step, isCompleted, isLast }) => (
  <div className="flex items-center">
    <div className={`w-4 h-4 rounded-full ${isCompleted ? 'bg-blue-500' : 'bg-gray-300'}`} />
    <span className="mx-2 text-sm text-gray-600">{step}</span>
    {!isLast && (
      <div className={`w-8 h-0.5 ${isCompleted ? 'bg-blue-500' : 'bg-gray-300'}`} />
    )}
  </div>
);

const LaundryHistoryItem = ({ laundryName, date, steps, status }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-gray-800">{laundryName}</h3>
        <span className={`px-3 py-1 rounded-full text-sm ${
          status === 'Completed' 
            ? 'bg-emerald-100 text-emerald-600'
            : 'bg-yellow-100 text-yellow-600'
        }`}>
          {status}
        </span>
      </div>
      <p className="text-xs text-gray-500 mb-3">{date}</p>
      <div className="flex justify-between items-center">
        {steps.map((step, index) => (
          <ProgressStep
            key={step.name}
            step={step.name}
            isCompleted={step.completed}
            isLast={index === steps.length - 1}
          />
        ))}
      </div>
    </div>
  );
};

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center h-[calc(100vh-120px)]">
    <div className="w-48 h-48 mb-6">
      <img
        src="/empty-state-cat.png"
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
  // Get laundry history from Redux store
  const laundryHistory = useSelector((state) => state.laundry.history) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-6">
        <h1 className="text-xl font-semibold text-gray-900 mb-6">History</h1>
        
        {laundryHistory.length > 0 ? (
          <div className="space-y-4">
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

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex justify-around items-center h-16">
          <Link to="/" className="flex flex-col items-center">
            <FaHome className="text-gray-400 text-xl" />
            <span className="text-xs text-gray-400 mt-1">Home</span>
          </Link>
          <Link to="/chat" className="flex flex-col items-center">
            <FaComments className="text-gray-400 text-xl" />
            <span className="text-xs text-gray-400 mt-1">Chat</span>
          </Link>
          <Link to="/history" className="flex flex-col items-center">
            <FaHistory className="text-blue-500 text-xl" />
            <span className="text-xs text-blue-500 mt-1">History</span>
          </Link>
          <Link to="/profile" className="flex flex-col items-center">
            <FaUser className="text-gray-400 text-xl" />
            <span className="text-xs text-gray-400 mt-1">Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default History; 