
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, User, Settings, Moon, Sun, Monitor, Bell, Globe, LogOut, Save, Trash2 } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from "@/components/ui/badge";

const MobileProfile = () => {
  const { user, profile, settings, savedKundalis, isLoggedIn, logout, updateProfile, updateSettings, deleteKundali } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    birth_date: profile?.birth_date || ''
  });

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleProfileUpdate = async () => {
    const success = await updateProfile(profileData);
    if (success) {
      setIsEditing(false);
    }
  };

  const themeIcons = {
    light: Sun,
    dark: Moon,
    system: Monitor
  };

  const ThemeIcon = themeIcons[settings.theme];

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
        <h2 className="text-xl font-semibold mb-4">Please log in to view your profile</h2>
        <Button onClick={() => navigate('/login')} className="bg-orange-500 hover:bg-orange-600">
          Login
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="text-white">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">Profile</h1>
        <Button variant="ghost" size="icon" onClick={handleLogout} className="text-red-400">
          <LogOut className="h-5 w-5" />
        </Button>
      </div>

      <div className="p-6 space-y-6">
        {/* Profile Info */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className="text-orange-400"
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {profile?.first_name?.charAt(0) || 'U'}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {profile?.first_name} {profile?.last_name}
                </h3>
                <p className="text-gray-400">{user?.email}</p>
              </div>
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">First Name</Label>
                    <Input
                      value={profileData.first_name}
                      onChange={(e) => setProfileData({...profileData, first_name: e.target.value})}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Last Name</Label>
                    <Input
                      value={profileData.last_name}
                      onChange={(e) => setProfileData({...profileData, last_name: e.target.value})}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-white">Birth Date</Label>
                  <Input
                    type="date"
                    value={profileData.birth_date}
                    onChange={(e) => setProfileData({...profileData, birth_date: e.target.value})}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <Button onClick={handleProfileUpdate} className="w-full bg-orange-500 hover:bg-orange-600">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Email:</span>
                  <span className="text-white">{user?.email}</span>
                </div>
                {profile?.birth_date && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Birth Date:</span>
                    <span className="text-white">{profile.birth_date}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-400">Member since:</span>
                  <span className="text-white">
                    {new Date(user?.created_at || '').toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Settings */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Theme Setting */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ThemeIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-white font-medium">Theme</p>
                  <p className="text-gray-400 text-sm">Choose your preferred theme</p>
                </div>
              </div>
              <Select
                value={settings.theme}
                onValueChange={(value) => updateSettings({ theme: value as 'light' | 'dark' | 'system' })}
              >
                <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="light" className="text-white">Light</SelectItem>
                  <SelectItem value="dark" className="text-white">Dark</SelectItem>
                  <SelectItem value="system" className="text-white">System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Language Setting */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-white font-medium">Language</p>
                  <p className="text-gray-400 text-sm">Choose your language</p>
                </div>
              </div>
              <Select
                value={settings.language}
                onValueChange={(value) => updateSettings({ language: value as 'en' | 'hi' })}
              >
                <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="en" className="text-white">English</SelectItem>
                  <SelectItem value="hi" className="text-white">हिंदी</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Notifications Setting */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-white font-medium">Notifications</p>
                  <p className="text-gray-400 text-sm">Receive astrological updates</p>
                </div>
              </div>
              <Switch
                checked={settings.notifications}
                onCheckedChange={(checked) => updateSettings({ notifications: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Saved Kundalis */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Saved Kundalis</CardTitle>
          </CardHeader>
          <CardContent>
            {savedKundalis.length === 0 ? (
              <p className="text-gray-400 text-center py-4">No saved kundalis yet</p>
            ) : (
              <div className="space-y-3">
                {savedKundalis.map((kundali) => (
                  <div key={kundali.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <div>
                      <p className="text-white font-medium">{kundali.name}</p>
                      <p className="text-gray-400 text-sm">
                        {new Date(kundali.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteKundali(kundali.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats */}
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-400">{savedKundalis.length}</p>
                <p className="text-gray-400 text-sm">Saved Charts</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-400">
                  {Math.floor((Date.now() - new Date(user?.created_at || '').getTime()) / (1000 * 60 * 60 * 24))}
                </p>
                <p className="text-gray-400 text-sm">Days Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MobileProfile;
