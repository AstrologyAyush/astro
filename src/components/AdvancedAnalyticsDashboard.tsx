import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Area, AreaChart
} from 'recharts';
import { 
  Users, Activity, Clock, MousePointer, Eye, TrendingUp,
  Brain, Heart, Target, AlertTriangle, Globe, Smartphone
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface AIChatAnalytics {
  queryDistribution: { type: string; count: number; }[];
  avgSatisfaction: number;
  totalQueries: number;
}

interface AdvancedAnalytics {
  pageAnalytics: any[];
  interactionHeatmap: any[];
  userJourneys: any[];
  conversionFunnels: any[];
  errorTracking: any[];
  aiChatAnalytics: AIChatAnalytics;
  userSegments: any[];
  realTimeUsers: number;
}

const AdvancedAnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState<AdvancedAnalytics>({
    pageAnalytics: [],
    interactionHeatmap: [],
    userJourneys: [],
    conversionFunnels: [],
    errorTracking: [],
    aiChatAnalytics: {
      queryDistribution: [],
      avgSatisfaction: 0,
      totalQueries: 0
    },
    userSegments: [],
    realTimeUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    fetchAdvancedAnalytics();
    const interval = setInterval(fetchRealTimeData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [timeRange]);

  const fetchAdvancedAnalytics = async () => {
    try {
      setLoading(true);
      
      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      const days = timeRange === '24h' ? 1 : timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      startDate.setDate(startDate.getDate() - days);

      // Fetch page analytics
      const { data: pageData } = await supabase
        .from('user_activities')
        .select('*')
        .eq('activity_type', 'page_analytics')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false });

      // Fetch interaction data
      const { data: interactionData } = await supabase
        .from('user_activities')
        .select('*')
        .in('activity_type', ['high_value_interaction', 'chart_interaction'])
        .gte('created_at', startDate.toISOString());

      // Fetch user journey data
      const { data: journeyData } = await supabase
        .from('user_activities')
        .select('*')
        .eq('activity_type', 'user_journey')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });

      // Fetch conversion data
      const { data: conversionData } = await supabase
        .from('user_activities')
        .select('*')
        .eq('activity_type', 'conversion_event')
        .gte('created_at', startDate.toISOString());

      // Fetch error tracking
      const { data: errorData } = await supabase
        .from('user_activities')
        .select('*')
        .eq('activity_type', 'error_tracking')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false });

      // Fetch AI chat analytics
      const { data: aiChatData } = await supabase
        .from('user_activities')
        .select('*')
        .eq('activity_type', 'ai_chat_analysis')
        .gte('created_at', startDate.toISOString());

      setAnalytics({
        pageAnalytics: processPageAnalytics(pageData || []),
        interactionHeatmap: processInteractionData(interactionData || []),
        userJourneys: processJourneyData(journeyData || []),
        conversionFunnels: processConversionData(conversionData || []),
        errorTracking: errorData || [],
        aiChatAnalytics: processAIChatData(aiChatData || []),
        userSegments: generateUserSegments(pageData || [], interactionData || []),
        realTimeUsers: 0
      });
    } catch (error) {
      console.error('Error fetching advanced analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRealTimeData = async () => {
    // Fetch users active in last 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    
    const { data } = await supabase
      .from('user_activities')
      .select('user_id')
      .gte('created_at', fiveMinutesAgo.toISOString());

    const uniqueUsers = new Set(data?.map(d => d.user_id) || []).size;
    setAnalytics(prev => ({ ...prev, realTimeUsers: uniqueUsers }));
  };

  const processPageAnalytics = (data: any[]) => {
    const pageStats: Record<string, any> = {};
    
    data.forEach(activity => {
      const page = activity.activity_data?.page || 'unknown';
      if (!pageStats[page]) {
        pageStats[page] = {
          page,
          visits: 0,
          totalTime: 0,
          avgScrollDepth: 0,
          bounceRate: 0
        };
      }
      
      pageStats[page].visits++;
      pageStats[page].totalTime += activity.activity_data?.timeSpent || 0;
      pageStats[page].avgScrollDepth += activity.activity_data?.scrollDepth || 0;
    });

    return Object.values(pageStats).map((stat: any) => ({
      ...stat,
      avgTime: stat.totalTime / stat.visits,
      avgScrollDepth: stat.avgScrollDepth / stat.visits
    }));
  };

  const processInteractionData = (data: any[]) => {
    const interactions: Record<string, number> = {};
    
    data.forEach(activity => {
      const type = activity.activity_data?.elementType || activity.activity_data?.chartType || 'unknown';
      interactions[type] = (interactions[type] || 0) + 1;
    });

    return Object.entries(interactions).map(([type, count]) => ({ type, count }));
  };

  const processJourneyData = (data: any[]) => {
    const journeys: Record<string, any> = {};
    
    data.forEach(activity => {
      const sessionId = activity.activity_data?.sessionId;
      const step = activity.activity_data?.step;
      
      if (sessionId && step) {
        if (!journeys[sessionId]) {
          journeys[sessionId] = { steps: [], startTime: activity.created_at };
        }
        journeys[sessionId].steps.push({ step, timestamp: activity.created_at });
      }
    });

    // Analyze common paths
    const pathCounts: Record<string, number> = {};
    Object.values(journeys).forEach((journey: any) => {
      const path = journey.steps.map((s: any) => s.step).join(' → ');
      pathCounts[path] = (pathCounts[path] || 0) + 1;
    });

    return Object.entries(pathCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([path, count]) => ({ path, count }));
  };

  const processConversionData = (data: any[]) => {
    const conversions: Record<string, number> = {};
    
    data.forEach(activity => {
      const type = activity.activity_data?.conversionType || 'unknown';
      conversions[type] = (conversions[type] || 0) + 1;
    });

    return Object.entries(conversions).map(([type, count]) => ({ type, count }));
  };

  const processAIChatData = (data: any[]): AIChatAnalytics => {
    const queryTypes: Record<string, number> = {};
    let totalSatisfaction = 0;
    let satisfactionCount = 0;
    
    data.forEach(activity => {
      const queryType = activity.activity_data?.queryType || 'unknown';
      queryTypes[queryType] = (queryTypes[queryType] || 0) + 1;
      
      if (activity.activity_data?.satisfaction) {
        totalSatisfaction += activity.activity_data.satisfaction;
        satisfactionCount++;
      }
    });

    return {
      queryDistribution: Object.entries(queryTypes).map(([type, count]) => ({ type, count })),
      avgSatisfaction: satisfactionCount > 0 ? totalSatisfaction / satisfactionCount : 0,
      totalQueries: data.length
    };
  };

  const generateUserSegments = (pageData: any[], interactionData: any[]) => {
    // Simple segmentation based on activity level
    const userActivity: Record<string, number> = {};
    
    [...pageData, ...interactionData].forEach(activity => {
      const userId = activity.user_id;
      if (userId) {
        userActivity[userId] = (userActivity[userId] || 0) + 1;
      }
    });

    const activityLevels = Object.values(userActivity);
    const segments = [
      { name: 'High Engagement', count: activityLevels.filter(a => a > 10).length, color: '#22c55e' },
      { name: 'Medium Engagement', count: activityLevels.filter(a => a > 3 && a <= 10).length, color: '#f59e0b' },
      { name: 'Low Engagement', count: activityLevels.filter(a => a <= 3).length, color: '#ef4444' }
    ];

    return segments;
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading advanced analytics...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Real-time metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Live Users</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{analytics.realTimeUsers}</div>
            <p className="text-xs text-muted-foreground">Active in last 5 minutes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Errors</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{analytics.errorTracking.length}</div>
            <p className="text-xs text-muted-foreground">In selected period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Queries</CardTitle>
            <Brain className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{analytics.aiChatAnalytics.totalQueries}</div>
            <p className="text-xs text-muted-foreground">Total AI interactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
            <Heart className="h-4 w-4 text-pink-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-600">
              {analytics.aiChatAnalytics.avgSatisfaction?.toFixed(1) || 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">Average rating</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="page-analytics" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="page-analytics">Page Analytics</TabsTrigger>
          <TabsTrigger value="interactions">Interactions</TabsTrigger>
          <TabsTrigger value="user-journeys">User Journeys</TabsTrigger>
          <TabsTrigger value="conversions">Conversions</TabsTrigger>
          <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
          <TabsTrigger value="segments">User Segments</TabsTrigger>
        </TabsList>

        <TabsContent value="page-analytics">
          <Card>
            <CardHeader>
              <CardTitle>Page Performance Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.pageAnalytics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="page" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="visits" fill="#8884d8" />
                  <Bar dataKey="avgTime" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interactions">
          <Card>
            <CardHeader>
              <CardTitle>Interaction Heatmap</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics.interactionHeatmap}
                    dataKey="count"
                    nameKey="type"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label
                  >
                    {analytics.interactionHeatmap.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="user-journeys">
          <Card>
            <CardHeader>
              <CardTitle>Common User Journey Paths</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.userJourneys.slice(0, 5).map((journey, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">{journey.path}</span>
                    <Badge variant="secondary">{journey.count} users</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conversions">
          <Card>
            <CardHeader>
              <CardTitle>Conversion Events</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.conversionFunnels}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-insights">
          <Card>
            <CardHeader>
              <CardTitle>AI Chat Query Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics.aiChatAnalytics.queryDistribution}
                    dataKey="count"
                    nameKey="type"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label
                  >
                    {analytics.aiChatAnalytics.queryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="segments">
          <Card>
            <CardHeader>
              <CardTitle>User Engagement Segments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.userSegments.map((segment, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: segment.color }}
                      />
                      <span className="font-medium">{segment.name}</span>
                    </div>
                    <Badge variant="outline">{segment.count} users</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAnalyticsDashboard;
