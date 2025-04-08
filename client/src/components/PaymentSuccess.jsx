import React from "react";
import { Check } from "lucide-react";

const PaymentSuccessModal = ({ onClose, onDetailsOrder, onBackHome }) => {
  return (
    <div className="fixed inset-0 h-screen bg-primary bg-opacity-50 flex items-center justify-center z-50">
      <div className="">
        <div className="flex flex-col items-center">
          <div className="relative w-80 h-80 mb-4">
            {/* Outer Red Circle */}
            <div className="absolute inset-4 animate-pulse rounded-full bg-[#FFFFFF70] bg-opacity-20 opacity-10"></div>
            {/* Middle White Circle */}
            <div className="absolute inset-12 rounded-full bg-white flex items-center opacity-80 justify-center">
              {/* Inner Blue Circle with Tick */}
              <div className="w-40 h-40 bg-primary rounded-full flex items-center justify-center">
                <Check className=" text-white" size={120} />
              </div>
            </div>
          </div>
          <div className="px-4">
            <h2 className="text-2xl font-semibold text-center mb-2 text-white">
              Payment Success
            </h2>
            <p className="text-white  text-center mb-6">
              Your payment was successful. Just wait for your clean clothes to
              arrive at home.
            </p>
            <button
              onClick={onDetailsOrder}
              className="w-full  bg-white border-2 border-primary text-primary py-3 rounded-lg mb-3 font-semibold"
            >
              Details order
            </button>
            <button
              onClick={onBackHome}
              className="w-full bg-primary text-white py-3 rounded-lg font-medium border border-white"
            >
              Back home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessModal;
