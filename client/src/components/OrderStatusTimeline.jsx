import { Check, Truck, ArchiveIcon } from "lucide-react";
import TshirtIcon from "../assets/illustrations/Clothes.svg";
import DryingIcon from "../assets/illustrations/Drying.svg";

const OrderStatusTimeline = ({ status }) => {
  const stages = [
    { id: "washing", label: "Washing" },
    { id: "drying", label: "Drying" },
    { id: "folding", label: "Folding" },
    { id: "delivering", label: "Deliver" },
  ];

  const getCurrentStageIndex = () => {
    return stages.findIndex((stage) => stage.id === status);
  };

  const isStageCompleted = (stageIndex) => {
    return stageIndex < getCurrentStageIndex();
  };

  const isCurrentStage = (stageIndex) => {
    return stageIndex === getCurrentStageIndex();
  };

  const getStageIcon = (stage, index) => {
    if (isStageCompleted(index)) {
      return <Check size={16} className="text-white" />;
    }

    const isCurrent = isCurrentStage(index);
    const grayscaleClass = isCurrent ? "" : "grayscale";

    switch (stage.id) {
      case "washing":
        return (
          <img
            src={TshirtIcon}
            alt="Washing"
            className={`w-8 h-8 ${grayscaleClass}`}
          />
        );
      case "drying":
        return (
          <img
            src={DryingIcon}
            alt="Drying"
            className={`w-8 h-8 ${grayscaleClass}`}
          />
        );
      case "folding":
        return (
          <ArchiveIcon
            size={24}
            className={`text-primary ${!isCurrent ? "grayscale opacity-50" : ""}`}
          />
        );
      case "delivering":
        return (
          <Truck
            size={24}
            className={`text-primary ${!isCurrent ? "grayscale opacity-50" : ""}`}
          />
        );
      default:
        return <div className="w-2 h-2 bg-gray-400 rounded-full" />;
    }
  };

  return (
    <div className="flex justify-center items-center relative w-full">
      <div className="flex items-center w-full">
        {stages.map((stage, index) => (
          <div
            key={stage.id}
            className="flex flex-col items-center mx-4 relative"
          >
            {/* Status Circle or Icon */}
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                isStageCompleted(index)
                  ? "bg-primary border-primary"
                  : isCurrentStage(index)
                  ? "bg-white border-primary"
                  : "bg-gray-100 border-gray-300"
              }`}
            >
              {getStageIcon(stage, index)}
            </div>

            {/* Label */}
            <span
              className={`text-xs mt-1 ${
                isCurrentStage(index)
                  ? "text-primary font-semibold"
                  : "text-gray-600"
              }`}
            >
              {stage.label}
            </span>

            {/* Connector Line */}
            {index < stages.length - 1 && (
              <div className="absolute top-1/3 left-full w-full h-0.5 -translate-y-1/2 z-0">
                <div
                  className={`w-full h-full ${
                    isStageCompleted(index) && isStageCompleted(index + 1)
                      ? "bg-primary"
                      : isStageCompleted(index) && isCurrentStage(index + 1)
                      ? "bg-primary"
                      : "border-t-2 border-dotted border-gray-300"
                  }`}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderStatusTimeline;
