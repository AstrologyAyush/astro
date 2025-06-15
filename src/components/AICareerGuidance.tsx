
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Target, Briefcase, TrendingUp, DollarSign, Building, Users, Lightbulb, Award } from "lucide-react";

interface AICareerGuidanceProps {
  kundaliData: any;
  language: 'hi' | 'en';
}

const AICareerGuidance: React.FC<AICareerGuidanceProps> = ({ 
  kundaliData, 
  language 
}) => {
  const [activeTab, setActiveTab] = useState('ideal-careers');
  const [isGenerating, setIsGenerating] = useState(false);

  const getTranslation = (en: string, hi: string) => {
    return language === 'hi' ? hi : en;
  };

  const careerGuidance = {
    idealCareers: {
      primary: [
        {
          field: getTranslation('Technology & Innovation', 'प्रौद्योगिकी और नवाचार'),
          careers: getTranslation('Software Engineer, Data Scientist, AI Researcher, Cybersecurity Expert', 'सॉफ्टवेयर इंजीनियर, डेटा साइंटिस्ट, AI रिसर्चर, साइबर सिक्यूरिटी एक्सपर्ट'),
          suitability: '95%',
          reasoning: getTranslation('Strong Mercury-Jupiter combination indicates analytical mind and innovative thinking', 'मजबूत बुध-बृहस्पति संयोजन विश्लेषणात्मक मन और नवाचार सोच को दर्शाता है')
        },
        {
          field: getTranslation('Healthcare & Medicine', 'स्वास्थ्य सेवा और चिकित्सा'),
          careers: getTranslation('Doctor, Surgeon, Medical Researcher, Healthcare Administrator', 'डॉक्टर, सर्जन, मेडिकल रिसर्चर, हेल्थकेयर एडमिनिस्ट्रेटर'),
          suitability: '88%',
          reasoning: getTranslation('Mars-Sun aspect provides healing abilities and service orientation', 'मंगल-सूर्य दृष्टि उपचार क्षमता और सेवा भावना प्रदान करती है')
        },
        {
          field: getTranslation('Finance & Investment', 'वित्त और निवेश'),
          careers: getTranslation('Investment Banker, Financial Analyst, Portfolio Manager, Chartered Accountant', 'निवेश बैंकर, वित्तीय विश्लेषक, पोर्टफोलियो मैनेजर, चार्टर्ड अकाउंटेंट'),
          suitability: '92%',
          reasoning: getTranslation('Venus-Mercury combination brings financial acumen and wealth management skills', 'शुक्र-बुध संयोजन वित्तीय कुशलता और धन प्रबंधन कौशल लाता है')
        }
      ],
      entrepreneurship: {
        score: '89%',
        bestSectors: [
          getTranslation('Technology Startups', 'प्रौद्योगिकी स्टार्टअप'),
          getTranslation('Healthcare Innovation', 'स्वास्थ्य सेवा नवाचार'),
          getTranslation('Financial Services', 'वित्तीय सेवाएं'),
          getTranslation('Educational Technology', 'शैक्षणिक प्रौद्योगिकी')
        ],
        timing: getTranslation('2024-2026 extremely favorable for business ventures', '2024-2026 व्यापारिक उद्यमों के लिए अत्यंत अनुकूल')
      }
    },
    careerTiming: {
      currentPhase: {
        period: getTranslation('Growth & Expansion Phase', 'विकास और विस्तार चरण'),
        duration: '2024-2027',
        opportunities: [
          getTranslation('Major career breakthrough expected', 'प्रमुख करियर सफलता की उम्मीद'),
          getTranslation('Leadership roles becoming available', 'नेतृत्व की भूमिकाएं उपलब्ध हो रही हैं'),
          getTranslation('International opportunities opening', 'अंतर्राष्ट्रीय अवसर खुल रहे हैं'),
          getTranslation('Salary increases and promotions likely', 'वेतन वृद्धि और प्रमोशन की संभावना')
        ]
      },
      keyTimings: [
        {
          period: getTranslation('March 2024', 'मार्च 2024'),
          event: getTranslation('Major job offer or promotion', 'प्रमुख नौकरी का प्रस्ताव या प्रमोशन')
        },
        {
          period: getTranslation('August 2024', 'अगस्त 2024'),
          event: getTranslation('Business partnership opportunity', 'व्यापारिक साझेदारी का अवसर')
        },
        {
          period: getTranslation('January 2025', 'जनवरी 2025'),
          event: getTranslation('International assignment possibility', 'अंतर्राष्ट्रीय असाइनमेंट की संभावना')
        }
      ]
    },
    skillDevelopment: {
      primarySkills: [
        {
          skill: getTranslation('Strategic Leadership', 'रणनीतिक नेतृत्व'),
          importance: 'High',
          timeframe: getTranslation('Next 6 months', 'अगले 6 महीने')
        },
        {
          skill: getTranslation('Digital Marketing', 'डिजिटल मार्केटिंग'),
          importance: 'High',
          timeframe: getTranslation('Next 3 months', 'अगले 3 महीने')
        },
        {
          skill: getTranslation('Financial Planning', 'वित्तीय योजना'),
          importance: 'Medium',
          timeframe: getTranslation('Next 9 months', 'अगले 9 महीने')
        }
      ],
      certifications: [
        getTranslation('Project Management Professional (PMP)', 'प्रोजेक्ट मैनेजमेंट प्रोफेशनल (PMP)'),
        getTranslation('Digital Marketing Certification', 'डिजिटल मार्केटिंग सर्टिफिकेशन'),
        getTranslation('Financial Risk Management', 'वित्तीय जोखिम प्रबंधन')
      ]
    },
    wealthPotential: {
      overallScore: '91%',
      phases: [
        {
          age: '25-35',
          potential: getTranslation('Steady Growth', 'स्थिर विकास'),
          description: getTranslation('Building foundation, moderate wealth accumulation', 'आधार निर्माण, मध्यम धन संचय')
        },
        {
          age: '35-45',
          potential: getTranslation('Rapid Expansion', 'तीव्र विस्तार'),
          description: getTranslation('Major wealth creation period, multiple income sources', 'प्रमुख धन सृजन काल, कई आय स्रोत')
        },
        {
          age: '45-55',
          potential: getTranslation('Peak Wealth', 'शीर्ष संपत्ति'),
          description: getTranslation('Maximum earning potential, investment returns peak', 'अधिकतम कमाई क्षमता, निवेश रिटर्न शिखर')
        }
      ]
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-blue-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-100 to-cyan-100">
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Target className="h-5 w-5" />
            {getTranslation('AI-Powered Career Intelligence', 'AI-संचालित करियर बुद्धिमत्ता')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-1 mb-6">
              <TabsTrigger value="ideal-careers" className="flex flex-col items-center gap-1 text-xs p-2">
                <Briefcase className="h-3 w-3" />
                {getTranslation('Ideal Careers', 'आदर्श करियर')}
              </TabsTrigger>
              <TabsTrigger value="timing" className="flex flex-col items-center gap-1 text-xs p-2">
                <TrendingUp className="h-3 w-3" />
                {getTranslation('Career Timing', 'करियर समय')}
              </TabsTrigger>
              <TabsTrigger value="skills" className="flex flex-col items-center gap-1 text-xs p-2">
                <Lightbulb className="h-3 w-3" />
                {getTranslation('Skill Development', 'कौशल विकास')}
              </TabsTrigger>
              <TabsTrigger value="wealth" className="flex flex-col items-center gap-1 text-xs p-2">
                <DollarSign className="h-3 w-3" />
                {getTranslation('Wealth Potential', 'धन क्षमता')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ideal-careers" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">
                  {getTranslation('AI-Recommended Career Paths', 'AI-अनुशंसित करियर मार्ग')}
                </h3>
                {careerGuidance.idealCareers.primary.map((career, index) => (
                  <Card key={index} className="border-blue-100">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-semibold text-blue-800">{career.field}</h4>
                        <Badge className="bg-blue-600 text-white">{career.suitability}</Badge>
                      </div>
                      <p className="text-sm mb-2"><strong>Careers:</strong> {career.careers}</p>
                      <p className="text-xs text-gray-600"><strong>Why:</strong> {career.reasoning}</p>
                    </CardContent>
                  </Card>
                ))}
                
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-green-800 flex items-center gap-2 mb-3">
                      <Building className="h-4 w-4" />
                      {getTranslation('Entrepreneurship Potential', 'उद्यमिता क्षमता')}
                    </h4>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm">{getTranslation('Success Probability', 'सफलता संभावना')}</span>
                      <Badge className="bg-green-600 text-white">{careerGuidance.idealCareers.entrepreneurship.score}</Badge>
                    </div>
                    <div className="mb-3">
                      <strong className="text-sm">{getTranslation('Best Sectors:', 'सर्वोत्तम क्षेत्र:')}</strong>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {careerGuidance.idealCareers.entrepreneurship.bestSectors.map((sector, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">{sector}</Badge>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-green-700">{careerGuidance.idealCareers.entrepreneurship.timing}</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="timing" className="space-y-6">
              <Card className="border-purple-200 bg-purple-50">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-purple-800 mb-3">{careerGuidance.careerTiming.currentPhase.period}</h4>
                  <p className="text-sm mb-3">{getTranslation('Duration:', 'अवधि:')} {careerGuidance.careerTiming.currentPhase.duration}</p>
                  <ul className="space-y-2">
                    {careerGuidance.careerTiming.currentPhase.opportunities.map((opportunity, idx) => (
                      <li key={idx} className="text-sm flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-purple-600 rounded-full"></span>
                        {opportunity}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <div className="space-y-3">
                <h4 className="font-semibold">{getTranslation('Key Career Milestones', 'मुख्य करियर मील के पत्थर')}</h4>
                {careerGuidance.careerTiming.keyTimings.map((timing, idx) => (
                  <Card key={idx} className="border-orange-200">
                    <CardContent className="p-3">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-orange-800">{timing.period}</span>
                        <span className="text-sm text-gray-600">{timing.event}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="skills" className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold">{getTranslation('Priority Skills for Growth', 'विकास के लिए प्राथमिकता कौशल')}</h4>
                {careerGuidance.skillDevelopment.primarySkills.map((skill, idx) => (
                  <Card key={idx} className="border-yellow-200">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium">{skill.skill}</span>
                        <Badge variant={skill.importance === 'High' ? 'default' : 'secondary'}>
                          {skill.importance}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{getTranslation('Timeline:', 'समयसीमा:')} {skill.timeframe}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="border-indigo-200 bg-indigo-50">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-indigo-800 mb-3 flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    {getTranslation('Recommended Certifications', 'अनुशंसित प्रमाणपत्र')}
                  </h4>
                  <ul className="space-y-2">
                    {careerGuidance.skillDevelopment.certifications.map((cert, idx) => (
                      <li key={idx} className="text-sm flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
                        {cert}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="wealth" className="space-y-6">
              <Card className="border-emerald-200 bg-emerald-50">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold text-emerald-800">{getTranslation('Overall Wealth Potential', 'समग्र धन क्षमता')}</h4>
                    <Badge className="bg-emerald-600 text-white text-lg">{careerGuidance.wealthPotential.overallScore}</Badge>
                  </div>
                  
                  <div className="space-y-4">
                    {careerGuidance.wealthPotential.phases.map((phase, idx) => (
                      <div key={idx} className="border-l-4 border-emerald-400 pl-4">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium">{getTranslation('Age', 'आयु')} {phase.age}</span>
                          <Badge variant="outline">{phase.potential}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">{phase.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AICareerGuidance;
