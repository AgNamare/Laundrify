import React from "react";
import { Star, MapPin } from "react-icons/all"; // or the correct import path for your icons

const LaundryCard = ({ item, distance }) => {
  return (
    <div key={item._id} className="rounded-lg bg-white w-fit p-2">
      <div
        className="w-60 h-30 bg-cover bg-center rounded-lg border border-gray-300 relative"
        style={{
          backgroundImage: `url(${
            item.imageUrl ||
            "https://cdn.thewirecutter.com/wp-content/media/2022/05/washing-machine-2048px-8670.jpg?auto=webp&quality=75&crop=3:2&width=1024"
          })`,
        }}
      >
        {/* Rating positioned at top-left corner */}
        <div className="absolute top-1 left-1 px-2 py-1 bg-white text-textPrimary rounded-md opacity-80">
          <span className="flex items-center gap-1 text-xs">
            <Star size={12} className="text-yellow-500 fill-yellow-500" />
            {item.rating || "N/A"}
          </span>
        </div>
      </div>
      <div className="flex flex-col justify-between ml-2">
        <h4 className="text-lg mt-2 text-textPrimary font-semibold">
          {item.name}
        </h4>
        <div className="flex flex-between items-center justify-between mt-1">
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <MapPin size={16} className="text-primary" />
            <span>{distance}</span>
          </div>
          <div className="text-sm text-gray-600 bg-white p-1 rounded-md">
            {item.price || "Unknown price"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaundryCard;
