
import React from 'react';
import SubscriptionPlans from '@/components/SubscriptionPlans';
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Zap, Heart, Star } from "lucide-react";

const Pricing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Unlock Your Cosmic Potential
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the perfect plan to access ancient wisdom and modern AI-powered insights 
            for your spiritual journey and life guidance
          </p>
        </div>

        {/* Value Propositions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center p-6">
            <CardContent className="pt-6">
              <Shield className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Accurate Calculations</h3>
              <p className="text-sm text-gray-600">Swiss Ephemeris precision for authentic Vedic astrology</p>
            </CardContent>
          </Card>
          
          <Card className="text-center p-6">
            <CardContent className="pt-6">
              <Zap className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">AI-Powered Insights</h3>
              <p className="text-sm text-gray-600">Advanced AI analysis combined with traditional wisdom</p>
            </CardContent>
          </Card>
          
          <Card className="text-center p-6">
            <CardContent className="pt-6">
              <Heart className="h-8 w-8 text-red-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Personalized Guidance</h3>
              <p className="text-sm text-gray-600">Tailored remedies and spiritual guidance for your journey</p>
            </CardContent>
          </Card>
          
          <Card className="text-center p-6">
            <CardContent className="pt-6">
              <Star className="h-8 w-8 text-yellow-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Expert Support</h3>
              <p className="text-sm text-gray-600">Access to experienced astrologers and spiritual guides</p>
            </CardContent>
          </Card>
        </div>

        {/* Subscription Plans */}
        <SubscriptionPlans />

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h3>
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h4 className="font-semibold mb-2">Can I cancel my subscription anytime?</h4>
                <p className="text-gray-600">Yes, you can cancel your subscription at any time. You'll continue to have access to premium features until the end of your billing period.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h4 className="font-semibold mb-2">What's included in the free trial?</h4>
                <p className="text-gray-600">All paid plans include a 7-day free trial with full access to premium features. No credit card required to start.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h4 className="font-semibold mb-2">How accurate are the calculations?</h4>
                <p className="text-gray-600">We use Swiss Ephemeris data, the same astronomical calculations used by professional astrologers worldwide, ensuring the highest accuracy.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h4 className="font-semibold mb-2">Can I upgrade or downgrade my plan?</h4>
                <p className="text-gray-600">Yes, you can change your plan at any time through the customer portal. Changes take effect at the next billing cycle.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
