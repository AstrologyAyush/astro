
import React from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, AlertTriangle, Loader2 } from "lucide-react";
import { useAdminAuth } from '@/hooks/useAdminAuth';
import AdminPanel from '@/components/AdminPanel';
import EnhancedAuth from '@/components/EnhancedAuth';

const Admin = () => {
  const { user, isAdmin, isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-6 sm:py-8">
            <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-blue-600 mb-3 sm:mb-4" />
            <p className="text-gray-600 text-sm sm:text-base">Checking authorization...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return <EnhancedAuth />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-3 sm:mb-4 p-3 bg-red-100 rounded-full w-fit">
              <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 text-red-600" />
            </div>
            <CardTitle className="text-lg sm:text-xl text-red-800">Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-3 sm:space-y-4">
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              You don't have the required permissions to access the admin panel. 
              This area is restricted to owners and staff members only.
            </p>
            <Button 
              onClick={() => window.location.href = '/'}
              className="w-full min-h-[44px]"
            >
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <AdminPanel />;
};

export default Admin;
