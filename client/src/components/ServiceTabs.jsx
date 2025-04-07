const ServiceTabs = ({ services, selectedService, onSelect }) => {
  return (
    <div className="flex overflow-x-auto gap-2 mb-4">
      {services.map((service) => (
        <button
          key={service.category}
          onClick={() => onSelect(service.category)}
          className={`px-4 py-2 text-sm rounded-full border whitespace-nowrap ${
            selectedService === service.category
              ? "bg-primary text-white"
              : "bg-white text-gray-600"
          }`}
        >
          {service.category}
        </button>
      ))}
    </div>
  );
};

export default ServiceTabs;
