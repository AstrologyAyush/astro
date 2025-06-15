
import React, { useRef, useEffect } from 'react';
import { ChartRenderer, planetColors } from '../../lib/chartDrawingUtils';

interface DashaChartProps {
  dashas: any[];
  onImageGenerated?: (imageDataUrl: string) => void;
  width?: number;
  height?: number;
}

const DashaChart: React.FC<DashaChartProps> = ({
  dashas,
  onImageGenerated,
  width = 700,
  height = 300
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawTimeline = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;

    const renderer = new ChartRenderer(ctx, { width, height, margin: 50 });

    // Clear and setup
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Title
    ctx.fillStyle = '#2C3E50';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Dasha Timeline (Major Planetary Periods)', width / 2, 30);

    if (!dashas || dashas.length === 0) {
      ctx.fillStyle = '#7F8C8D';
      ctx.font = '14px Arial';
      ctx.fillText('No Dasha data available', width / 2, height / 2);
      return;
    }

    const margin = 50;
    const chartWidth = width - 2 * margin;
    const timelineY = margin + 50;
    const timelineHeight = 40;

    // Calculate time range
    let earliestDate = new Date(Math.min(...dashas.map(d => new Date(d.startDate).getTime())));
    let latestDate = new Date(Math.max(...dashas.map(d => new Date(d.endDate).getTime())));
    
    const timePadding = (latestDate.getTime() - earliestDate.getTime()) * 0.05;
    earliestDate = new Date(earliestDate.getTime() - timePadding);
    latestDate = new Date(latestDate.getTime() + timePadding);

    const totalTimeSpan = latestDate.getTime() - earliestDate.getTime();

    // Draw base timeline
    ctx.strokeStyle = '#BDC3C7';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(margin, timelineY + timelineHeight / 2);
    ctx.lineTo(margin + chartWidth, timelineY + timelineHeight / 2);
    ctx.stroke();

    // Draw current date indicator
    const currentDate = new Date();
    if (currentDate >= earliestDate && currentDate <= latestDate) {
      const currentX = margin + ((currentDate.getTime() - earliestDate.getTime()) / totalTimeSpan) * chartWidth;
      
      ctx.strokeStyle = '#E74C3C';
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(currentX, timelineY - 10);
      ctx.lineTo(currentX, timelineY + timelineHeight + 10);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#E74C3C';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Today', currentX, timelineY - 15);
    }

    // Draw Dasha segments
    dashas.slice(0, 8).forEach((dasha) => {
      const startDate = new Date(dasha.startDate);
      const endDate = new Date(dasha.endDate);
      
      const startX = margin + ((startDate.getTime() - earliestDate.getTime()) / totalTimeSpan) * chartWidth;
      const endX = margin + ((endDate.getTime() - earliestDate.getTime()) / totalTimeSpan) * chartWidth;
      const segmentWidth = endX - startX;

      if (segmentWidth < 2) return;

      const planetColor = planetColors[dasha.planet] || '#3498DB';
      
      ctx.fillStyle = dasha.isActive ? planetColor : `${planetColor}80`;
      ctx.fillRect(startX, timelineY, segmentWidth, timelineHeight);

      ctx.strokeStyle = dasha.isActive ? '#2C3E50' : '#7F8C8D';
      ctx.lineWidth = dasha.isActive ? 2 : 1;
      ctx.strokeRect(startX, timelineY, segmentWidth, timelineHeight);

      if (segmentWidth > 30) {
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(dasha.planet, startX + segmentWidth / 2, timelineY + timelineHeight / 2 + 4);
      }

      if (segmentWidth > 40) {
        ctx.fillStyle = '#2C3E50';
        ctx.font = '9px Arial';
        ctx.textAlign = 'center';
        const duration = `${dasha.years}y`;
        ctx.fillText(duration, startX + segmentWidth / 2, timelineY + timelineHeight + 15);
      }
    });

    if (onImageGenerated) {
      onImageGenerated(canvas.toDataURL('image/png'));
    }
  };

  useEffect(() => {
    if (dashas && dashas.length > 0) {
      drawTimeline();
    }
  }, [dashas, width, height]);

  return (
    <div className="flex flex-col items-center space-y-4">
      <canvas
        ref={canvasRef}
        className="border border-gray-300 rounded-lg shadow-lg"
        style={{ maxWidth: '100%', height: 'auto' }}
      />
      <p className="text-sm text-gray-600 text-center">
        Dasha Timeline - Visual representation of planetary periods and their timing
      </p>
    </div>
  );
};

export default DashaChart;
