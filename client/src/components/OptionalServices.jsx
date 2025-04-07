const OptionalServices = ({ options, onToggle }) => {
  return (
    <div className="mb-6">
      <h3 className="font-medium mb-2">Add-ons</h3>
      <div className="flex flex-col gap-2">
        {options.map((opt) => (
          <label key={opt.category} className="flex items-center gap-2">
            <input
              type="checkbox"
              onChange={(e) => onToggle(opt, e.target.checked)}
            />
            <span>
              {opt.category} (+{opt.priceIncreasePercentage || 0}%)
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default OptionalServices;
