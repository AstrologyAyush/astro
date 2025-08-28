import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Edit2, Trash2, Star, User, Calendar, MapPin, Clock, Users } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useActivityTracker } from "@/hooks/useActivityTracker";

interface UserProfile {
  id: string;
  user_id: string;
  profile_name: string;
  full_name: string;
  date_of_birth: string;
  birth_time: string;
  birth_place: string;
  latitude: number;
  longitude: number;
  timezone_offset: number;
  gender: 'male' | 'female' | 'other' | null;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

const UserProfileManager: React.FC = () => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    profile_name: '',
    full_name: '',
    date_of_birth: '',
    birth_time: '',
    birth_place: '',
    latitude: '',
    longitude: '',
    timezone_offset: '0',
    gender: '' as 'male' | 'female' | 'other' | ''
  });
  const { toast } = useToast();
  const { trackActivity } = useActivityTracker();

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('is_primary', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProfiles((data as UserProfile[]) || []);
    } catch (error) {
      console.error('Error loading profiles:', error);
      toast({
        title: "Error",
        description: "Failed to load profiles. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      profile_name: '',
      full_name: '',
      date_of_birth: '',
      birth_time: '',
      birth_place: '',
      latitude: '',
      longitude: '',
      timezone_offset: '0',
      gender: ''
    });
    setEditingProfile(null);
  };

  const openDialog = (profile?: UserProfile) => {
    if (profile) {
      setEditingProfile(profile);
      setFormData({
        profile_name: profile.profile_name,
        full_name: profile.full_name,
        date_of_birth: profile.date_of_birth,
        birth_time: profile.birth_time,
        birth_place: profile.birth_place,
        latitude: profile.latitude.toString(),
        longitude: profile.longitude.toString(),
        timezone_offset: profile.timezone_offset.toString(),
        gender: profile.gender || ''
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const handleSave = async () => {
    try {
      // Validate required fields
      if (!formData.profile_name || !formData.full_name || !formData.date_of_birth || 
          !formData.birth_time || !formData.birth_place || !formData.latitude || !formData.longitude) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Error",
          description: "Please log in to save profiles.",
          variant: "destructive",
        });
        return;
      }

      const profileData = {
        user_id: user.id,
        profile_name: formData.profile_name,
        full_name: formData.full_name,
        date_of_birth: formData.date_of_birth,
        birth_time: formData.birth_time,
        birth_place: formData.birth_place,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        timezone_offset: parseInt(formData.timezone_offset),
        gender: formData.gender || null,
        is_primary: profiles.length === 0 // First profile becomes primary
      };

      if (editingProfile) {
        // Update existing profile
        const { error } = await supabase
          .from('user_profiles')
          .update(profileData)
          .eq('id', editingProfile.id);

        if (error) throw error;

        trackActivity('profile_update', { profile_id: editingProfile.id });
        toast({
          title: "Success",
          description: "Profile updated successfully.",
        });
      } else {
        // Create new profile
        const { error } = await supabase
          .from('user_profiles')
          .insert([profileData]);

        if (error) throw error;

        trackActivity('profile_update', { action: 'create_profile' });
        toast({
          title: "Success",
          description: "Profile created successfully.",
        });
      }

      await loadProfiles();
      closeDialog();
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (profileId: string) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', profileId);

      if (error) throw error;

      trackActivity('profile_update', { action: 'delete_profile', profile_id: profileId });
      toast({
        title: "Success",
        description: "Profile deleted successfully.",
      });

      await loadProfiles();
    } catch (error) {
      console.error('Error deleting profile:', error);
      toast({
        title: "Error",
        description: "Failed to delete profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const setPrimaryProfile = async (profileId: string) => {
    try {
      // First, remove primary status from all profiles
      await supabase
        .from('user_profiles')
        .update({ is_primary: false })
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Update all

      // Then set the selected profile as primary
      const { error } = await supabase
        .from('user_profiles')
        .update({ is_primary: true })
        .eq('id', profileId);

      if (error) throw error;

      trackActivity('profile_update', { action: 'set_primary', profile_id: profileId });
      toast({
        title: "Success",
        description: "Primary profile updated successfully.",
      });

      await loadProfiles();
    } catch (error) {
      console.error('Error setting primary profile:', error);
      toast({
        title: "Error",
        description: "Failed to set primary profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Users className="h-6 w-6" />
            My Profiles
          </h1>
          <p className="text-muted-foreground">Manage your birth profiles for accurate astrological calculations</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Profile
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingProfile ? 'Edit Profile' : 'Add New Profile'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="profile_name">Profile Name *</Label>
                <Input
                  id="profile_name"
                  placeholder="e.g., My Chart, Son's Chart"
                  value={formData.profile_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, profile_name: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="full_name">Full Name *</Label>
                <Input
                  id="full_name"
                  placeholder="Enter full name"
                  value={formData.full_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date_of_birth">Date of Birth *</Label>
                  <Input
                    id="date_of_birth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => setFormData(prev => ({ ...prev, date_of_birth: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="birth_time">Birth Time *</Label>
                  <Input
                    id="birth_time"
                    type="time"
                    value={formData.birth_time}
                    onChange={(e) => setFormData(prev => ({ ...prev, birth_time: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="birth_place">Birth Place *</Label>
                <Input
                  id="birth_place"
                  placeholder="City, State, Country"
                  value={formData.birth_place}
                  onChange={(e) => setFormData(prev => ({ ...prev, birth_place: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="latitude">Latitude *</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    placeholder="e.g., 28.6139"
                    value={formData.latitude}
                    onChange={(e) => setFormData(prev => ({ ...prev, latitude: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="longitude">Longitude *</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    placeholder="e.g., 77.2090"
                    value={formData.longitude}
                    onChange={(e) => setFormData(prev => ({ ...prev, longitude: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={formData.gender} onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value as any }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="timezone_offset">Timezone Offset</Label>
                  <Input
                    id="timezone_offset"
                    type="number"
                    placeholder="e.g., +5.5 for IST"
                    value={formData.timezone_offset}
                    onChange={(e) => setFormData(prev => ({ ...prev, timezone_offset: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleSave} className="flex-1">
                  {editingProfile ? 'Update' : 'Create'} Profile
                </Button>
                <Button variant="outline" onClick={closeDialog}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {profiles.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <User className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Profiles Yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first profile to start generating personalized astrological reports.
            </p>
            <Button onClick={() => openDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Profile
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {profiles.map((profile) => (
            <Card key={profile.id} className="relative">
              {profile.is_primary && (
                <Badge className="absolute -top-2 -right-2 bg-primary text-primary-foreground">
                  <Star className="h-3 w-3 mr-1" />
                  Primary
                </Badge>
              )}
              
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {profile.profile_name}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div>
                  <p className="font-medium">{profile.full_name}</p>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      {new Date(profile.date_of_birth).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      {profile.birth_time}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3" />
                      {profile.birth_place}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  {!profile.is_primary && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setPrimaryProfile(profile.id)}
                      className="flex-1"
                    >
                      Set Primary
                    </Button>
                  )}
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openDialog(profile)}
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Profile</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{profile.profile_name}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(profile.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserProfileManager;