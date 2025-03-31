import { Check } from 'lucide-react';

const OrderStatusTimeline = ({ status }) => {
  const stages = [
    { id: 'washing', label: 'Washing' },
    { id: 'cleaning', label: 'Cleaning' },
    { id: 'drying', label: 'Drying' },
    { id: 'deliver', label: 'Deliver' }
  ];

  const getCurrentStageIndex = () => {
    return stages.findIndex(stage => stage.id === status);
  };

  const isStageCompleted = (stageIndex) => {
    return stageIndex < getCurrentStageIndex();
  };

  const isCurrentStage = (stageIndex) => {
    return stageIndex === getCurrentStageIndex();
  };

  return (
    <div className="flex justify-between items-center px-4">
      {stages.map((stage, index) => (
        <div key={stage.id} className="flex flex-col items-center relative">
          {/* Connector Line */}
          {index < stages.length - 1 && (
            <div 
              className={`absolute w-full h-0.5 top-3 left-1/2 -z-10 ${
                isStageCompleted(index) ? 'bg-primary' : 'bg-gray-200'
              }`}
            />
          )}
          
          {/* Status Circle */}
          <div 
            className={`w-6 h-6 rounded-full flex items-center justify-center ${
              isStageCompleted(index)
                ? 'bg-primary'
                : isCurrentStage(index)
                ? 'bg-primary'
                : 'bg-gray-200'
            }`}
          >
            {isStageCompleted(index) ? (
              <Check size={14} className="text-white" />
            ) : (
              <div 
                className={`w-2 h-2 rounded-full ${
                  isCurrentStage(index) ? 'bg-white animate-pulse' : 'bg-gray-400'
                }`}
              />
            )}
          </div>
          
          {/* Label */}
          <span className={`text-xs mt-2 ${
            isCurrentStage(index) ? 'text-primary font-medium' : 'text-gray-500'
          }`}>
            {stage.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default OrderStatusTimeline;