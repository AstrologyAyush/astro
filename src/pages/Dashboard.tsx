
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  
  React.useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2 gradient-heading">Your Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user.name}! Manage your astrological charts and insights.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Saved Charts</CardTitle>
            <CardDescription>Your previously generated kundali charts</CardDescription>
          </CardHeader>
          <CardContent>
            {user.savedCharts?.length ? (
              <div className="space-y-4">
                {user.savedCharts.map((chart, index) => (
                  <div key={index} className="p-3 border rounded-md">
                    {chart.name || `Chart ${index + 1}`}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground mb-4">You don't have any saved charts yet</p>
                <Button onClick={() => navigate('/')}>Create New Chart</Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>Manage your account information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium">Name</p>
                <p className="text-muted-foreground">{user.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
              <div className="pt-4">
                <Button variant="outline" size="sm">Edit Profile</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
