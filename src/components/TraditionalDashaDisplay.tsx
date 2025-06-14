
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  calculateVimshottariDasha, 
  calculateAntardasha,
  formatDashaPeriod,
  getDashaEffects,
  type DetailedDashaResult 
} from '../lib/vimshottariDashaEngine';

interface TraditionalDashaDisplayProps {
  birthDate: Date;
  moonLongitude: number;
  moonNakshatra: number;
  className?: string;
}

export function TraditionalDashaDisplay({ 
  birthDate, 
  moonLongitude, 
  moonNakshatra, 
  className 
}: TraditionalDashaDisplayProps) {
  const dashaResult = calculateVimshottariDasha(birthDate, moonLongitude, moonNakshatra);
  const currentAntardashas = calculateAntardasha(dashaResult.currentMahadasha);
  const currentAntardasha = currentAntardashas.find(a => a.isActive);
  const currentEffects = getDashaEffects(dashaResult.currentMahadasha.planet);

  return (
    <div className={`space-y-6 ${className}`}>
      <Card className="border-2 border-orange-200">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50">
          <CardTitle className="text-2xl text-center text-gray-800 font-bold">
            वर्तमान महादशा - Current Mahadasha
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center items-center space-x-4">
              <Badge variant="default" className="text-lg px-4 py-2 bg-orange-500">
                {dashaResult.currentMahadasha.planet} ({dashaResult.currentMahadasha.planetHindi})
              </Badge>
              {dashaResult.currentMahadasha.isActive && (
                <Badge variant="secondary" className="text-sm">
                  Currently Active
                </Badge>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <div className="text-sm text-gray-600">Start Date</div>
                <div className="font-semibold text-gray-800">
                  {dashaResult.currentMahadasha.startDate.toLocaleDateString()}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600">End Date</div>
                <div className="font-semibold text-gray-800">
                  {dashaResult.currentMahadasha.endDate.toLocaleDateString()}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600">Remaining Period</div>
                <div className="font-semibold text-orange-600">
                  {Math.floor(dashaResult.currentMahadasha.remainingYears || 0)}Y{' '}
                  {Math.floor(((dashaResult.currentMahadasha.remainingYears || 0) % 1) * 12)}M
                </div>
              </div>
            </div>

            {currentAntardasha && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Current Antardasha</h4>
                <div className="text-center">
                  <Badge variant="outline" className="text-blue-700 border-blue-300">
                    {currentAntardasha.planet} ({currentAntardasha.planetHindi})
                  </Badge>
                  <div className="text-sm text-blue-600 mt-2">
                    {currentAntardasha.startDate.toLocaleDateString()} - {currentAntardasha.endDate.toLocaleDateString()}
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-gray-800">
            Calculation Details (Traditional Method)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-semibold text-gray-600">Moon's Nakshatra</div>
              <div className="text-gray-800">{dashaResult.moonNakshatra}</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-600">Nakshatra Lord</div>
              <div className="text-gray-800">{dashaResult.calculationDetails.nakshatraLord}</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-600">Degree in Nakshatra</div>
              <div className="text-gray-800">{dashaResult.moonDegreeInNakshatra.toFixed(4)}°</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-600">Balance at Birth</div>
              <div className="text-gray-800">
                {dashaResult.calculationDetails.balanceAtBirth.toFixed(4)} years
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-gray-800">
            {dashaResult.currentMahadasha.planet} Mahadasha Effects
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-green-700 mb-2">Positive Effects</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                {currentEffects.positive.map((effect, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    {effect}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-red-700 mb-2">Challenges</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                {currentEffects.challenges.map((challenge, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    {challenge}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-700 mb-2">General Focus</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                {currentEffects.general.map((focus, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    {focus}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-gray-800">
            Upcoming Mahadashas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {dashaResult.allMahadashas.slice(0, 8).map((dasha, index) => (
              <div 
                key={index}
                className={`p-3 rounded-lg border ${
                  dasha.isActive 
                    ? 'bg-orange-50 border-orange-200' 
                    : dasha.isCompleted 
                      ? 'bg-gray-50 border-gray-200' 
                      : 'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <Badge 
                      variant={dasha.isActive ? "default" : "outline"}
                      className={dasha.isActive ? "bg-orange-500" : ""}
                    >
                      {dasha.planet}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      {dasha.startDate.getFullYear()} - {dasha.endDate.getFullYear()}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-800">
                      {dasha.totalYears} years
                    </div>
                    {dasha.isActive && dasha.remainingYears && (
                      <div className="text-xs text-orange-600">
                        {Math.floor(dasha.remainingYears)}Y {Math.floor((dasha.remainingYears % 1) * 12)}M left
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
