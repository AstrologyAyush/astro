
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { CalendarIcon, Save, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from '@/lib/utils';

const ProfilePage = () => {
  const { user, profile, isLoggedIn, isLoading, updateProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [firstName, setFirstName] = useState(profile?.first_name || '');
  const [lastName, setLastName] = useState(profile?.last_name || '');
  const [birthDate, setBirthDate] = useState<Date | undefined>(
    profile?.birth_date ? new Date(profile.birth_date) : undefined
  );
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  React.useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      navigate('/login');
    }

    if (profile) {
      setFirstName(profile.first_name || '');
      setLastName(profile.last_name || '');
      setBirthDate(profile.birth_date ? new Date(profile.birth_date) : undefined);
    }
  }, [isLoggedIn, isLoading, navigate, profile]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      let imageUrl = profile?.profile_image;

      // Upload image if selected
      if (profileImage) {
        setIsUploading(true);
        const fileExt = profileImage.name.split('.').pop();
        const fileName = `${user?.id}-${Math.random()}.${fileExt}`;
        const filePath = `profile-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, profileImage);

        if (uploadError) {
          throw new Error(uploadError.message);
        }

        // Get public URL
        const { data } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);

        imageUrl = data.publicUrl;
        setIsUploading(false);
      }

      const success = await updateProfile({
        first_name: firstName,
        last_name: lastName,
        birth_date: birthDate ? format(birthDate, 'yyyy-MM-dd') : undefined,
        profile_image: imageUrl
      });

      if (success) {
        toast({
          title: "Profile updated",
          description: "Your profile has been successfully updated",
        });
      } else {
        toast({
          title: "Update failed",
          description: "There was an error updating your profile",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!user || !profile) {
    return null;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold mb-2 gradient-heading">Your Profile</h1>
        <p className="text-muted-foreground">
          Manage your personal information and account preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <Card className="lg:col-span-2">
          <form onSubmit={handleProfileUpdate}>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  value={user.email || ''}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed
                </p>
              </div>

              <div className="space-y-2">
                <Label>Date of Birth</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !birthDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {birthDate ? format(birthDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={birthDate}
                      onSelect={setBirthDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="profileImage">Profile Image</Label>
                <div className="flex items-center gap-4">
                  {(profile.profile_image || profileImage) && (
                    <div className="h-16 w-16 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                      <img 
                        src={profileImage 
                          ? URL.createObjectURL(profileImage) 
                          : profile.profile_image || ''} 
                        alt="Profile" 
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <Input 
                      id="profileImage" 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageChange}
                      className="cursor-pointer"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Recommended: Square image, 500x500 pixels or larger
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isUpdating || isUploading}>
                {isUpdating || isUploading ? (
                  <>
                    <span className="animate-spin mr-2">◌</span>
                    {isUploading ? 'Uploading...' : 'Updating...'}
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Account Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Account Summary</CardTitle>
            <CardDescription>Information about your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium">Member Since</h3>
              <p className="text-sm text-muted-foreground">
                {user.created_at ? format(new Date(user.created_at), 'PP') : 'Unknown'}
              </p>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-sm font-medium">Saved Kundalis</h3>
              <p className="text-sm text-muted-foreground">
                {user.savedCharts?.length || 0} charts saved
              </p>
            </div>
            
            <div className="pt-2">
              <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
                View Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
