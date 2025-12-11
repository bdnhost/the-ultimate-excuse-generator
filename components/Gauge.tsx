import React from 'react';

interface GaugeProps {
  value: number;
}

const Gauge: React.FC<GaugeProps> = ({ value }) => {
  // Determine color based on value
  let colorClass = "text-red-500";
  if (value > 30) colorClass = "text-orange-400";
  if (value > 60) colorClass = "text-yellow-400";
  if (value > 85) colorClass = "text-green-500";

  const strokeDasharray = 2 * Math.PI * 40; // radius 40
  const strokeDashoffset = strokeDasharray * ((100 - value) / 100);

  return (
    <div className="relative flex flex-col items-center justify-center p-2">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="48"
            cy="48"
            r="40"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-gray-100"
          />
          <circle
            cx="48"
            cy="48"
            r="40"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`${colorClass} transition-all duration-1000 ease-out`}
          />
        </svg>
        <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
          <span className={`text-xl font-black ${colorClass}`}>{value}%</span>
        </div>
      </div>
    </div>
  );
};

export default Gauge;