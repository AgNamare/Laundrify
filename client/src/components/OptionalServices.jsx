import { Sparkles } from "lucide-react"; // 👈 Import the relevant icon

const OptionalServices = ({ options, onToggle }) => {
  return (
    <div className="mb-4">
      <h3 className="font-medium mb-2">Add-ons</h3>
      <div className="flex flex-col gap-2 bg-white p-4 rounded-lg">
        {options.map((opt) => (
          <label key={opt.category} className="flex capitalize items-center gap-2">
            <div className="flex items-center gap-2">
              {opt.category.toLowerCase() === "ironing" && (
                <Sparkles size={18} className="text-primary" />
              )}
              <span className="text-sm">
                {opt.category} (+{opt.priceIncreasePercentage || 0}%)
              </span>
              <input
                type="checkbox"
                onChange={(e) => onToggle(opt, e.target.checked)}
                className="accent-primary w-4 h-4"
              />
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default OptionalServices;
