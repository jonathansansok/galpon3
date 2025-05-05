//frontend\src\app\portal\eventos\analytics\ChartContainer.tsx
import React from 'react';

interface ChartContainerProps {
  children: React.ReactNode;
}

const ChartContainer: React.FC<ChartContainerProps> = ({ children }) => {
  return (
    <div className="chart-container">
      {children}
    </div>
  );
};

export default ChartContainer;