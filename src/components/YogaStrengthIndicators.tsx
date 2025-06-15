
import React from "react";
import YogaChart from './charts/YogaChart';

interface YogaStrengthIndicatorsProps {
  yogas: {
    name: string;
    strength: number;
    type: string;
    sanskritName?: string;
  }[];
  onImageGenerated?: (imageUrl: string) => void;
  width?: number;
  height?: number;
}

const YogaStrengthIndicators: React.FC<YogaStrengthIndicatorsProps> = (props) => {
  return <YogaChart {...props} />;
};

export default YogaStrengthIndicators;
