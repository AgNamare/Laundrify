import IronBox from "../assets/illustrations/IronBox.svg"

const OptionalServices = ({ options, onToggle }) => {
  return (
    <div className="mb-4">
      <h3 className="font-medium mb-2">Add-ons</h3>
      <div className="flex flex-col gap-2 bg-white p-4 rounded-lg">
        {options.map((opt) => (
          <label key={opt.category} className="flex capitalize items-center gap-2">
            <div className="flex items-center gap-2">
              {opt.category.toLowerCase() === "ironing" && (
                <img src={IronBox} className="h-8 w-6" alt="Iron Box" />
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
