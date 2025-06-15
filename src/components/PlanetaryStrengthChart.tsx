
import React from 'react';
import PlanetaryChart from './charts/PlanetaryChart';

interface Planet {
  id: string;
  name: string;
  rashi: number;
  degree: number;
  house: number;
  shadbala: number;
}

interface PlanetaryStrengthChartProps {
  planets: Planet[];
  onImageGenerated?: (imageDataUrl: string) => void;
  width?: number;
  height?: number;
}

const PlanetaryStrengthChart: React.FC<PlanetaryStrengthChartProps> = (props) => {
  return <PlanetaryChart {...props} />;
};

export default PlanetaryStrengthChart;
