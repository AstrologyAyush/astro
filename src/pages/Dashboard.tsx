
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from 'date-fns';
import { Eye, Download, Trash2, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface KundaliItem {
  id: string;
  name: string;
  birth_date: string;
  birth_place: string;
  created_at: string;
}

const Dashboard = () => {
  const { user, userProfile, isLoggedIn, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [savedKundalis, setSavedKundalis] = useState<KundaliItem[]>([]);
  const [isLoadingKundalis, setIsLoadingKundalis] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, isLoading, navigate]);

  useEffect(() => {
    if (isLoggedIn && user) {
      fetchSavedKundalis();
    }
  }, [isLoggedIn, user]);

  const fetchSavedKundalis = async () => {
    try {
      setIsLoadingKundalis(true);
      
      // For now, use the saved charts from the profile
      const charts = userProfile?.savedCharts || [];
      setSavedKundalis(charts);
      
    } catch (error: any) {
      console.error('Error fetching kundalis:', error);
      toast({
        title: 'Error loading saved kundalis',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive'
      });
    } finally {
      setIsLoadingKundalis(false);
    }
  };

  const handleDeleteKundali = async (id: string) => {
    if (!confirm('Are you sure you want to delete this kundali?')) return;
    
    try {
      setIsDeleting(true);
      
      // Update local state
      setSavedKundalis(prev => prev.filter(item => item.id !== id));
      
      toast({
        title: 'Kundali deleted',
        description: 'The chart has been successfully removed'
      });
    } catch (error: any) {
      console.error('Error deleting kundali:', error);
      toast({
        title: 'Delete failed',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive'
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const generatePDF = (kundali: KundaliItem) => {
    toast({
      title: 'PDF Generation',
      description: 'This feature is coming soon!'
    });
  };

  const viewKundali = (kundali: KundaliItem) => {
    // We would navigate to a view page with the kundali details
    navigate(`/kundali?id=${kundali.id}`);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2 gradient-heading">Your Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {userProfile?.firstName || user.email?.split('@')[0]}! Manage your astrological charts and insights.
        </p>
      </div>

      <Tabs defaultValue="charts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="charts">Saved Charts</TabsTrigger>
          <TabsTrigger value="profile">Your Profile</TabsTrigger>
        </TabsList>
        
        <TabsContent value="charts" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Your Saved Charts</h2>
            <Button onClick={() => navigate('/kundali')} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Create New Chart
            </Button>
          </div>

          {isLoadingKundalis ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </CardHeader>
                  <CardContent>
                    <div className="flex space-x-4">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-9 w-32" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : savedKundalis.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {savedKundalis.map((kundali) => (
                <Card key={kundali.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{kundali.name}</CardTitle>
                    <CardDescription>
                      Created on {format(new Date(kundali.created_at), 'PP')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <span className="text-sm font-medium">Chart Details: </span>
                      <span className="text-sm text-muted-foreground">
                        Vedic Birth Chart
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter className="gap-2 flex-wrap">
                    <Button size="sm" variant="outline" onClick={() => viewKundali(kundali)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => generatePDF(kundali)}>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => handleDeleteKundali(kundali.id)}
                      disabled={isDeleting}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-muted-foreground mb-4">You don't have any saved charts yet</p>
                <Button onClick={() => navigate('/kundali')}>Create Your First Chart</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="profile">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Your basic account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium">Name</p>
                  <p className="text-muted-foreground">
                    {userProfile?.firstName && userProfile?.lastName 
                      ? `${userProfile.firstName} ${userProfile.lastName}` 
                      : 'Not set'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-muted-foreground">{user.email}</p>
                </div>
                <div className="pt-2">
                  <Button onClick={() => navigate('/profile')}>
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Statistics</CardTitle>
                <CardDescription>Summary of your activity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-primary/10 p-4 rounded-md text-center">
                    <p className="text-3xl font-bold">{savedKundalis.length}</p>
                    <p className="text-sm text-muted-foreground">Saved Charts</p>
                  </div>
                  <div className="bg-primary/10 p-4 rounded-md text-center">
                    <p className="text-3xl font-bold">0</p>
                    <p className="text-sm text-muted-foreground">Downloads</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium">Member Since</p>
                  <p className="text-muted-foreground">
                    {user.created_at ? format(new Date(user.created_at), 'PP') : 'Unknown'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
