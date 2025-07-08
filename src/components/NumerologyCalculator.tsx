import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { calculateNumerologyProfile, checkCompatibility, NumerologyProfile } from '@/lib/numerologyUtils';
import { calculateBestYears, calculateDetailedPersonalYears, calculateCyclicalAnalysis, BestYearAnalysis, DetailedPersonalYear, CyclicalAnalysis } from '@/lib/enhancedNumerologyUtils';
import CompatibilityChecker from './CompatibilityChecker';
import NumerologyInsights from './NumerologyInsights';
import NumerologyGlossary from './NumerologyGlossary';
import { AlertCircle, Star, Heart, Shield, Gem, BookOpen, Lightbulb, Info, Calendar, TrendingUp, Clock, Zap, Target } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const NumerologyCalculator: React.FC = () => {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [profile, setProfile] = useState<NumerologyProfile | null>(null);
  const [bestYearAnalysis, setBestYearAnalysis] = useState<BestYearAnalysis | null>(null);
  const [personalYears, setPersonalYears] = useState<DetailedPersonalYear[]>([]);
  const [cyclicalAnalysis, setCyclicalAnalysis] = useState<CyclicalAnalysis | null>(null);
  const { t } = useLanguage();

  const handleCalculate = () => {
    if (!name || !birthDate) return;
    const date = new Date(birthDate);
    const birthYear = date.getFullYear();
    const numerologyProfile = calculateNumerologyProfile(name, date);
    
    // Calculate enhanced features
    const bestYears = calculateBestYears(numerologyProfile, birthYear);
    const detailedPersonalYears = calculateDetailedPersonalYears(numerologyProfile, birthYear);
    const cyclical = calculateCyclicalAnalysis(numerologyProfile, birthYear);
    
    setProfile(numerologyProfile);
    setBestYearAnalysis(bestYears);
    setPersonalYears(detailedPersonalYears);
    setCyclicalAnalysis(cyclical);
  };

  const getEnergyColor = (energy: string) => {
    switch (energy) {
      case 'High': return 'text-green-600 bg-green-50';
      case 'Medium': return 'text-yellow-600 bg-yellow-50';
      case 'Low': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-orange-500" />
            {t('advanced_numerology_calculator')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">
                {t('full_name')}
              </Label>
              <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder={t('enter_full_name')} />
            </div>
            <div>
              <Label htmlFor="birthDate">
                {t('birth_date')}
              </Label>
              <Input id="birthDate" type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} />
            </div>
          </div>
          <Button onClick={handleCalculate} className="w-full">
            {t('generate_detailed_analysis')}
          </Button>
        </CardContent>
      </Card>

      {profile && <Tabs defaultValue="insights" className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-9">
            <TabsTrigger value="insights">{t('insights')}</TabsTrigger>
            <TabsTrigger value="core">{t('core')}</TabsTrigger>
            <TabsTrigger value="personality">{t('personality')}</TabsTrigger>
            <TabsTrigger value="best-years">
              <Calendar className="h-4 w-4 md:mr-1" />
              <span className="hidden md:inline">Best Years</span>
            </TabsTrigger>
            <TabsTrigger value="personal-year">
              <Clock className="h-4 w-4 md:mr-1" />
              <span className="hidden md:inline">Personal Years</span>
            </TabsTrigger>
            <TabsTrigger value="cycles">
              <TrendingUp className="h-4 w-4 md:mr-1" />
              <span className="hidden md:inline">Cycles</span>
            </TabsTrigger>
            <TabsTrigger value="karmic">{t('karmic')}</TabsTrigger>
            <TabsTrigger value="remedies">{t('remedies')}</TabsTrigger>
            <TabsTrigger value="compatibility">{t('compatibility')}</TabsTrigger>
          </TabsList>

          <TabsContent value="insights" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-600 flex items-center gap-2 text-base font-bold text-center px-[2px] py-[6px]">
                  <Lightbulb className="h-5 w-5" />
                  {t('personal_guidance_insights')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <NumerologyInsights profile={profile} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="core" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-orange-600">
                  {t('core_numbers')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-3xl font-bold text-orange-600">{profile.lifePath}</div>
                    <div className="text-sm font-medium text-gray-700">
                      {t('life_path')}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {t('your_life_purpose')}
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600">{profile.expression}</div>
                    <div className="text-sm font-medium text-gray-700">
                      {t('expression')}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {t('natural_talents')}
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-pink-50 rounded-lg">
                    <div className="text-3xl font-bold text-pink-600">{profile.soulUrge}</div>
                    <div className="text-sm font-medium text-gray-700">
                      {t('soul_urge')}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {t('inner_motivation')}
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">{profile.personality}</div>
                    <div className="text-sm font-medium text-gray-700">
                      {t('personality')}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {t('outer_image')}
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600">{profile.birthday}</div>
                    <div className="text-sm font-medium text-gray-700">
                      {t('birthday')}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {t('special_gift')}
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-3xl font-bold text-yellow-600">{profile.maturity}</div>
                    <div className="text-sm font-medium text-gray-700">
                      {t('maturity')}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {t('later_life_focus')}
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                      <Shield className="h-5 w-5 text-blue-600" />
                      Your Life Journey Stages 🌟
                    </h4>
                    <p className="text-sm text-blue-700 mb-3">
                      Think of your life like a video game with different levels! Each stage brings new opportunities and adventures.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {profile.pinnacles.map((pinnacle, index) => {
                        const stageNames = ['Childhood & Teen Years', 'Young Adult Life', 'Middle Age Adventures', 'Wisdom Years'];
                        const stageAges = ['Age 0-28', 'Age 29-37', 'Age 38-46', 'Age 47+'];
                        const stageEmojis = ['🧒', '🧑', '👨‍💼', '👴'];
                        return (
                          <div key={index} className="bg-white p-3 rounded border border-blue-100">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-lg">{stageEmojis[index]}</span>
                              <div className="text-2xl font-bold text-blue-600">{pinnacle}</div>
                            </div>
                            <div className="text-sm font-medium text-blue-800">{stageNames[index]}</div>
                            <div className="text-xs text-blue-600">{stageAges[index]}</div>
                            <div className="text-xs text-blue-700 mt-1">
                              {pinnacle === 1 && "Leadership time! You'll learn to be independent and make your own decisions."}
                              {pinnacle === 2 && "Friendship & teamwork phase! Great time for making close friends and learning cooperation."}
                              {pinnacle === 3 && "Creative expression time! Perfect for art, music, writing, and sharing your talents."}
                              {pinnacle === 4 && "Building & organizing phase! Time to work hard and create something lasting."}
                              {pinnacle === 5 && "Adventure & freedom time! Lots of new experiences and exciting changes ahead."}
                              {pinnacle === 6 && "Family & caring phase! You'll focus on helping others and creating harmony."}
                              {pinnacle === 7 && "Learning & discovery time! Perfect for studying, research, and understanding life deeply."}
                              {pinnacle === 8 && "Success & achievement phase! Great time for business, leadership, and material success."}
                              {pinnacle === 9 && "Giving back time! You'll help others and make the world a better place."}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <h4 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-orange-600" />
                      Life Lessons to Master 💪
                    </h4>
                    <p className="text-sm text-orange-700 mb-3">
                      These are like boss battles in your life journey! Don't worry - once you understand them, they become your superpowers.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {profile.challenges.map((challenge, index) => {
                        const challengeNames = ['Early Life Lesson', 'Teen/Young Adult Lesson', 'Life-Long Learning', 'Main Life Challenge'];
                        return (
                          <div key={index} className="bg-white p-3 rounded border border-orange-100">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="text-2xl font-bold text-orange-600">{challenge}</div>
                              <span className="text-lg">🎯</span>
                            </div>
                            <div className="text-sm font-medium text-orange-800">{challengeNames[index]}</div>
                            <div className="text-xs text-orange-700 mt-1">
                              {challenge === 0 && "Learn to be yourself! Don't let others decide who you should be."}
                              {challenge === 1 && "Build confidence! Believe in yourself and take initiative."}
                              {challenge === 2 && "Practice patience! Learn to work well with others and be a good friend."}
                              {challenge === 3 && "Express yourself! Don't hide your talents - share them with the world."}
                              {challenge === 4 && "Stay organized! Learn to plan ahead and work steadily toward your goals."}
                              {challenge === 5 && "Find balance! Enjoy freedom but also learn responsibility."}
                              {challenge === 6 && "Care without overdoing! Help others but don't forget to take care of yourself."}
                              {challenge === 7 && "Trust your inner wisdom! Sometimes the best answers come from within."}
                              {challenge === 8 && "Use power wisely! Success is great, but stay humble and fair."}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <h4 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-purple-600" />
                      Your 2025 Theme 🎨
                    </h4>
                    <div className="flex items-center gap-4">
                      <div className="text-4xl font-bold text-purple-600">{profile.personalYear}</div>
                      <div className="flex-1">
                        <div className="text-sm text-purple-700 mb-2">
                          {profile.personalYear === 1 && "🚀 NEW BEGINNINGS YEAR! Time to start fresh projects and be a leader."}
                          {profile.personalYear === 2 && "🤝 FRIENDSHIP & COOPERATION YEAR! Focus on teamwork and making connections."}
                          {profile.personalYear === 3 && "🎨 CREATIVITY & FUN YEAR! Perfect time for art, music, and expressing yourself."}
                          {profile.personalYear === 4 && "🏗️ BUILDING & HARD WORK YEAR! Time to focus on studies and creating solid foundations."}
                          {profile.personalYear === 5 && "🌟 ADVENTURE & CHANGE YEAR! Expect exciting new experiences and opportunities."}
                          {profile.personalYear === 6 && "❤️ FAMILY & CARING YEAR! Focus on home, family, and helping others."}
                          {profile.personalYear === 7 && "🔍 LEARNING & DISCOVERY YEAR! Great time for studying and understanding yourself better."}
                          {profile.personalYear === 8 && "💼 SUCCESS & ACHIEVEMENT YEAR! Your hard work will pay off with recognition."}
                          {profile.personalYear === 9 && "🌍 COMPLETION & GIVING YEAR! Time to finish projects and help others."}
                        </div>
                        <div className="text-xs text-purple-600">
                          This energy will influence your whole year - use it wisely!
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="personality" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-600 flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  {t('personality_archetype')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-xl font-bold text-blue-800 mb-2">
                    {profile.personalityArchetype.name}
                  </h3>
                  <p className="text-gray-700 mb-4">
                    {profile.personalityArchetype.description}
                  </p>
                  <p className="text-sm text-blue-700 font-medium">
                    {t('life_theme')}: {profile.personalityArchetype.lifeTheme}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">
                      {t('strengths')}
                    </h4>
                    <ul className="space-y-1">
                      {profile.personalityArchetype.strengths.map((strength, index) => <li key={index} className="text-sm text-green-700 flex items-start gap-2">
                          <span className="text-green-500 mt-1">•</span>
                          {strength}
                        </li>)}
                    </ul>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-orange-800 mb-2">
                      {t('shadow_aspects')}
                    </h4>
                    <ul className="space-y-1">
                      {profile.personalityArchetype.shadows.map((shadow, index) => <li key={index} className="text-sm text-orange-700 flex items-start gap-2">
                          <span className="text-orange-500 mt-1">•</span>
                          {shadow}
                        </li>)}
                    </ul>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-2">
                      {t('ideal_careers')}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.personalityArchetype.idealCareers.map((career, index) => <Badge key={index} variant="outline" className="bg-purple-100 text-purple-700">
                          {career}
                        </Badge>)}
                    </div>
                  </div>

                  <div className="bg-pink-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-pink-800 mb-2">
                      {t('relationship_style')}
                    </h4>
                    <p className="text-sm text-pink-700">
                      {profile.personalityArchetype.relationshipStyle}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="best-years" className="space-y-4">
            {bestYearAnalysis && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-600 flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Best Years Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h3 className="font-semibold text-green-800 mb-2">Peak Opportunity Year</h3>
                    <div className="text-3xl font-bold text-green-700 mb-2">{bestYearAnalysis.peakYear}</div>
                    <p className="text-green-700 text-sm">{bestYearAnalysis.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                        <Star className="h-4 w-4" />
                        Favorable Years
                      </h4>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {bestYearAnalysis.bestYears.map((year, index) => (
                          <Badge key={index} className="bg-blue-100 text-blue-800">
                            {year}
                          </Badge>
                        ))}
                      </div>
                      <div className="space-y-2">
                        <h5 className="font-medium text-blue-700">Opportunities:</h5>
                        <ul className="space-y-1">
                          {bestYearAnalysis.opportunities.map((opp, index) => (
                            <li key={index} className="text-sm text-blue-600 flex items-start gap-2">
                              <span className="text-blue-400 mt-1">•</span>
                              {opp}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="bg-orange-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        Challenging Years
                      </h4>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {bestYearAnalysis.challengingYears.map((year, index) => (
                          <Badge key={index} variant="outline" className="bg-orange-100 text-orange-800">
                            {year}
                          </Badge>
                        ))}
                      </div>
                      <div className="space-y-2">
                        <h5 className="font-medium text-orange-700">Guidance:</h5>
                        <ul className="space-y-1">
                          {bestYearAnalysis.warnings.map((warning, index) => (
                            <li key={index} className="text-sm text-orange-600 flex items-start gap-2">
                              <span className="text-orange-400 mt-1">•</span>
                              {warning}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="personal-year" className="space-y-4">
            {personalYears.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-purple-600 flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Personal Year Forecast
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {personalYears.map((yearData, index) => (
                      <div key={index} className={`p-4 rounded-lg border ${
                        yearData.year === new Date().getFullYear() 
                          ? 'bg-purple-50 border-purple-300 border-2' 
                          : 'bg-gray-50 border-gray-200'
                      }`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl font-bold text-purple-700">
                              {yearData.year}
                            </div>
                            <div className="text-lg font-semibold text-purple-600">
                              Personal Year {yearData.personalYear}
                            </div>
                            {yearData.year === new Date().getFullYear() && (
                              <Badge className="bg-purple-500 text-white">Current Year</Badge>
                            )}
                          </div>
                          <Badge className={`${getEnergyColor(yearData.energy)} font-medium`}>
                            <Zap className="h-3 w-3 mr-1" />
                            {yearData.energy} Energy
                          </Badge>
                        </div>

                        <h3 className="font-bold text-purple-800 mb-2">{yearData.theme}</h3>
                        <p className="text-purple-700 mb-4">{yearData.description}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="bg-white p-3 rounded border">
                            <h4 className="font-semibold text-purple-700 mb-2">Career</h4>
                            <p className="text-sm text-purple-600">{yearData.career}</p>
                          </div>
                          
                          <div className="bg-white p-3 rounded border">
                            <h4 className="font-semibold text-purple-700 mb-2">Relationships</h4>
                            <p className="text-sm text-purple-600">{yearData.relationships}</p>
                          </div>
                          
                          <div className="bg-white p-3 rounded border">
                            <h4 className="font-semibold text-purple-700 mb-2">Health</h4>
                            <p className="text-sm text-purple-600">{yearData.health}</p>
                          </div>
                          
                          <div className="bg-white p-3 rounded border">
                            <h4 className="font-semibold text-purple-700 mb-2">Spiritual</h4>
                            <p className="text-sm text-purple-600">{yearData.spiritual}</p>
                          </div>
                        </div>

                        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h4 className="font-semibold text-green-700 mb-2">Key Opportunities</h4>
                            <ul className="space-y-1">
                              {yearData.opportunities.slice(0, 3).map((opp, idx) => (
                                <li key={idx} className="text-sm text-green-600 flex items-start gap-2">
                                  <span className="text-green-400 mt-1">•</span>
                                  {opp}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-orange-700 mb-2">Challenges to Watch</h4>
                            <ul className="space-y-1">
                              {yearData.challenges.slice(0, 3).map((challenge, idx) => (
                                <li key={idx} className="text-sm text-orange-600 flex items-start gap-2">
                                  <span className="text-orange-400 mt-1">•</span>
                                  {challenge}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-blue-700 mb-2">Recommended Focus</h4>
                            <div className="flex flex-wrap gap-1">
                              {yearData.focus.slice(0, 4).map((focus, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs bg-blue-50">
                                  {focus}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="cycles" className="space-y-4">
            {cyclicalAnalysis && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-indigo-600 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Life Cycles & Patterns
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200">
                    <div className="text-center mb-4">
                      <div className="text-4xl font-bold text-indigo-700 mb-2">
                        Year {cyclicalAnalysis.currentCycle}
                      </div>
                      <h3 className="text-xl font-semibold text-indigo-800 mb-2">
                        {cyclicalAnalysis.cyclePhase}
                      </h3>
                      <p className="text-indigo-700">{cyclicalAnalysis.cycleDescription}</p>
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h4 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Next Major Milestone
                    </h4>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-yellow-700">
                          {cyclicalAnalysis.nextMilestone.year}
                        </div>
                        <p className="text-sm text-yellow-600">
                          {cyclicalAnalysis.nextMilestone.significance}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-yellow-700">
                          {cyclicalAnalysis.nextMilestone.year - new Date().getFullYear()} years away
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-3">9-Year Cycle Overview</h4>
                    <div className="grid grid-cols-3 md:grid-cols-9 gap-2">
                      {Array.from({length: 9}, (_, i) => i + 1).map((num) => (
                        <div key={num} className={`p-2 text-center rounded text-sm font-medium ${
                          num === cyclicalAnalysis.currentCycle 
                            ? 'bg-indigo-500 text-white' 
                            : 'bg-white text-gray-600 border'
                        }`}>
                          {num}
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 text-xs text-gray-600 text-center">
                      Your current position in the 9-year numerological cycle
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="karmic" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  {t('karmic_analysis')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.karmicDebt.hasKarmicDebt ? <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <h4 className="font-semibold text-red-800 mb-2">
                      {t('karmic_debt_present')}
                    </h4>
                    <div className="space-y-2">
                      {profile.karmicDebt.debtNumbers.map((debt, index) => <div key={index} className="bg-white p-3 rounded border border-red-100">
                          <div className="font-medium text-red-700">
                            {t('debt_number')}: {debt}
                          </div>
                          <div className="text-sm text-red-600 mt-1">
                            {profile.karmicDebt.descriptions[index]}
                          </div>
                        </div>)}
                    </div>
                  </div> : <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-800">
                      {t('no_major_karmic_debt')}
                    </h4>
                    <p className="text-green-700 text-sm mt-1">
                      {t('clear_karmic_slate')}
                    </p>
                  </div>}

                {profile.missingNumbers.length > 0 && <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h4 className="font-semibold text-yellow-800 mb-2">
                      {t('missing_numbers')}
                    </h4>
                    <p className="text-sm text-yellow-700 mb-3">
                      {t('missing_numbers_description')}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {profile.missingNumbers.map((num, index) => <Badge key={index} variant="outline" className="bg-yellow-100 text-yellow-800">
                          {num}
                        </Badge>)}
                    </div>
                  </div>}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="remedies" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600 flex items-center gap-2">
                  <Gem className="h-5 w-5" />
                  {t('personalized_remedies')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {profile.remedies.length > 0 ? <div className="space-y-4">
                    {profile.remedies.map((remedy, index) => <div key={index} className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <div className="flex items-start gap-3">
                          <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                            {remedy.number}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-green-800 mb-1">
                              {t('number')} {remedy.number} {t('deficiency')}
                            </h4>
                            <p className="text-sm text-green-700 mb-3">{remedy.deficiency}</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h5 className="font-medium text-green-800 mb-1">
                                  {t('remedies')}:
                                </h5>
                                <ul className="text-sm text-green-700">
                                  {remedy.remedies.map((r, i) => <li key={i} className="flex items-start gap-1">
                                      <span className="text-green-500 mt-1">•</span>
                                      {r}
                                    </li>)}
                                </ul>
                              </div>
                              
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <BookOpen className="h-4 w-4 text-green-600" />
                                  <span className="text-sm font-medium text-green-800">
                                    {t('mantra')}:
                                  </span>
                                  <code className="text-xs bg-green-100 px-2 py-1 rounded">
                                    {remedy.mantra}
                                  </code>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Gem className="h-4 w-4 text-green-600" />
                                  <span className="text-sm font-medium text-green-800">
                                    {t('gemstone')}:
                                  </span>
                                  <Badge variant="outline" className="bg-green-100">
                                    {remedy.gemstone}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 rounded border" style={{
                            backgroundColor: remedy.color.toLowerCase()
                          }}></div>
                                  <span className="text-sm font-medium text-green-800">
                                    {t('color')}:
                                  </span>
                                  <span className="text-sm text-green-700">{remedy.color}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>)}
                  </div> : <div className="text-center py-8">
                    <div className="text-gray-500">
                      {t('no_specific_remedies')}
                    </div>
                    <p className="text-sm text-gray-400 mt-2">
                      {t('well_balanced_structure')}
                    </p>
                  </div>}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compatibility" className="space-y-4">
            <CompatibilityChecker currentProfile={profile} currentName={name} />
          </TabsContent>

          <TabsContent value="glossary" className="space-y-4">
            <NumerologyGlossary />
          </TabsContent>
        </Tabs>}
    </div>;
};
export default NumerologyCalculator;
