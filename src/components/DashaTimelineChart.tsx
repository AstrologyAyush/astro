
import React from 'react';
import DashaChart from './charts/DashaChart';

interface DashaTimelineChartProps {
  dashas: any[];
  onImageGenerated?: (imageDataUrl: string) => void;
  width?: number;
  height?: number;
}

const DashaTimelineChart: React.FC<DashaTimelineChartProps> = (props) => {
  return <DashaChart {...props} />;
};

export default DashaTimelineChart;
