
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EnhancedKundaliChart, EnhancedPlanetPosition } from '@/lib/enhancedAstronomicalEngine';

interface EnhancedKundaliChartProps {
  chart: EnhancedKundaliChart;
  language?: 'hi' | 'en';
}

const EnhancedKundaliChartComponent: React.FC<EnhancedKundaliChartProps> = ({ chart, language = 'hi' }) => {
  // Planet symbol mapping
  const planetSymbols: Record<string, string> = {
    'SU': '☉', 'MO': '☽', 'MA': '♂', 'ME': '☿',
    'JU': '♃', 'VE': '♀', 'SA': '♄', 'RA': '☊', 'KE': '☋'
  };

  const planetColors: Record<string, string> = {
    'SU': 'planet-symbol-sun',
    'MO': 'planet-symbol-moon', 
    'MA': 'planet-symbol-mars',
    'ME': 'planet-symbol-mercury',
    'JU': 'planet-symbol-jupiter',
    'VE': 'planet-symbol-venus',
    'SA': 'planet-symbol-saturn',
    'RA': 'planet-symbol-rahu',
    'KE': 'planet-symbol-ketu'
  };

  // Create houses array with planets
  const houses = Array.from({ length: 12 }, (_, index) => {
    const houseNumber = index + 1;
    const planetsInHouse = Object.values(chart.planets).filter(planet => planet.house === houseNumber);
    return {
      number: houseNumber,
      planets: planetsInHouse
    };
  });

  const renderPlanetSymbol = (planet: EnhancedPlanetPosition) => {
    const colorClass = planetColors[planet.id] || 'planet-symbol';
    const strengthClass = planet.strengthGrade === 'Excellent' ? 'status-excellent' :
                         planet.strengthGrade === 'Good' ? 'status-good' :
                         planet.strengthGrade === 'Average' ? 'status-average' :
                         planet.strengthGrade === 'Weak' ? 'status-weak' : 'status-very-weak';
    
    return (
      <div key={planet.id} className={`${colorClass} ${strengthClass} relative group`}>
        {planetSymbols[planet.id]}
        {planet.isRetrograde && <span className="absolute -top-1 -right-1 text-xs">R</span>}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
          {language === 'hi' ? planet.name : planet.name} - {planet.strengthGrade}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card className="astro-card">
        <CardHeader>
          <CardTitle className="text-xl font-bold gradient-text text-center">
            {language === 'hi' ? 'जन्म कुंडली चार्ट' : 'Birth Chart'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Diamond-style Kundali Chart */}
          <div className="kundali-chart">
            <div className="grid grid-cols-4 grid-rows-4 h-full w-full gap-1">
              {/* Row 1 */}
              <div className="kundali-house" data-house="12">
                <div className="kundali-house-number">12</div>
                <div className="flex flex-wrap gap-1 justify-center items-center h-full pt-4">
                  {houses[11].planets.map(renderPlanetSymbol)}
                </div>
              </div>
              <div className="kundali-house" data-house="1">
                <div className="kundali-house-number">1</div>
                <div className="flex flex-wrap gap-1 justify-center items-center h-full pt-4">
                  {houses[0].planets.map(renderPlanetSymbol)}
                </div>
              </div>
              <div className="kundali-house" data-house="2">
                <div className="kundali-house-number">2</div>
                <div className="flex flex-wrap gap-1 justify-center items-center h-full pt-4">
                  {houses[1].planets.map(renderPlanetSymbol)}
                </div>
              </div>
              <div className="kundali-house" data-house="3">
                <div className="kundali-house-number">3</div>
                <div className="flex flex-wrap gap-1 justify-center items-center h-full pt-4">
                  {houses[2].planets.map(renderPlanetSymbol)}
                </div>
              </div>

              {/* Row 2 */}
              <div className="kundali-house" data-house="11">
                <div className="kundali-house-number">11</div>
                <div className="flex flex-wrap gap-1 justify-center items-center h-full pt-4">
                  {houses[10].planets.map(renderPlanetSymbol)}
                </div>
              </div>
              <div className="col-span-2 flex items-center justify-center bg-gradient-to-br from-orange-500/10 to-orange-600/5 rounded-xl border border-orange-500/20">
                <div className="text-center">
                  <div className="text-2xl font-bold gradient-text mb-2">
                    {language === 'hi' ? 'कुंडली' : 'Kundali'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {language === 'hi' ? 'लग्न:' : 'Asc:'} {chart.ascendant}
                  </div>
                </div>
              </div>
              <div className="kundali-house" data-house="4">
                <div className="kundali-house-number">4</div>
                <div className="flex flex-wrap gap-1 justify-center items-center h-full pt-4">
                  {houses[3].planets.map(renderPlanetSymbol)}
                </div>
              </div>

              {/* Row 3 */}
              <div className="kundali-house" data-house="10">
                <div className="kundali-house-number">10</div>
                <div className="flex flex-wrap gap-1 justify-center items-center h-full pt-4">
                  {houses[9].planets.map(renderPlanetSymbol)}
                </div>
              </div>
              <div className="kundali-house" data-house="5">
                <div className="kundali-house-number">5</div>
                <div className="flex flex-wrap gap-1 justify-center items-center h-full pt-4">
                  {houses[4].planets.map(renderPlanetSymbol)}
                </div>
              </div>

              {/* Row 4 */}
              <div className="kundali-house" data-house="9">
                <div className="kundali-house-number">9</div>
                <div className="flex flex-wrap gap-1 justify-center items-center h-full pt-4">
                  {houses[8].planets.map(renderPlanetSymbol)}
                </div>
              </div>
              <div className="kundali-house" data-house="8">
                <div className="kundali-house-number">8</div>
                <div className="flex flex-wrap gap-1 justify-center items-center h-full pt-4">
                  {houses[7].planets.map(renderPlanetSymbol)}
                </div>
              </div>
              <div className="kundali-house" data-house="7">
                <div className="kundali-house-number">7</div>
                <div className="flex flex-wrap gap-1 justify-center items-center h-full pt-4">
                  {houses[6].planets.map(renderPlanetSymbol)}
                </div>
              </div>
              <div className="kundali-house" data-house="6">
                <div className="kundali-house-number">6</div>
                <div className="flex flex-wrap gap-1 justify-center items-center h-full pt-4">
                  {houses[5].planets.map(renderPlanetSymbol)}
                </div>
              </div>
            </div>
          </div>

          {/* Chart Legend */}
          <div className="mt-6 grid grid-cols-3 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-semibold text-orange-400">
                {language === 'hi' ? 'ग्रह चिह्न' : 'Planet Symbols'}
              </h4>
              <div className="space-y-1">
                {Object.entries(planetSymbols).slice(0, 3).map(([id, symbol]) => (
                  <div key={id} className="flex items-center gap-2">
                    <span className={planetColors[id]}>{symbol}</span>
                    <span className="text-xs">{chart.planets[id]?.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-orange-400">
                {language === 'hi' ? 'शक्ति स्तर' : 'Strength Levels'}
              </h4>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span>{language === 'hi' ? 'उत्कृष्ट' : 'Excellent'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>{language === 'hi' ? 'अच्छा' : 'Good'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span>{language === 'hi' ? 'साधारण' : 'Average'}</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-orange-400">
                {language === 'hi' ? 'विशेष संकेत' : 'Special Indicators'}
              </h4>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-orange-400">R</span>
                  <span>{language === 'hi' ? 'वक्री' : 'Retrograde'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span>{language === 'hi' ? 'कमजोर' : 'Weak'}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Yogas Summary */}
      {chart.yogaAnalysis.length > 0 && (
        <Card className="astro-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold gradient-text">
              {language === 'hi' ? 'सक्रिय योग' : 'Active Yogas'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {chart.yogaAnalysis.slice(0, 3).map((yoga, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-orange-500/5 border border-orange-500/20">
                  <div>
                    <h4 className="font-medium text-orange-400">{yoga.name}</h4>
                    <p className="text-sm text-muted-foreground">{yoga.description}</p>
                  </div>
                  <Badge variant="outline" className="border-orange-500/30 text-orange-400">
                    {(yoga.strength * 100).toFixed(0)}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedKundaliChartComponent;
