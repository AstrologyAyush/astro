-- Enhanced AI Usage Tracking and Model Fine-tuning Infrastructure

-- Create AI interactions tracking table
CREATE TABLE IF NOT EXISTS public.ai_interactions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id text NOT NULL,
  interaction_type text NOT NULL, -- 'gemini_kundali', 'kundali_ai', 'karmic_analysis', 'rishi_chat'
  input_data jsonb NOT NULL, -- User's input/query
  output_data jsonb, -- AI's response
  kundali_context jsonb, -- Birth chart data used
  performance_metrics jsonb, -- Response time, token usage, etc.
  user_feedback jsonb, -- Rating, helpful/not helpful, corrections
  model_version text DEFAULT 'gemini-1.5-flash-latest',
  processing_time_ms integer,
  token_count integer,
  error_logs text,
  quality_score decimal(3,2), -- AI response quality assessment
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on AI interactions
ALTER TABLE public.ai_interactions ENABLE ROW LEVEL SECURITY;

-- RLS policies for AI interactions
CREATE POLICY "Users can view their own AI interactions"
ON public.ai_interactions
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own AI interactions"
ON public.ai_interactions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own AI interactions"
ON public.ai_interactions
FOR UPDATE
USING (auth.uid() = user_id);

-- System can manage all interactions for analytics
CREATE POLICY "System can manage AI interactions for analytics"
ON public.ai_interactions
FOR ALL
USING (true);

-- Create AI model performance tracking
CREATE TABLE IF NOT EXISTS public.ai_model_metrics (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  model_name text NOT NULL,
  model_version text NOT NULL,
  date_tracked date DEFAULT CURRENT_DATE,
  total_requests integer DEFAULT 0,
  successful_requests integer DEFAULT 0,
  failed_requests integer DEFAULT 0,
  average_response_time_ms integer DEFAULT 0,
  average_quality_score decimal(4,2) DEFAULT 0,
  user_satisfaction_rate decimal(4,2) DEFAULT 0,
  top_interaction_types text[] DEFAULT '{}',
  common_errors text[] DEFAULT '{}',
  performance_data jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(model_name, model_version, date_tracked)
);

-- Enable RLS on model metrics (admin only)
ALTER TABLE public.ai_model_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view model metrics"
ON public.ai_model_metrics
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'owner'::app_role));

-- Create AI fine-tuning data preparation table
CREATE TABLE IF NOT EXISTS public.ai_training_data (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  interaction_id uuid REFERENCES public.ai_interactions(id) ON DELETE CASCADE,
  input_prompt text NOT NULL,
  expected_output text NOT NULL,
  actual_output text NOT NULL,
  quality_rating integer CHECK (quality_rating >= 1 AND quality_rating <= 5),
  correction_applied text,
  training_category text NOT NULL, -- 'personality', 'career', 'relationships', 'health', 'spiritual', 'timing'
  birth_chart_features jsonb, -- Key chart features for context
  user_demographic jsonb, -- Age, location, etc. (anonymized)
  is_approved_for_training boolean DEFAULT false,
  approved_by uuid REFERENCES auth.users(id),
  approved_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on training data
ALTER TABLE public.ai_training_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can manage training data"
ON public.ai_training_data
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'owner'::app_role));

-- Create user AI preferences tracking
CREATE TABLE IF NOT EXISTS public.user_ai_preferences (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  preferred_language text DEFAULT 'en',
  preferred_analysis_depth text DEFAULT 'detailed', -- 'brief', 'detailed', 'comprehensive'
  preferred_communication_style text DEFAULT 'professional', -- 'professional', 'friendly', 'spiritual'
  topics_of_interest text[] DEFAULT '{}', -- ['career', 'relationships', 'health', 'spirituality', 'timing']
  feedback_frequency text DEFAULT 'occasional', -- 'never', 'occasional', 'frequent'
  privacy_level text DEFAULT 'standard', -- 'minimal', 'standard', 'full'
  ai_interaction_history jsonb DEFAULT '{}',
  learning_preferences jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on user AI preferences
ALTER TABLE public.user_ai_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own AI preferences"
ON public.user_ai_preferences
FOR ALL
USING (auth.uid() = user_id);

-- Create AI feedback and improvement tracking
CREATE TABLE IF NOT EXISTS public.ai_feedback (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  interaction_id uuid REFERENCES public.ai_interactions(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  feedback_type text NOT NULL, -- 'rating', 'correction', 'suggestion', 'report'
  rating integer CHECK (rating >= 1 AND rating <= 5),
  feedback_text text,
  suggested_improvement text,
  category text, -- 'accuracy', 'relevance', 'clarity', 'cultural_sensitivity', 'other'
  is_resolved boolean DEFAULT false,
  resolved_by uuid REFERENCES auth.users(id),
  resolution_notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on AI feedback
ALTER TABLE public.ai_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own AI feedback"
ON public.ai_feedback
FOR ALL
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all AI feedback"
ON public.ai_feedback
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'owner'::app_role));

-- Create indexes for better performance
CREATE INDEX idx_ai_interactions_user_id ON public.ai_interactions(user_id);
CREATE INDEX idx_ai_interactions_type ON public.ai_interactions(interaction_type);
CREATE INDEX idx_ai_interactions_created_at ON public.ai_interactions(created_at);
CREATE INDEX idx_ai_interactions_session_id ON public.ai_interactions(session_id);

CREATE INDEX idx_ai_model_metrics_date ON public.ai_model_metrics(date_tracked);
CREATE INDEX idx_ai_model_metrics_model ON public.ai_model_metrics(model_name, model_version);

CREATE INDEX idx_ai_training_data_category ON public.ai_training_data(training_category);
CREATE INDEX idx_ai_training_data_approved ON public.ai_training_data(is_approved_for_training);

CREATE INDEX idx_ai_feedback_interaction ON public.ai_feedback(interaction_id);
CREATE INDEX idx_ai_feedback_type ON public.ai_feedback(feedback_type);

-- Create function to update AI interaction metrics
CREATE OR REPLACE FUNCTION public.update_ai_metrics()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update daily metrics for the model
  INSERT INTO public.ai_model_metrics (
    model_name,
    model_version,
    date_tracked,
    total_requests,
    successful_requests,
    failed_requests,
    average_response_time_ms
  )
  VALUES (
    COALESCE(NEW.model_version, 'gemini-1.5-flash-latest'),
    COALESCE(NEW.model_version, 'gemini-1.5-flash-latest'),
    CURRENT_DATE,
    1,
    CASE WHEN NEW.error_logs IS NULL THEN 1 ELSE 0 END,
    CASE WHEN NEW.error_logs IS NOT NULL THEN 1 ELSE 0 END,
    COALESCE(NEW.processing_time_ms, 0)
  )
  ON CONFLICT (model_name, model_version, date_tracked)
  DO UPDATE SET
    total_requests = ai_model_metrics.total_requests + 1,
    successful_requests = ai_model_metrics.successful_requests + CASE WHEN NEW.error_logs IS NULL THEN 1 ELSE 0 END,
    failed_requests = ai_model_metrics.failed_requests + CASE WHEN NEW.error_logs IS NOT NULL THEN 1 ELSE 0 END,
    average_response_time_ms = (ai_model_metrics.average_response_time_ms + COALESCE(NEW.processing_time_ms, 0)) / 2,
    updated_at = now();

  RETURN NEW;
END;
$$;

-- Create trigger to update metrics
CREATE TRIGGER ai_interaction_metrics_trigger
  AFTER INSERT ON public.ai_interactions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_ai_metrics();

-- Create function to generate training data from high-quality interactions
CREATE OR REPLACE FUNCTION public.generate_training_data_from_interaction(interaction_uuid uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  interaction_record public.ai_interactions%ROWTYPE;
  training_category text;
BEGIN
  -- Get the interaction
  SELECT * INTO interaction_record FROM public.ai_interactions WHERE id = interaction_uuid;

  IF NOT FOUND THEN
    RETURN false;
  END IF;

  -- Only process high-quality interactions
  IF interaction_record.quality_score < 4.0 THEN
    RETURN false;
  END IF;

  -- Determine training category based on interaction type
  training_category := CASE
    WHEN interaction_record.interaction_type = 'gemini_kundali' THEN 'personality'
    WHEN interaction_record.interaction_type = 'karmic_analysis' THEN 'career'
    WHEN interaction_record.interaction_type = 'rishi_chat' THEN 'spiritual'
    ELSE 'general'
  END;

  -- Insert into training data
  INSERT INTO public.ai_training_data (
    interaction_id,
    input_prompt,
    expected_output,
    actual_output,
    quality_rating,
    training_category,
    birth_chart_features,
    user_demographic
  ) VALUES (
    interaction_record.id,
    interaction_record.input_data::text,
    interaction_record.output_data::text,
    interaction_record.output_data::text,
    CEIL(interaction_record.quality_score),
    training_category,
    interaction_record.kundali_context,
    jsonb_build_object(
      'interaction_type', interaction_record.interaction_type,
      'model_version', interaction_record.model_version
    )
  );

  RETURN true;
END;
$$;
