
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Crown } from "lucide-react";
import { useSubscription, SubscriptionTier } from '@/hooks/useSubscription';

const SubscriptionPlans = () => {
  const { subscriptionTier, createCheckout, isLoading } = useSubscription();

  const plans = [
    {
      tier: 'free' as SubscriptionTier,
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started',
      icon: <Star className="h-5 w-5" />,
      features: [
        '3 Kundali calculations per month',
        'Basic horoscope readings',
        'Simple remedies',
        'Basic personality test',
        'Community support'
      ],
      limitations: [
        'Limited AI consultations',
        'Standard PDF reports',
        'No priority support'
      ]
    },
    {
      tier: 'basic' as SubscriptionTier,
      name: 'Basic',
      price: '$9.99',
      period: 'per month',
      description: 'Great for regular users',
      icon: <Check className="h-5 w-5" />,
      popular: false,
      features: [
        '20 Kundali calculations per month',
        'Enhanced AI consultations',
        'Detailed remedies with gemstone recommendations',
        'Advanced personality insights',
        'Email support',
        'PDF report downloads',
        'Transit analysis'
      ],
      limitations: [
        'Limited premium features',
        'Standard response time'
      ]
    },
    {
      tier: 'pro' as SubscriptionTier,
      name: 'Pro',
      price: '$19.99',
      period: 'per month',
      description: 'Perfect for enthusiasts',
      icon: <Zap className="h-5 w-5" />,
      popular: true,
      features: [
        'Unlimited Kundali calculations',
        'Priority AI consultations',
        'Complete divisional charts analysis',
        'Comprehensive remedies with timing',
        'Karma alignment reports',
        'Priority email support',
        'Advanced PDF reports with charts',
        'Relationship compatibility analysis',
        'Career guidance consultations'
      ],
      limitations: [
        'Some premium features limited'
      ]
    },
    {
      tier: 'premium' as SubscriptionTier,
      name: 'Premium',
      price: '$39.99',
      period: 'per month',
      description: 'For serious practitioners',
      icon: <Crown className="h-5 w-5" />,
      features: [
        'Everything in Pro',
        'Unlimited AI guru consultations',
        'Personalized spiritual guidance',
        'Custom remedy recommendations',
        'Live consultation booking',
        'White-label reports',
        'API access for developers',
        'Dedicated account manager',
        '24/7 priority support',
        'Advanced karmic analysis'
      ],
      limitations: []
    }
  ];

  const handlePlanSelect = async (tier: SubscriptionTier) => {
    if (tier === 'free') return;
    await createCheckout(tier);
  };

  return (
    <div className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Choose Your Spiritual Journey
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Unlock deeper insights into your destiny with our comprehensive astrology and spiritual guidance plans
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <Card
              key={plan.tier}
              className={`relative ${
                plan.popular 
                  ? 'border-2 border-blue-500 shadow-lg transform scale-105' 
                  : 'border border-gray-200'
              } ${
                subscriptionTier === plan.tier 
                  ? 'ring-2 ring-green-500 bg-green-50' 
                  : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-500 text-white px-3 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              {subscriptionTier === plan.tier && (
                <div className="absolute -top-3 right-4">
                  <Badge className="bg-green-500 text-white px-3 py-1">
                    Current Plan
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-2">
                <div className="flex justify-center mb-2">
                  <div className={`p-3 rounded-full ${
                    plan.popular ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {plan.icon}
                  </div>
                </div>
                <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                <div className="text-3xl font-bold text-gray-900">
                  {plan.price}
                  <span className="text-sm font-normal text-gray-600">
                    /{plan.period}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2">{plan.description}</p>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {plan.limitations.length > 0 && (
                  <div className="pt-2 border-t">
                    <p className="text-xs text-gray-500 mb-2">Limitations:</p>
                    <div className="space-y-1">
                      {plan.limitations.map((limitation, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">{limitation}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Button
                  onClick={() => handlePlanSelect(plan.tier)}
                  disabled={isLoading || subscriptionTier === plan.tier}
                  className={`w-full mt-4 ${
                    plan.popular 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : subscriptionTier === plan.tier
                      ? 'bg-green-600 hover:bg-green-700'
                      : ''
                  }`}
                  variant={subscriptionTier === plan.tier ? 'default' : 'outline'}
                >
                  {subscriptionTier === plan.tier 
                    ? 'Current Plan' 
                    : plan.tier === 'free' 
                    ? 'Get Started' 
                    : `Upgrade to ${plan.name}`
                  }
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            All plans include our 7-day free trial. Cancel anytime. No hidden fees.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
