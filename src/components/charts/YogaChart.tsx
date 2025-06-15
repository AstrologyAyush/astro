
import React, { useEffect, useRef } from "react";
import { ChartRenderer, strengthColors } from "../../lib/chartDrawingUtils";

interface YogaChartProps {
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

const YogaChart: React.FC<YogaChartProps> = ({
  yogas,
  onImageGenerated,
  width = 600,
  height = 70,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawYogaChart = () => {
    const canvas = canvasRef.current;
    if (!canvas || !yogas || yogas.length === 0) return;

    canvas.width = width;
    canvas.height = Math.max(80, yogas.length * 35);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const renderer = new ChartRenderer(ctx, { width, height: canvas.height, margin: 32 });

    // Clear canvas
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, width, canvas.height);

    // Title
    ctx.font = "bold 17px Arial";
    ctx.fillStyle = "#5B2C6F";
    ctx.textAlign = "left";
    ctx.fillText("Yoga Strength Indicators", 18, 26);

    // Draw yoga bars
    const startY = 40;
    yogas.slice(0, 5).forEach((yoga, i) => {
      const barY = startY + i * 30;
      
      // Background bar
      ctx.fillStyle = "#ECF0F1";
      ctx.fillRect(32, barY, 380, 16);

      // Strength bar
      const colorEntry = strengthColors.find(c => yoga.strength >= c.min) || strengthColors[strengthColors.length - 1];
      ctx.fillStyle = colorEntry.color;
      ctx.fillRect(32, barY, (yoga.strength / 100) * 380, 16);

      // Labels
      ctx.font = "bold 11px Arial";
      ctx.fillStyle = "#222";
      ctx.fillText(`${yoga.name}${yoga.sanskritName ? ` (${yoga.sanskritName})` : ""}`, 440, barY + 14);

      ctx.font = "bold 12px Arial";
      ctx.fillStyle = colorEntry.color;
      ctx.fillText(`${Math.round(yoga.strength)}%`, 420, barY + 14);
    });

    // Legend
    let lx = 32, ly = canvas.height - 18;
    strengthColors.forEach((c, idx) => {
      ctx.fillStyle = c.color;
      ctx.fillRect(lx, ly, 16, 12);
      ctx.fillStyle = "#222";
      ctx.font = "10px Arial";
      ctx.fillText(c.label, lx + 20, ly + 10);
      lx += 70;
    });

    if (onImageGenerated) {
      onImageGenerated(canvas.toDataURL("image/png"));
    }
  };

  useEffect(() => {
    drawYogaChart();
  }, [yogas, width, height]);

  return (
    <div className="flex flex-col items-center">
      <canvas ref={canvasRef} style={{ maxWidth: "100%" }} />
      <p className="text-xs text-gray-600 mt-1">Visual summary of major yogas detected</p>
    </div>
  );
};

export default YogaChart;
