
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { getPlanetDetails } from '@/lib/kundaliUtils';

interface Planet {
  id: string;
  name: string;
  house: number;
  rashi: number;
  degree: number;
  degreeInSign: number;
  rashiName: string;
  nakshatraName: string;
  nakshatraPada: number;
  isExalted?: boolean;
  isDebilitated?: boolean;
  ownSign?: boolean;
  isRetrograde?: boolean;
}

interface InteractiveKundaliChartProps {
  planets: Planet[];
  ascendant: number;
  language?: 'hi' | 'en';
}

const InteractiveKundaliChart: React.FC<InteractiveKundaliChartProps> = ({
  planets,
  ascendant,
  language = 'en'
}) => {
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
  const [hoveredPlanet, setHoveredPlanet] = useState<Planet | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const chartRef = useRef<HTMLDivElement>(null);

  const getTranslation = (en: string, hi: string) => {
    return language === 'hi' ? hi : en;
  };

  // Create houses array with planets
  const houses = Array.from({ length: 12 }, (_, index) => {
    const houseNumber = index + 1;
    const planetsInHouse = planets.filter(planet => planet.house === houseNumber);
    return {
      number: houseNumber,
      planets: planetsInHouse
    };
  });

  // Calculate house position based on ascendant
  const getHousePosition = (houseNumber: number) => {
    const adjustedHouse = ((houseNumber - ascendant + 12) % 12) || 12;
    return adjustedHouse;
  };

  // Handle zoom
  const handleZoom = (direction: 'in' | 'out') => {
    setZoomLevel(prev => {
      const newZoom = direction === 'in' ? prev * 1.2 : prev / 1.2;
      return Math.max(0.5, Math.min(3, newZoom));
    });
  };

  // Handle drag
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) { // Left click only
      setIsDragging(true);
      setDragStart({ x: e.clientX - translate.x, y: e.clientY - translate.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setTranslate({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Reset view
  const resetView = () => {
    setZoomLevel(1);
    setTranslate({ x: 0, y: 0 });
  };

  // Handle planet click
  const handlePlanetClick = (planet: Planet) => {
    setSelectedPlanet(selectedPlanet?.id === planet.id ? null : planet);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Controls */}
      <div className="flex justify-center gap-2 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleZoom('in')}
          className="flex items-center gap-1"
        >
          <ZoomIn className="h-4 w-4" />
          {getTranslation('Zoom In', 'ज़ूम इन')}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleZoom('out')}
          className="flex items-center gap-1"
        >
          <ZoomOut className="h-4 w-4" />
          {getTranslation('Zoom Out', 'ज़ूम आउट')}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={resetView}
          className="flex items-center gap-1"
        >
          <RotateCcw className="h-4 w-4" />
          {getTranslation('Reset', 'रीसेट')}
        </Button>
      </div>

      <Card className="border-orange-200 dark:border-orange-700 shadow-lg overflow-hidden">
        <CardHeader className="p-3 sm:p-4 lg:p-6 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/30 dark:to-red-900/30">
          <CardTitle className="text-center text-base sm:text-lg lg:text-xl text-orange-800 dark:text-orange-300">
            {getTranslation('Interactive Kundali Chart', 'इंटरैक्टिव कुंडली चार्ट')}
          </CardTitle>
          <p className="text-center text-sm text-orange-600 dark:text-orange-400">
            {getTranslation('Click planets for details • Drag to pan • Use zoom controls', 'विवरण के लिए ग्रहों पर क्लिक करें • खींचने के लिए ड्रैग करें • ज़ूम नियंत्रण का उपयोग करें')}
          </p>
        </CardHeader>
        
        <CardContent 
          className="p-3 sm:p-4 lg:p-6 overflow-hidden cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div className="relative w-full max-w-lg mx-auto">
            {/* Chart container with zoom and pan */}
            <div 
              ref={chartRef}
              className="aspect-square border-2 border-orange-500 dark:border-orange-400 relative bg-white dark:bg-gray-800 rounded-lg overflow-hidden"
              style={{
                transform: `scale(${zoomLevel}) translate(${translate.x / zoomLevel}px, ${translate.y / zoomLevel}px)`,
                transformOrigin: 'center center',
                transition: isDragging ? 'none' : 'transform 0.2s ease-out'
              }}
            >
              {/* Main grid - 4x4 */}
              <div className="grid grid-cols-4 grid-rows-4 h-full gap-0">
                {Array.from({ length: 16 }, (_, index) => {
                  const row = Math.floor(index / 4);
                  const col = index % 4;
                  
                  // Define house positions
                  const housePositions = [
                    { row: 0, col: 1, house: 12 }, { row: 0, col: 2, house: 1 }, { row: 0, col: 3, house: 2 }, { row: 0, col: 0, house: 3 },
                    { row: 1, col: 0, house: 11 }, { row: 1, col: 1, house: -1 }, { row: 1, col: 2, house: -1 }, { row: 1, col: 3, house: 4 },
                    { row: 2, col: 0, house: 10 }, { row: 2, col: 1, house: -1 }, { row: 2, col: 2, house: -1 }, { row: 2, col: 3, house: 5 },
                    { row: 3, col: 0, house: 9 }, { row: 3, col: 1, house: 8 }, { row: 3, col: 2, house: 7 }, { row: 3, col: 3, house: 6 }
                  ];
                  
                  const position = housePositions.find(pos => pos.row === row && pos.col === col);
                  
                  // Center cells
                  if (!position || position.house === -1) {
                    return (
                      <div 
                        key={index} 
                        className="w-full h-full bg-gradient-to-br from-orange-100 to-yellow-100 dark:from-orange-800/30 dark:to-yellow-800/30 border border-orange-300 dark:border-orange-600 flex items-center justify-center"
                      >
                        {row === 1 && col === 1 && (
                          <div className="text-center">
                            <div className="text-sm font-bold text-orange-800 dark:text-orange-300">
                              {getTranslation('Birth', 'जन्म')}
                            </div>
                            <div className="text-xs text-orange-600 dark:text-orange-400">
                              {getTranslation('Chart', 'चार्ट')}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  }

                  const house = houses[position.house - 1];
                  const displayHouseNumber = getHousePosition(position.house);
                  
                  return (
                    <div 
                      key={index}
                      className="w-full h-full border border-gray-300 dark:border-gray-600 p-1 bg-orange-50 dark:bg-orange-900/20 flex flex-col items-center justify-center relative hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
                    >
                      {/* House number */}
                      <div className="absolute -top-1 -left-1 w-5 h-5 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold z-10">
                        {displayHouseNumber}
                      </div>
                      
                      {/* Planets in house */}
                      <div className="flex flex-wrap justify-center gap-1 mt-2">
                        {house.planets.map((planet, planetIndex) => {
                          const planetDetails = getPlanetDetails(planet.id);
                          const isSelected = selectedPlanet?.id === planet.id;
                          const isHovered = hoveredPlanet?.id === planet.id;
                          
                          return (
                            <div
                              key={planetIndex}
                              className={`
                                relative cursor-pointer text-lg transition-all duration-200 
                                ${isSelected ? 'scale-125 text-purple-800 font-bold' : 'text-purple-600 dark:text-purple-400'}
                                ${isHovered ? 'scale-110' : ''}
                                hover:scale-110 hover:text-purple-800 dark:hover:text-purple-200
                              `}
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePlanetClick(planet);
                              }}
                              onMouseEnter={() => setHoveredPlanet(planet)}
                              onMouseLeave={() => setHoveredPlanet(null)}
                              title={`${planetDetails?.name} - ${planet.degreeInSign.toFixed(1)}°`}
                            >
                              {planetDetails?.symbol}
                              {planet.isRetrograde && (
                                <span className="absolute -top-1 -right-1 text-xs text-red-500">R</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Hover tooltip */}
            {hoveredPlanet && (
              <div className="absolute top-4 left-4 bg-black/80 text-white p-2 rounded-lg text-xs z-50 pointer-events-none">
                <div className="font-bold">{hoveredPlanet.name}</div>
                <div>{getTranslation('House', 'भाव')}: {hoveredPlanet.house}</div>
                <div>{getTranslation('Sign', 'राशि')}: {hoveredPlanet.rashiName}</div>
                <div>{getTranslation('Degree', 'अंश')}: {hoveredPlanet.degreeInSign.toFixed(2)}°</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Planet Details Panel */}
      {selectedPlanet && (
        <Card className="border-purple-200 dark:border-purple-700 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30">
            <CardTitle className="text-purple-800 dark:text-purple-300 flex items-center gap-2">
              <span className="text-xl">{getPlanetDetails(selectedPlanet.id)?.symbol}</span>
              {selectedPlanet.name} {getTranslation('Details', 'विवरण')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">{getTranslation('House', 'भाव')}:</span>
                  <span>{selectedPlanet.house}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">{getTranslation('Sign', 'राशि')}:</span>
                  <span>{selectedPlanet.rashiName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">{getTranslation('Degree', 'अंश')}:</span>
                  <span>{selectedPlanet.degreeInSign.toFixed(2)}°</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">{getTranslation('Nakshatra', 'नक्षत्र')}:</span>
                  <span>{selectedPlanet.nakshatraName} ({getTranslation('Pada', 'पद')} {selectedPlanet.nakshatraPada})</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {selectedPlanet.isExalted && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                      {getTranslation('Exalted', 'उच्च')}
                    </span>
                  )}
                  {selectedPlanet.isDebilitated && (
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
                      {getTranslation('Debilitated', 'नीच')}
                    </span>
                  )}
                  {selectedPlanet.ownSign && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                      {getTranslation('Own Sign', 'स्व राशि')}
                    </span>
                  )}
                  {selectedPlanet.isRetrograde && (
                    <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs">
                      {getTranslation('Retrograde', 'वक्री')}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setSelectedPlanet(null)}
              className="mt-4 w-full"
            >
              {getTranslation('Close Details', 'विवरण बंद करें')}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700">
        <CardContent className="p-4">
          <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
            {getTranslation('How to use Interactive Chart', 'इंटरैक्टिव चार्ट का उपयोग कैसे करें')}
          </h3>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>• {getTranslation('Click on any planet symbol to see detailed information', 'विस्तृत जानकारी देखने के लिए किसी भी ग्रह चिह्न पर क्लिक करें')}</li>
            <li>• {getTranslation('Hover over planets to see quick info', 'त्वरित जानकारी देखने के लिए ग्रहों पर होवर करें')}</li>
            <li>• {getTranslation('Use zoom controls for better viewing on mobile', 'मोबाइल पर बेहतर देखने के लिए ज़ूम नियंत्रण का उपयोग करें')}</li>
            <li>• {getTranslation('Drag the chart to pan around when zoomed in', 'ज़ूम इन करने पर चार्ट को घुमाने के लिए ड्रैग करें')}</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default InteractiveKundaliChart;
