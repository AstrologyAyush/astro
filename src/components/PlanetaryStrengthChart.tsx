
import React, { useRef, useEffect } from 'react';

interface PlanetaryStrengthChartProps {
  planets: any[];
  onImageGenerated?: (imageDataUrl: string) => void;
  width?: number;
  height?: number;
}

const PlanetaryStrengthChart: React.FC<PlanetaryStrengthChartProps> = ({
  planets,
  onImageGenerated,
  width = 600,
  height = 400
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Planet colors for visual appeal
  const planetColors: { [key: string]: string } = {
    'SU': '#FF6B35', // Sun - Orange
    'MO': '#4A90E2', // Moon - Blue
    'MA': '#E74C3C', // Mars - Red
    'ME': '#2ECC71', // Mercury - Green
    'JU': '#F39C12', // Jupiter - Gold
    'VE': '#9B59B6', // Venus - Purple
    'SA': '#34495E', // Saturn - Dark Blue
    'RA': '#8E44AD', // Rahu - Dark Purple
    'KE': '#E67E22'  // Ketu - Dark Orange
  };

  const drawStrengthChart = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    // Clear canvas with white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Chart settings
    const margin = 60;
    const chartWidth = width - 2 * margin;
    const chartHeight = height - 2 * margin;
    const barHeight = 35;
    const barSpacing = 45;

    // Title
    ctx.fillStyle = '#2C3E50';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Planetary Strength Analysis (Shadbala)', width / 2, 30);

    // Extract and sort planets by strength
    const planetsWithStrength = planets
      .filter(planet => planet.shadbala !== undefined)
      .sort((a, b) => (b.shadbala || 0) - (a.shadbala || 0));

    if (planetsWithStrength.length === 0) {
      ctx.fillStyle = '#7F8C8D';
      ctx.font = '14px Arial';
      ctx.fillText('No planetary strength data available', width / 2, height / 2);
      return;
    }

    // Draw strength bars
    planetsWithStrength.forEach((planet, index) => {
      const y = margin + 20 + index * barSpacing;
      const strength = planet.shadbala || 0;
      const barWidth = (strength / 100) * (chartWidth - 120); // Max bar width minus space for labels

      // Draw background bar
      ctx.fillStyle = '#ECF0F1';
      ctx.fillRect(margin + 100, y, chartWidth - 120, barHeight);

      // Draw strength bar with planet color
      const planetColor = planetColors[planet.id] || '#3498DB';
      ctx.fillStyle = planetColor;
      ctx.fillRect(margin + 100, y, Math.max(barWidth, 5), barHeight);

      // Add border to bars
      ctx.strokeStyle = '#BDC3C7';
      ctx.lineWidth = 1;
      ctx.strokeRect(margin + 100, y, chartWidth - 120, barHeight);

      // Planet name
      ctx.fillStyle = '#2C3E50';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'right';
      ctx.fillText(planet.name || planet.id, margin + 90, y + barHeight / 2 + 5);

      // Strength percentage
      ctx.fillStyle = '#34495E';
      ctx.font = '12px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`${strength.toFixed(1)}%`, margin + 110 + barWidth + 10, y + barHeight / 2 + 4);

      // Strength category text
      let category = '';
      let categoryColor = '#7F8C8D';
      if (strength >= 80) {
        category = 'Excellent';
        categoryColor = '#27AE60';
      } else if (strength >= 60) {
        category = 'Good';
        categoryColor = '#F39C12';
      } else if (strength >= 40) {
        category = 'Average';
        categoryColor = '#E67E22';
      } else {
        category = 'Weak';
        categoryColor = '#E74C3C';
      }

      ctx.fillStyle = categoryColor;
      ctx.font = '10px Arial';
      ctx.fillText(category, margin + 110 + barWidth + 60, y + barHeight / 2 + 4);
    });

    // Legend
    const legendY = height - 50;
    ctx.fillStyle = '#7F8C8D';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Strength Scale: 0-40% (Weak) | 40-60% (Average) | 60-80% (Good) | 80-100% (Excellent)', width / 2, legendY);

    // Generate image data URL and call callback
    if (onImageGenerated) {
      const imageDataUrl = canvas.toDataURL('image/png');
      onImageGenerated(imageDataUrl);
    }
  };

  useEffect(() => {
    if (planets && planets.length > 0) {
      drawStrengthChart();
    }
  }, [planets, width, height]);

  return (
    <div className="flex flex-col items-center space-y-4">
      <canvas
        ref={canvasRef}
        className="border border-gray-300 rounded-lg shadow-lg"
        style={{ maxWidth: '100%', height: 'auto' }}
      />
      <p className="text-sm text-gray-600 text-center">
        Planetary Strength Analysis (Shadbala) - Visual Representation
      </p>
    </div>
  );
};

export default PlanetaryStrengthChart;
