
import React, { useRef, useEffect } from 'react';

interface DashaTimelineChartProps {
  dashas: any[];
  onImageGenerated?: (imageDataUrl: string) => void;
  width?: number;
  height?: number;
}

const DashaTimelineChart: React.FC<DashaTimelineChartProps> = ({
  dashas,
  onImageGenerated,
  width = 700,
  height = 300
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Planet colors for visual consistency
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

  const drawDashaTimeline = () => {
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
    const margin = 50;
    const chartWidth = width - 2 * margin;
    const chartHeight = height - 2 * margin;
    const timelineY = margin + 50;
    const timelineHeight = 40;

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

    // Find the earliest and latest dates for scaling
    let earliestDate = new Date(Math.min(...dashas.map(d => new Date(d.startDate).getTime())));
    let latestDate = new Date(Math.max(...dashas.map(d => new Date(d.endDate).getTime())));
    
    // Add some padding to the timeline
    const timePadding = (latestDate.getTime() - earliestDate.getTime()) * 0.05;
    earliestDate = new Date(earliestDate.getTime() - timePadding);
    latestDate = new Date(latestDate.getTime() + timePadding);

    const totalTimeSpan = latestDate.getTime() - earliestDate.getTime();

    // Draw main timeline base
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
      
      // Current date line
      ctx.strokeStyle = '#E74C3C';
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(currentX, timelineY - 10);
      ctx.lineTo(currentX, timelineY + timelineHeight + 10);
      ctx.stroke();
      ctx.setLineDash([]);

      // Current date label
      ctx.fillStyle = '#E74C3C';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Today', currentX, timelineY - 15);
    }

    // Draw Dasha periods
    dashas.slice(0, 8).forEach((dasha, index) => {
      const startDate = new Date(dasha.startDate);
      const endDate = new Date(dasha.endDate);
      
      const startX = margin + ((startDate.getTime() - earliestDate.getTime()) / totalTimeSpan) * chartWidth;
      const endX = margin + ((endDate.getTime() - earliestDate.getTime()) / totalTimeSpan) * chartWidth;
      const segmentWidth = endX - startX;

      // Skip if segment is too small to be visible
      if (segmentWidth < 2) return;

      // Get planet color
      const planetColor = planetColors[dasha.planet] || '#3498DB';
      
      // Draw Dasha segment
      ctx.fillStyle = dasha.isActive ? planetColor : `${planetColor}80`; // Semi-transparent if not active
      ctx.fillRect(startX, timelineY, segmentWidth, timelineHeight);

      // Add border
      ctx.strokeStyle = dasha.isActive ? '#2C3E50' : '#7F8C8D';
      ctx.lineWidth = dasha.isActive ? 2 : 1;
      ctx.strokeRect(startX, timelineY, segmentWidth, timelineHeight);

      // Add planet label if segment is wide enough
      if (segmentWidth > 30) {
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(dasha.planet, startX + segmentWidth / 2, timelineY + timelineHeight / 2 + 4);
      }

      // Add duration below if space allows
      if (segmentWidth > 40) {
        ctx.fillStyle = '#2C3E50';
        ctx.font = '9px Arial';
        ctx.textAlign = 'center';
        const duration = `${dasha.years}y`;
        ctx.fillText(duration, startX + segmentWidth / 2, timelineY + timelineHeight + 15);
      }
    });

    // Add year markers
    const currentYear = new Date().getFullYear();
    for (let year = currentYear - 10; year <= currentYear + 20; year += 5) {
      const yearDate = new Date(year, 0, 1);
      if (yearDate >= earliestDate && yearDate <= latestDate) {
        const yearX = margin + ((yearDate.getTime() - earliestDate.getTime()) / totalTimeSpan) * chartWidth;
        
        // Year tick mark
        ctx.strokeStyle = '#95A5A6';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(yearX, timelineY + timelineHeight);
        ctx.lineTo(yearX, timelineY + timelineHeight + 5);
        ctx.stroke();

        // Year label
        ctx.fillStyle = '#7F8C8D';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(year.toString(), yearX, timelineY + timelineHeight + 20);
      }
    }

    // Legend
    const legendY = height - 40;
    ctx.fillStyle = '#2C3E50';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Legend:', margin, legendY);

    // Active period indicator
    ctx.fillStyle = '#27AE60';
    ctx.fillRect(margin + 60, legendY - 8, 15, 10);
    ctx.fillStyle = '#2C3E50';
    ctx.font = '10px Arial';
    ctx.fillText('Active Period', margin + 80, legendY);

    // Future period indicator
    ctx.fillStyle = '#3498DB80';
    ctx.fillRect(margin + 170, legendY - 8, 15, 10);
    ctx.fillStyle = '#2C3E50';
    ctx.fillText('Future Period', margin + 190, legendY);

    // Current time indicator
    ctx.strokeStyle = '#E74C3C';
    ctx.lineWidth = 2;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(margin + 280, legendY - 3);
    ctx.lineTo(margin + 295, legendY - 3);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#2C3E50';
    ctx.fillText('Current Time', margin + 300, legendY);

    // Generate image data URL and call callback
    if (onImageGenerated) {
      const imageDataUrl = canvas.toDataURL('image/png');
      onImageGenerated(imageDataUrl);
    }
  };

  useEffect(() => {
    if (dashas && dashas.length > 0) {
      drawDashaTimeline();
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

export default DashaTimelineChart;
