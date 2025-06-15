
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Target, Calendar, CheckCircle, Star, Bell, TrendingUp } from 'lucide-react';

interface KarmaAlignmentTrackerProps {
  kundaliData: any;
  language: 'hi' | 'en';
}

const KarmaAlignmentTracker: React.FC<KarmaAlignmentTrackerProps> = ({ kundaliData, language }) => {
  const [weeklyTasks, setWeeklyTasks] = useState<any[]>([]);
  const [todaysTasks, setTodaysTasks] = useState<any[]>([]);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [weeklyProgress, setWeeklyProgress] = useState(0);

  const getTranslation = (en: string, hi: string) => {
    return language === 'hi' ? hi : en;
  };

  useEffect(() => {
    generatePersonalizedTasks();
    loadCompletedTasks();
  }, []);

  const generatePersonalizedTasks = () => {
    const chart = kundaliData.chart || {};
    const currentDate = new Date();
    const dayOfWeek = currentDate.getDay();
    
    // Generate tasks based on current planetary positions and user's chart
    const todayTaskList = [
      {
        id: 'moon-10th',
        title: getTranslation('Speak up in meetings', 'बैठकों में बोलें'),
        description: getTranslation("Today's Moon in 10th house - express your ideas confidently", "आज का चंद्रमा 10वें भाव में - अपने विचारों को आत्मविश्वास से व्यक्त करें"),
        type: 'communication',
        karmaPoints: 15,
        planetary: 'Moon',
        house: 10,
        completed: false
      },
      {
        id: 'jupiter-gratitude',
        title: getTranslation('Practice gratitude', 'कृतज्ञता का अभ्यास करें'),
        description: getTranslation('Jupiter transit encourages appreciation and wisdom', 'गुरु गोचर प्रशंसा और ज्ञान को प्रोत्साहित करता है'),
        type: 'spiritual',
        karmaPoints: 10,
        planetary: 'Jupiter',
        house: 9,
        completed: false
      },
      {
        id: 'mars-exercise',
        title: getTranslation('Physical exercise', 'शारीरिक व्यायाम'),
        description: getTranslation('Mars energy boost - channel it through physical activity', 'मंगल ऊर्जा बूस्ट - इसे शारीरिक गतिविधि के माध्यम से चैनल करें'),
        type: 'health',
        karmaPoints: 12,
        planetary: 'Mars',
        house: 1,
        completed: false
      }
    ];

    const weeklyTaskList = [
      {
        id: 'week-meditation',
        title: getTranslation('Daily meditation (7 days)', 'दैनिक ध्यान (7 दिन)'),
        description: getTranslation('Build spiritual connection based on your 12th house energy', 'अपनी 12वीं भाव ऊर्जा के आधार पर आध्यात्मिक संबंध बनाएं'),
        type: 'spiritual',
        karmaPoints: 50,
        daysCompleted: 0,
        totalDays: 7,
        completed: false
      },
      {
        id: 'week-relationships',
        title: getTranslation('Strengthen family bonds', 'पारिवारिक बंधन मजबूत करें'),
        description: getTranslation('Venus in 4th house favors family harmony this week', 'इस सप्ताह 4th भाव में शुक्र पारिवारिक सामंजस्य का समर्थन करता है'),
        type: 'relationship',
        karmaPoints: 35,
        daysCompleted: 0,
        totalDays: 7,
        completed: false
      },
      {
        id: 'week-learning',
        title: getTranslation('Learn something new', 'कुछ नया सीखें'),
        description: getTranslation('Mercury aspects support learning and skill development', 'बुध के पहलू सीखने और कौशल विकास का समर्थन करते हैं'),
        type: 'growth',
        karmaPoints: 40,
        daysCompleted: 0,
        totalDays: 7,
        completed: false
      }
    ];

    setTodaysTasks(todayTaskList);
    setWeeklyTasks(weeklyTaskList);
  };

  const loadCompletedTasks = () => {
    const saved = localStorage.getItem('completedKarmaTasks');
    if (saved) {
      setCompletedTasks(JSON.parse(saved));
    }
  };

  const saveCompletedTasks = (tasks: string[]) => {
    localStorage.setItem('completedKarmaTasks', JSON.stringify(tasks));
    setCompletedTasks(tasks);
  };

  const toggleTaskCompletion = (taskId: string) => {
    const newCompleted = completedTasks.includes(taskId)
      ? completedTasks.filter(id => id !== taskId)
      : [...completedTasks, taskId];
    
    saveCompletedTasks(newCompleted);
    
    // Update progress
    const totalTasks = todaysTasks.length + weeklyTasks.length;
    const completedCount = newCompleted.length;
    setWeeklyProgress((completedCount / totalTasks) * 100);
  };

  const getTaskTypeIcon = (type: string) => {
    switch (type) {
      case 'spiritual': return <Star className="h-4 w-4" />;
      case 'communication': return <Bell className="h-4 w-4" />;
      case 'health': return <Target className="h-4 w-4" />;
      case 'relationship': return <CheckCircle className="h-4 w-4" />;
      case 'growth': return <TrendingUp className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const getTaskTypeColor = (type: string) => {
    switch (type) {
      case 'spiritual': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'communication': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'health': return 'bg-green-100 text-green-800 border-green-200';
      case 'relationship': return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'growth': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTotalKarmaPoints = () => {
    return completedTasks.reduce((total, taskId) => {
      const task = [...todaysTasks, ...weeklyTasks].find(t => t.id === taskId);
      return total + (task?.karmaPoints || 0);
    }, 0);
  };

  return (
    <Card className="border-green-200">
      <CardHeader className="bg-gradient-to-r from-green-100 to-emerald-100">
        <CardTitle className="text-green-800 flex items-center gap-2">
          <Target className="h-5 w-5" />
          {getTranslation('Karma Alignment Tracker', 'कर्म संरेखण ट्रैकर')}
        </CardTitle>
        <p className="text-sm text-green-600">
          {getTranslation('Personalized tasks based on your planetary influences', 'आपके ग्रहीय प्रभावों पर आधारित व्यक्तिगत कार्य')}
        </p>
      </CardHeader>
      <CardContent className="p-6">
        {/* Progress Overview */}
        <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h3 className="font-semibold text-green-800">
                {getTranslation('Weekly Progress', 'साप्ताहिक प्रगति')}
              </h3>
              <p className="text-sm text-green-600">
                {completedTasks.length} / {todaysTasks.length + weeklyTasks.length} {getTranslation('tasks completed', 'कार्य पूर्ण')}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-800">{getTotalKarmaPoints()}</div>
              <div className="text-sm text-green-600">{getTranslation('Karma Points', 'कर्म अंक')}</div>
            </div>
          </div>
          <Progress value={weeklyProgress} className="h-2" />
        </div>

        <Tabs defaultValue="today" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="today" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {getTranslation("Today's Tasks", 'आज के कार्य')}
            </TabsTrigger>
            <TabsTrigger value="weekly" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              {getTranslation('Weekly Goals', 'साप्ताहिक लक्ष्य')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="mt-4">
            <div className="space-y-3">
              {todaysTasks.map((task) => (
                <div key={task.id} className="p-4 border border-green-200 rounded-lg bg-green-50">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={completedTasks.includes(task.id)}
                      onCheckedChange={() => toggleTaskCompletion(task.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className={`font-semibold ${completedTasks.includes(task.id) ? 'line-through text-gray-500' : 'text-green-800'}`}>
                          {task.title}
                        </h4>
                        <Badge className={`${getTaskTypeColor(task.type)} border text-xs`}>
                          {getTaskTypeIcon(task.type)}
                          <span className="ml-1">{task.karmaPoints} pts</span>
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                      <div className="flex items-center gap-2 text-xs text-green-600">
                        <span>{getTranslation('Planetary influence:', 'ग्रहीय प्रभाव:')} {task.planetary}</span>
                        <span>•</span>
                        <span>{getTranslation('House:', 'भाव:')} {task.house}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="weekly" className="mt-4">
            <div className="space-y-3">
              {weeklyTasks.map((task) => (
                <div key={task.id} className="p-4 border border-green-200 rounded-lg bg-green-50">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={completedTasks.includes(task.id)}
                      onCheckedChange={() => toggleTaskCompletion(task.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className={`font-semibold ${completedTasks.includes(task.id) ? 'line-through text-gray-500' : 'text-green-800'}`}>
                          {task.title}
                        </h4>
                        <Badge className={`${getTaskTypeColor(task.type)} border text-xs`}>
                          {getTaskTypeIcon(task.type)}
                          <span className="ml-1">{task.karmaPoints} pts</span>
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-green-600">
                          {getTranslation('Progress:', 'प्रगति:')} {task.daysCompleted}/{task.totalDays} {getTranslation('days', 'दिन')}
                        </div>
                        <Progress value={(task.daysCompleted / task.totalDays) * 100} className="h-1 w-20" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Cosmic Reminder */}
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <Bell className="h-4 w-4 text-purple-600" />
            <h4 className="font-semibold text-purple-800">
              {getTranslation("Today's Cosmic Reminder", 'आज की कॉस्मिक रिमाइंडर')}
            </h4>
          </div>
          <p className="text-sm text-purple-700">
            {getTranslation(
              "Moon in 10th house today - your emotions and career are aligned. Speak up in professional settings and let your intuition guide your decisions.",
              "आज चंद्रमा 10वें भाव में - आपकी भावनाएं और करियर संरेखित हैं। पेशेवर सेटिंग्स में बोलें और अपनी अंतर्ज्ञान को अपने निर्णयों का मार्गदर्शन करने दें।"
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default KarmaAlignmentTracker;
