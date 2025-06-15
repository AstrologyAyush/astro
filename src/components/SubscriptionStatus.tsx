
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Settings, Calendar, Crown } from "lucide-react";
import { useSubscription } from '@/hooks/useSubscription';
import { format } from 'date-fns';

const SubscriptionStatus = () => {
  const { 
    subscribed, 
    subscriptionTier, 
    subscriptionEnd, 
    isLoading, 
    refreshSubscription, 
    manageSubscription 
  } = useSubscription();

  const getTierInfo = (tier: string) => {
    switch (tier) {
      case 'basic':
        return { name: 'Basic', color: 'bg-blue-100 text-blue-800', icon: <Calendar className="h-4 w-4" /> };
      case 'pro':
        return { name: 'Pro', color: 'bg-purple-100 text-purple-800', icon: <Settings className="h-4 w-4" /> };
      case 'premium':
        return { name: 'Premium', color: 'bg-yellow-100 text-yellow-800', icon: <Crown className="h-4 w-4" /> };
      default:
        return { name: 'Free', color: 'bg-gray-100 text-gray-800', icon: <Calendar className="h-4 w-4" /> };
    }
  };

  const tierInfo = getTierInfo(subscriptionTier);

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            {tierInfo.icon}
            Subscription Status
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={refreshSubscription}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Current Plan:</span>
          <Badge className={tierInfo.color}>
            {tierInfo.name}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Status:</span>
          <Badge variant={subscribed ? 'default' : 'secondary'}>
            {subscribed ? 'Active' : 'Free'}
          </Badge>
        </div>

        {subscriptionEnd && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Renews:</span>
            <span className="text-sm text-gray-600">
              {format(new Date(subscriptionEnd), 'MMM dd, yyyy')}
            </span>
          </div>
        )}

        <div className="pt-2 space-y-2">
          {subscribed && (
            <Button
              onClick={manageSubscription}
              variant="outline"
              size="sm"
              className="w-full"
              disabled={isLoading}
            >
              <Settings className="h-4 w-4 mr-2" />
              Manage Subscription
            </Button>
          )}
          
          <div className="text-xs text-gray-500 text-center">
            {subscribed 
              ? 'Manage billing, change plans, or cancel anytime'
              : 'Upgrade to unlock premium features'
            }
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionStatus;
