
/**
 * Supabase Integration for Enhanced Kundali Data Storage
 * Stores and retrieves comprehensive Kundali calculations and analyses
 */

import { supabase } from '@/integrations/supabase/client';
import { VedicKundaliResult } from './preciseVedicKundaliEngine';
import { EnhancedKundaliAnalysis } from './geminiKundaliAnalysis';

export interface StoredKundaliData {
  id: string;
  user_id: string;
  profile_id?: string;
  name: string;
  birth_data: any;
  vedic_calculations: VedicKundaliResult;
  gemini_analysis?: EnhancedKundaliAnalysis;
  accuracy_level: string;
  created_at: string;
  updated_at: string;
}

export async function saveEnhancedKundali(
  birthData: any,
  vedicResult: VedicKundaliResult,
  geminiAnalysis?: EnhancedKundaliAnalysis
): Promise<string | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.warn('No authenticated user found for saving Kundali');
      return null;
    }

    // Get user profile if exists
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    const kundaliData = {
      user_id: user.id,
      profile_id: profile?.id || null,
      name: birthData.fullName || birthData.name,
      birth_data: birthData,
      vedic_calculations: vedicResult,
      gemini_analysis: geminiAnalysis || null,
      accuracy_level: 'Swiss Ephemeris Precision - Traditional Vedic'
    };

    const { data, error } = await supabase
      .from('enhanced_kundali_reports')
      .insert(kundaliData)
      .select('id')
      .single();

    if (error) {
      console.error('Error saving enhanced Kundali:', error);
      return null;
    }

    console.log('✅ Enhanced Kundali saved successfully:', data.id);
    return data.id;

  } catch (error) {
    console.error('Error in saveEnhancedKundali:', error);
    return null;
  }
}

export async function getUserKundalis(userId?: string): Promise<StoredKundaliData[]> {
  try {
    let query = supabase
      .from('enhanced_kundali_reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    } else {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      query = query.eq('user_id', user.id);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching user Kundalis:', error);
      return [];
    }

    return data || [];

  } catch (error) {
    console.error('Error in getUserKundalis:', error);
    return [];
  }
}

export async function getKundaliById(id: string): Promise<StoredKundaliData | null> {
  try {
    const { data, error } = await supabase
      .from('enhanced_kundali_reports')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching Kundali by ID:', error);
      return null;
    }

    return data;

  } catch (error) {
    console.error('Error in getKundaliById:', error);
    return null;
  }
}

export async function updateKundaliAnalysis(
  id: string,
  geminiAnalysis: EnhancedKundaliAnalysis
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('enhanced_kundali_reports')
      .update({ 
        gemini_analysis: geminiAnalysis,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating Kundali analysis:', error);
      return false;
    }

    console.log('✅ Kundali analysis updated successfully');
    return true;

  } catch (error) {
    console.error('Error in updateKundaliAnalysis:', error);
    return false;
  }
}

export async function deleteKundali(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('enhanced_kundali_reports')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting Kundali:', error);
      return false;
    }

    console.log('✅ Kundali deleted successfully');
    return true;

  } catch (error) {
    console.error('Error in deleteKundali:', error);
    return false;
  }
}

export async function logCalculationAccuracy(
  kundaliId: string,
  accuracyMetrics: {
    calculationTime: number;
    algorithmVersion: string;
    ephemerisSource: string;
    precisionLevel: string;
  }
): Promise<void> {
  try {
    const { error } = await supabase
      .from('calculation_logs')
      .insert({
        kundali_id: kundaliId,
        accuracy_metrics: accuracyMetrics,
        timestamp: new Date().toISOString()
      });

    if (error) {
      console.error('Error logging calculation accuracy:', error);
    }

  } catch (error) {
    console.error('Error in logCalculationAccuracy:', error);
  }
}

// Enhanced query functions for analytics
export async function getKundaliStatistics(): Promise<{
  totalCalculations: number;
  averageAccuracy: string;
  mostCommonYogas: Array<{ name: string; count: number }>;
  dashaDistribution: Array<{ planet: string; count: number }>;
}> {
  try {
    const { data: calculations, error } = await supabase
      .from('enhanced_kundali_reports')
      .select('vedic_calculations');

    if (error || !calculations) {
      return {
        totalCalculations: 0,
        averageAccuracy: 'N/A',
        mostCommonYogas: [],
        dashaDistribution: []
      };
    }

    // Process statistics
    const totalCalculations = calculations.length;
    const yogaCounts: Record<string, number> = {};
    const dashaCounts: Record<string, number> = {};

    calculations.forEach(calc => {
      const vedic = calc.vedic_calculations as VedicKundaliResult;
      
      // Count yogas
      vedic.yogas?.forEach(yoga => {
        if (yoga.isActive) {
          yogaCounts[yoga.name] = (yogaCounts[yoga.name] || 0) + 1;
        }
      });

      // Count current dashas
      const currentDasha = vedic.dashas?.find(d => d.isActive);
      if (currentDasha) {
        dashaCounts[currentDasha.planet] = (dashaCounts[currentDasha.planet] || 0) + 1;
      }
    });

    const mostCommonYogas = Object.entries(yogaCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    const dashaDistribution = Object.entries(dashaCounts)
      .sort(([,a], [,b]) => b - a)
      .map(([planet, count]) => ({ planet, count }));

    return {
      totalCalculations,
      averageAccuracy: 'Swiss Ephemeris Level',
      mostCommonYogas,
      dashaDistribution
    };

  } catch (error) {
    console.error('Error getting Kundali statistics:', error);
    return {
      totalCalculations: 0,
      averageAccuracy: 'N/A',
      mostCommonYogas: [],
      dashaDistribution: []
    };
  }
}
