
import React, { useRef, useEffect } from 'react';

interface Planet {
  id: string;
  name: string;
  rashi: number;
  degree: number;
  house: number;
}

interface KundaliChartGeneratorProps {
  planets: Planet[];
  chartType?: 'north' | 'south';
  size?: number;
  onImageGenerated?: (imageDataUrl: string) => void;
}

const KundaliChartGenerator: React.FC<KundaliChartGeneratorProps> = ({
  planets,
  chartType = 'north',
  size = 400,
  onImageGenerated
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // House positions for North Indian chart style
  const northIndianHouses = [
    { x: 0.5, y: 0, house: 1 }, // Top center
    { x: 0.75, y: 0.25, house: 2 }, // Top right
    { x: 1, y: 0.5, house: 3 }, // Right center
    { x: 0.75, y: 0.75, house: 4 }, // Bottom right
    { x: 0.5, y: 1, house: 5 }, // Bottom center
    { x: 0.25, y: 0.75, house: 6 }, // Bottom left
    { x: 0, y: 0.5, house: 7 }, // Left center
    { x: 0.25, y: 0.25, house: 8 }, // Top left
    { x: 0.375, y: 0.125, house: 9 }, // Inner top
    { x: 0.625, y: 0.375, house: 10 }, // Inner right
    { x: 0.375, y: 0.625, house: 11 }, // Inner bottom
    { x: 0.125, y: 0.375, house: 12 } // Inner left
  ];

  // Zodiac signs mapping
  const zodiacSigns = [
    'Ari', 'Tau', 'Gem', 'Can', 'Leo', 'Vir',
    'Lib', 'Sco', 'Sag', 'Cap', 'Aqu', 'Pis'
  ];

  // Planet symbols
  const planetSymbols: { [key: string]: string } = {
    'SU': '☉', // Sun
    'MO': '☽', // Moon
    'MA': '♂', // Mars
    'ME': '☿', // Mercury
    'JU': '♃', // Jupiter
    'VE': '♀', // Venus
    'SA': '♄', // Saturn
    'RA': '☊', // Rahu
    'KE': '☋'  // Ketu
  };

  const drawChart = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = size;
    canvas.height = size;

    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    // Draw chart outline (diamond shape for North Indian style)
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    // Draw outer diamond
    ctx.moveTo(size / 2, 10); // Top
    ctx.lineTo(size - 10, size / 2); // Right
    ctx.lineTo(size / 2, size - 10); // Bottom
    ctx.lineTo(10, size / 2); // Left
    ctx.closePath();
    ctx.stroke();

    // Draw inner lines to create houses
    ctx.lineWidth = 1;
    
    // Horizontal and vertical lines
    ctx.beginPath();
    ctx.moveTo(size / 2, 10);
    ctx.lineTo(size / 2, size - 10);
    ctx.moveTo(10, size / 2);
    ctx.lineTo(size - 10, size / 2);
    ctx.stroke();

    // Diagonal lines
    ctx.beginPath();
    ctx.moveTo(size * 0.25, size * 0.25);
    ctx.lineTo(size * 0.75, size * 0.75);
    ctx.moveTo(size * 0.75, size * 0.25);
    ctx.lineTo(size * 0.25, size * 0.75);
    ctx.stroke();

    // Draw house numbers
    ctx.fillStyle = '#666666';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    
    northIndianHouses.forEach(({ x, y, house }) => {
      const posX = x * (size - 40) + 20;
      const posY = y * (size - 40) + 25;
      ctx.fillText(house.toString(), posX, posY);
    });

    // Group planets by house
    const planetsByHouse: { [house: number]: Planet[] } = {};
    planets.forEach(planet => {
      const house = planet.house || 1;
      if (!planetsByHouse[house]) {
        planetsByHouse[house] = [];
      }
      planetsByHouse[house].push(planet);
    });

    // Draw planets in their houses
    ctx.font = 'bold 14px Arial';
    ctx.fillStyle = '#8B0000'; // Dark red for planets

    Object.entries(planetsByHouse).forEach(([houseStr, housePlanets]) => {
      const houseNum = parseInt(houseStr);
      const housePos = northIndianHouses.find(h => h.house === houseNum);
      
      if (housePos && housePlanets.length > 0) {
        const baseX = housePos.x * (size - 60) + 30;
        const baseY = housePos.y * (size - 60) + 40;
        
        housePlanets.forEach((planet, index) => {
          const offsetY = index * 16; // Stack planets vertically if multiple in same house
          const symbol = planetSymbols[planet.id] || planet.id;
          const degree = Math.round(planet.degree || 0);
          
          ctx.fillText(
            `${symbol}${degree}°`,
            baseX,
            baseY + offsetY
          );
        });
      }
    });

    // Draw zodiac signs around the chart
    ctx.font = '10px Arial';
    ctx.fillStyle = '#4A5568';
    
    zodiacSigns.forEach((sign, index) => {
      const angle = (index * 30 - 90) * Math.PI / 180; // Start from top (Aries)
      const radius = size * 0.42;
      const x = size / 2 + Math.cos(angle) * radius;
      const y = size / 2 + Math.sin(angle) * radius;
      
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle + Math.PI / 2);
      ctx.textAlign = 'center';
      ctx.fillText(sign, 0, 4);
      ctx.restore();
    });

    // Generate image data URL and call callback
    if (onImageGenerated) {
      const imageDataUrl = canvas.toDataURL('image/png');
      onImageGenerated(imageDataUrl);
    }
  };

  useEffect(() => {
    drawChart();
  }, [planets, chartType, size]);

  return (
    <div className="flex flex-col items-center space-y-4">
      <canvas
        ref={canvasRef}
        className="border border-gray-300 rounded-lg shadow-lg"
        style={{ maxWidth: '100%', height: 'auto' }}
      />
      <p className="text-sm text-gray-600 text-center">
        {chartType === 'north' ? 'North Indian' : 'South Indian'} Style Kundali Chart
      </p>
    </div>
  );
};

export default KundaliChartGenerator;
