import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Users, Activity, TrendingUp, Calendar, Search, Filter,
  Shield, UserPlus, Eye, Clock, BarChart3, PieChart
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import AdvancedAnalyticsDashboard from './AdvancedAnalyticsDashboard';
import PrivacyCompliantAnalytics from './PrivacyCompliantAnalytics';

interface UserActivity {
  id: string;
  user_id: string;
  activity_type: string;
  activity_data: any;
  created_at: string;
}

interface UserStats {
  totalUsers: number;
  todayActiveUsers: number;
  totalActivities: number;
  popularActivities: Array<{ type: string; count: number }>;
}

const AdminPanel = () => {
  const [userActivities, setUserActivities] = useState<UserActivity[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    totalUsers: 0,
    todayActiveUsers: 0,
    totalActivities: 0,
    popularActivities: []
  });
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('7');
  const { toast } = useToast();

  useEffect(() => {
    fetchUserActivities();
    fetchUserStats();
  }, [filterType, dateRange]);

  const fetchUserActivities = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('user_activities')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (filterType !== 'all') {
        query = query.eq('activity_type', filterType);
      }

      if (dateRange !== 'all') {
        const daysAgo = new Date();
        daysAgo.setDate(daysAgo.getDate() - parseInt(dateRange));
        query = query.gte('created_at', daysAgo.toISOString());
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching activities:', error);
        toast({
          title: "Error",
          description: "Failed to fetch user activities",
          variant: "destructive"
        });
        return;
      }

      setUserActivities(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      // Get total activities
      const { count: totalActivities } = await supabase
        .from('user_activities')
        .select('*', { count: 'exact', head: true });

      // Get today's active users
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { data: todayActivities } = await supabase
        .from('user_activities')
        .select('user_id')
        .gte('created_at', today.toISOString());

      const uniqueUsersToday = new Set(todayActivities?.map(a => a.user_id) || []).size;

      // Get popular activities
      const { data: activities } = await supabase
        .from('user_activities')
        .select('activity_type')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      const activityCounts: Record<string, number> = {};
      activities?.forEach(activity => {
        activityCounts[activity.activity_type] = (activityCounts[activity.activity_type] || 0) + 1;
      });

      const popularActivities = Object.entries(activityCounts)
        .map(([type, count]) => ({ type, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      setUserStats({
        totalUsers: 0, // Would need a separate query for auth.users
        todayActiveUsers: uniqueUsersToday,
        totalActivities: totalActivities || 0,
        popularActivities
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'kundali_calculation':
        return <BarChart3 className="h-4 w-4" />;
      case 'personality_test':
        return <Users className="h-4 w-4" />;
      case 'daily_horoscope':
        return <Calendar className="h-4 w-4" />;
      case 'login':
        return <Shield className="h-4 w-4" />;
      case 'signup':
        return <UserPlus className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'kundali_calculation':
        return 'bg-orange-100 text-orange-800';
      case 'personality_test':
        return 'bg-purple-100 text-purple-800';
      case 'daily_horoscope':
        return 'bg-blue-100 text-blue-800';
      case 'login':
        return 'bg-green-100 text-green-800';
      case 'signup':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredActivities = userActivities.filter(activity => {
    if (searchTerm) {
      return activity.activity_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
             activity.user_id.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">Monitor user behavior and application analytics</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.totalActivities}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Today</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.todayActiveUsers}</div>
              <p className="text-xs text-muted-foreground">Unique users today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Popular Activity</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">
                {userStats.popularActivities[0]?.type || 'N/A'}
              </div>
              <p className="text-xs text-muted-foreground">
                {userStats.popularActivities[0]?.count || 0} times this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Activity Types</CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.popularActivities.length}</div>
              <p className="text-xs text-muted-foreground">Different activity types</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="activities" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="activities">User Activities</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Analytics</TabsTrigger>
            <TabsTrigger value="privacy">Privacy & GDPR</TabsTrigger>
            <TabsTrigger value="realtime">Real-time Monitor</TabsTrigger>
          </TabsList>

          <TabsContent value="activities" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="activity-type">Activity Type</Label>
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger>
                        <SelectValue placeholder="All activities" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Activities</SelectItem>
                        <SelectItem value="kundali_calculation">Kundali Calculation</SelectItem>
                        <SelectItem value="personality_test">Personality Test</SelectItem>
                        <SelectItem value="daily_horoscope">Daily Horoscope</SelectItem>
                        <SelectItem value="login">Login</SelectItem>
                        <SelectItem value="signup">Signup</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="date-range">Date Range</Label>
                    <Select value={dateRange} onValueChange={setDateRange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Last 7 days" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Last 24 hours</SelectItem>
                        <SelectItem value="7">Last 7 days</SelectItem>
                        <SelectItem value="30">Last 30 days</SelectItem>
                        <SelectItem value="all">All time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="search">Search</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="search"
                        placeholder="Search activities..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="flex items-end">
                    <Button onClick={fetchUserActivities} disabled={loading}>
                      {loading ? 'Loading...' : 'Refresh'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Activities Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Recent Activities ({filteredActivities.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Activity</TableHead>
                        <TableHead>User ID</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredActivities.map((activity) => (
                        <TableRow key={activity.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getActivityIcon(activity.activity_type)}
                              <Badge className={getActivityColor(activity.activity_type)}>
                                {activity.activity_type}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {activity.user_id?.substring(0, 8)}...
                          </TableCell>
                          <TableCell>
                            <div className="max-w-xs truncate">
                              {activity.activity_data ? 
                                JSON.stringify(activity.activity_data).substring(0, 50) + '...' 
                                : 'No data'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {format(new Date(activity.created_at), 'MMM dd, HH:mm')}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {filteredActivities.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No activities found matching your criteria.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            {/* ... keep existing code (analytics content) the same ... */}
          </TabsContent>

          <TabsContent value="advanced">
            <AdvancedAnalyticsDashboard />
          </TabsContent>

          <TabsContent value="privacy">
            <PrivacyCompliantAnalytics />
          </TabsContent>

          <TabsContent value="realtime">
            <Card>
              <CardHeader>
                <CardTitle>Real-time User Activity Monitor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Activity className="h-16 w-16 mx-auto text-green-500 animate-pulse mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Real-time Monitoring Active</h3>
                  <p className="text-muted-foreground">
                    Live user activity data is being collected and processed.
                  </p>
                  <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{userStats.todayActiveUsers}</div>
                      <div className="text-sm text-muted-foreground">Active Today</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{userStats.totalActivities}</div>
                      <div className="text-sm text-muted-foreground">Total Events</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {userStats.popularActivities.length}
                      </div>
                      <div className="text-sm text-muted-foreground">Activity Types</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">Live</div>
                      <div className="text-sm text-muted-foreground">Status</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
