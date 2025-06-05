
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Star, Crown, Shield, Zap, Target, Heart } from "lucide-react";
import { KundaliData } from '@/lib/advancedKundaliEngine';

interface DetailedKundaliDisplayProps {
  kundaliData: KundaliData;
}

const DetailedKundaliDisplay: React.FC<DetailedKundaliDisplayProps> = ({ kundaliData }) => {
  // Find strongest planet
  const findStrongestPlanet = () => {
    let strongest = { name: '', strength: 0 };
    kundaliData.planets.forEach((planet) => {
      if (planet.shadbala && planet.shadbala > strongest.strength) {
        strongest = { name: planet.name, strength: planet.shadbala };
      }
    });
    return strongest;
  };

  const strongestPlanet = findStrongestPlanet();
  const moonSign = kundaliData.planets.find(p => p.name === 'Moon')?.sign || 'Unknown';
  const sunSign = kundaliData.planets.find(p => p.name === 'Sun')?.sign || 'Unknown';

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {/* Enhanced Header with Personal Information */}
      <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-gray-800 flex items-center justify-center gap-2">
            <Crown className="h-6 w-6 text-orange-600" />
            Complete Vedic Kundali Analysis
          </CardTitle>
          <div className="text-center text-gray-600">
            <p className="text-lg font-semibold">{kundaliData.personalInfo.fullName}</p>
            <p>Born: {kundaliData.personalInfo.date.toLocaleDateString()} at {kundaliData.personalInfo.time}</p>
            <p>Place: {kundaliData.personalInfo.place}</p>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-8 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="planets">Planets</TabsTrigger>
          <TabsTrigger value="houses">Houses</TabsTrigger>
          <TabsTrigger value="yogas">Yogas</TabsTrigger>
          <TabsTrigger value="dashas">Dashas</TabsTrigger>
          <TabsTrigger value="predictions">Life Phases</TabsTrigger>
          <TabsTrigger value="remedies">Remedies</TabsTrigger>
          <TabsTrigger value="personality">Personality</TabsTrigger>
        </TabsList>

        {/* Enhanced Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Core Chart Information */}
            <Card className="border-orange-200">
              <CardHeader>
                <CardTitle className="text-orange-600 flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Core Chart Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <h4 className="font-semibold text-orange-800 mb-1">Lagna (Ascendant)</h4>
                    <p className="text-orange-600 font-medium">{kundaliData.lagna.sign}</p>
                    <p className="text-sm text-gray-600">{kundaliData.lagna.degree.toFixed(2)}°</p>
                  </div>
                  
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-1">Moon Sign (Rashi)</h4>
                    <p className="text-blue-600 font-medium">{moonSign}</p>
                    <p className="text-sm text-gray-600">Mind & Emotions</p>
                  </div>
                  
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <h4 className="font-semibold text-yellow-800 mb-1">Sun Sign</h4>
                    <p className="text-yellow-600 font-medium">{sunSign}</p>
                    <p className="text-sm text-gray-600">Soul & Ego</p>
                  </div>
                  
                  <div className="p-3 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-1">Strongest Planet</h4>
                    <p className="text-green-600 font-medium">{strongestPlanet.name}</p>
                    <p className="text-sm text-gray-600">{strongestPlanet.strength.toFixed(1)}% strength</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Chart Summary */}
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-600 flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Chart Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Total Planets:</span>
                  <Badge variant="outline">{kundaliData.planets.length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Active Yogas:</span>
                  <Badge className="bg-green-100 text-green-800">
                    {kundaliData.yogas.filter(y => y.isPresent).length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Current Dasha:</span>
                  <Badge className="bg-purple-100 text-purple-800">
                    {kundaliData.dashas.find(d => d.isActive)?.planet || 'Not specified'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Lagna Lord:</span>
                  <Badge variant="secondary">{kundaliData.lagna.lord}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Key Strengths & Challenges */}
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="text-green-600 flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Key Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {kundaliData.personality.strengths.slice(0, 4).map((strength, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">{strength}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Areas for Growth */}
            <Card className="border-yellow-200">
              <CardHeader>
                <CardTitle className="text-yellow-600 flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Areas for Growth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {kundaliData.personality.weaknesses.slice(0, 4).map((weakness, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">{weakness}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Life Path Insights */}
            <Card className="border-purple-200 lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-purple-600 flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Life Path Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-2">Career & Finance</h4>
                    <p className="text-sm text-gray-700">
                      {kundaliData.predictions.ageGroups['15-30'].career[0] || 'Focus on skill development and networking opportunities.'}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-pink-50 rounded-lg">
                    <h4 className="font-semibold text-pink-800 mb-2">Relationships</h4>
                    <p className="text-sm text-gray-700">
                      {kundaliData.predictions.ageGroups['15-30'].relationships[0] || 'Strong potential for meaningful connections and partnerships.'}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-indigo-50 rounded-lg">
                    <h4 className="font-semibold text-indigo-800 mb-2">Health & Wellness</h4>
                    <p className="text-sm text-gray-700">
                      {kundaliData.predictions.ageGroups['15-30'].health[0] || 'Maintain regular exercise and balanced nutrition for optimal health.'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Planets Tab */}
        <TabsContent value="planets">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {kundaliData.planets.map((planet) => (
              <Card key={planet.name} className="border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>{planet.name}</span>
                    {planet.isRetrograde && (
                      <Badge variant="secondary" className="text-xs">Retrograde</Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <strong>Sign:</strong> {planet.sign}
                    </div>
                    <div>
                      <strong>House:</strong> {planet.house}
                    </div>
                    <div>
                      <strong>Degree:</strong> {planet.degree.toFixed(2)}°
                    </div>
                    {planet.shadbala && (
                      <div>
                        <strong>Strength:</strong> {planet.shadbala}/100
                      </div>
                    )}
                  </div>
                  
                  {planet.sanskrit && (
                    <p className="text-sm text-gray-600">
                      <strong>Sanskrit:</strong> {planet.sanskrit}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    {planet.shadbala && planet.shadbala > 70 && (
                      <Badge variant="default" className="text-xs">Strong</Badge>
                    )}
                    {planet.strengthGrade && (
                      <Badge variant="outline" className="text-xs">{planet.strengthGrade}</Badge>
                    )}
                  </div>
                  
                  <div className="space-y-1 mt-2">
                    {planet.isExalted && (
                      <div className="text-xs text-green-600">✓ Exalted</div>
                    )}
                    {planet.isDebilitated && (
                      <div className="text-xs text-red-600">⚠ Debilitated</div>
                    )}
                    {planet.isOwnSign && (
                      <div className="text-xs text-blue-600">⭐ Own Sign</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Houses Tab */}
        <TabsContent value="houses">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {kundaliData.houses.map((house) => (
              <Card key={house.number} className="border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">
                    House {house.number}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-1 text-sm">
                    <div><strong>Sign:</strong> {house.sign}</div>
                    <div><strong>Lord:</strong> {house.lord}</div>
                    <div><strong>Cusp:</strong> {house.cusp.toFixed(2)}°</div>
                  </div>
                  {house.significance.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700">Significance:</p>
                      <ul className="text-xs text-gray-600 mt-1">
                        {house.significance.map((sig, index) => (
                          <li key={index}>• {sig}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Yogas Tab */}
        <TabsContent value="yogas">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {kundaliData.yogas.map((yoga, index) => (
              <Card key={index} className={`border-gray-200 ${yoga.isPresent ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>{yoga.name}</span>
                    <Badge variant={yoga.isPresent ? "default" : "secondary"}>
                      {yoga.isPresent ? 'Present' : 'Absent'}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-gray-700">{yoga.description}</p>
                  <p className="text-sm"><strong>Effects:</strong> {yoga.effects}</p>
                  <div className="flex items-center gap-2">
                    <strong className="text-sm">Strength:</strong>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-orange-500 h-2 rounded-full" 
                        style={{ width: `${yoga.strength}%` }}
                      ></div>
                    </div>
                    <span className="text-sm">{yoga.strength}%</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Dashas Tab */}
        <TabsContent value="dashas">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-orange-600">Vimshottari Dasha Periods</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {kundaliData.dashas.map((dasha, index) => (
                    <div 
                      key={index} 
                      className={`p-4 rounded-lg border ${dasha.isActive ? 'bg-orange-50 border-orange-200' : 'bg-gray-50 border-gray-200'}`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-lg">{dasha.planet} Dasha</h4>
                          <p className="text-sm text-gray-600">
                            {dasha.startDate.toLocaleDateString()} - {dasha.endDate.toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{dasha.years} years</p>
                          {dasha.isActive && (
                            <Badge className="mt-1">Currently Active</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Life Phases Predictions Tab */}
        <TabsContent value="predictions">
          <div className="space-y-6">
            {Object.entries(kundaliData.predictions.ageGroups).map(([ageGroup, data]) => (
              <Card key={ageGroup} className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-xl text-orange-600">
                    Age {ageGroup}: {data.period}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">General Trends</h4>
                      <ul className="text-sm space-y-1">
                        {data.generalTrends.map((trend, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-orange-500 mt-1">•</span>
                            <span>{trend}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Career & Finance</h4>
                      <ul className="text-sm space-y-1">
                        {[...data.career, ...data.finance].map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Relationships</h4>
                      <ul className="text-sm space-y-1">
                        {data.relationships.map((rel, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-pink-500 mt-1">•</span>
                            <span>{rel}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Health & Remedies</h4>
                      <ul className="text-sm space-y-1">
                        {[...data.health, ...data.remedies].map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Remedies Tab */}
        <TabsContent value="remedies">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-orange-600">Gemstones</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {kundaliData.remedies.gemstones.map((gem, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-orange-500 mt-1">💎</span>
                      <span className="text-sm">{gem}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-orange-600">Mantras</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {kundaliData.remedies.mantras.map((mantra, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-orange-500 mt-1">🕉️</span>
                      <span className="text-sm font-mono">{mantra}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-orange-600">Charity & Donations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {kundaliData.remedies.charity.map((charity, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-orange-500 mt-1">🤲</span>
                      <span className="text-sm">{charity}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-orange-600">Rituals & Practices</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {kundaliData.remedies.rituals.map((ritual, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-orange-500 mt-1">🙏</span>
                      <span className="text-sm">{ritual}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Personality Tab */}
        <TabsContent value="personality">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-orange-600">Key Traits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {kundaliData.personality.traits.map((trait, index) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {trait}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">Strengths</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {kundaliData.personality.strengths.map((strength, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <span className="text-green-500">✓</span>
                      {strength}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Areas for Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {kundaliData.personality.weaknesses.map((weakness, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <span className="text-red-500">⚠</span>
                      {weakness}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm"><strong>Temperament:</strong> {kundaliData.personality.temperament}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DetailedKundaliDisplay;
