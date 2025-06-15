
import React, { useRef, useEffect } from 'react';
import { ChartRenderer, planetColors } from '../../lib/chartDrawingUtils';

interface Planet {
  id: string;
  name: string;
  rashi: number;
  degree: number;
  house: number;
  shadbala: number;
}

interface PlanetaryChartProps {
  planets: Planet[];
  onImageGenerated?: (imageDataUrl: string) => void;
  width?: number;
  height?: number;
}

const PlanetaryChart: React.FC<PlanetaryChartProps> = ({
  planets,
  onImageGenerated,
  width = 600,
  height = 400
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawChart = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;

    const renderer = new ChartRenderer(ctx, { width, height, margin: 40 });

    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Title
    ctx.fillStyle = '#2C3E50';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Planetary Strength Analysis', width / 2, 30);

    if (!planets || planets.length === 0) {
      ctx.fillStyle = '#7F8C8D';
      ctx.font = '14px Arial';
      ctx.fillText('No planetary data available', width / 2, height / 2);
      return;
    }

    const margin = 40;
    const chartWidth = width - 2 * margin;
    const chartHeight = height - 120;
    const barHeight = Math.min(30, chartHeight / planets.length);
    const startY = 60;

    // Draw bars for each planet
    planets.forEach((planet, index) => {
      const y = startY + index * (barHeight + 10);
      const barWidth = (planet.shadbala / 100) * (chartWidth - 150);
      
      // Background bar
      ctx.fillStyle = '#ECF0F1';
      ctx.fillRect(margin + 120, y, chartWidth - 150, barHeight);
      
      // Strength bar
      const color = planetColors[planet.id] || '#3498DB';
      ctx.fillStyle = color;
      ctx.fillRect(margin + 120, y, barWidth, barHeight);
      
      // Planet name
      ctx.fillStyle = '#2C3E50';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'right';
      ctx.fillText(planet.name, margin + 110, y + barHeight / 2 + 4);
      
      // Strength percentage
      ctx.textAlign = 'left';
      ctx.fillText(`${planet.shadbala.toFixed(1)}%`, margin + chartWidth - 40, y + barHeight / 2 + 4);
    });

    // Legend
    const legendItems = [
      { color: '#27AE60', label: 'Strong (80%+)' },
      { color: '#F39C12', label: 'Moderate (60%+)' },
      { color: '#E74C3C', label: 'Weak (<60%)' }
    ];
    
    renderer.drawLegend(legendItems, height - 30);

    if (onImageGenerated) {
      onImageGenerated(canvas.toDataURL('image/png'));
    }
  };

  useEffect(() => {
    drawChart();
  }, [planets, width, height]);

  return (
    <div className="flex flex-col items-center space-y-4">
      <canvas
        ref={canvasRef}
        className="border border-gray-300 rounded-lg shadow-lg"
        style={{ maxWidth: '100%', height: 'auto' }}
      />
      <p className="text-sm text-gray-600 text-center">
        Shadbala strength analysis for all planets
      </p>
    </div>
  );
};

export default PlanetaryChart;
