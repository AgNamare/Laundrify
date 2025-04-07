import { Minus, Plus } from "lucide-react";

const ClothesItem = ({ item, onQuantityChange }) => {
  return (
    <div className="flex items-center justify-between bg-white rounded-lg px-4 py-2">
      <div className="flex gap-2">
        <img
          src={item.image || "https://via.placeholder.com/50"}
          alt={item.name}
          className="w-10 h-10 object-cover rounded-full shadow-sm"
        />
        <div className="flex flex-col">
          <p className="font-medium">{item.name}</p>
          <p className="text-sm text-gray-500">Ksh {item.price}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onQuantityChange(item.id, -1)}
          className="w-8 h-8 border border-textSecondary rounded-full flex justify-center items-center"
        >
          <Minus size={16} />
        </button>
        <span className="w-4 text-center">{item.quantity}</span>
        <button
          onClick={() => onQuantityChange(item.id, 1)}
          className="w-8 h-8 border border-textSecondary rounded-full flex justify-center items-center"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
};

export default ClothesItem;
