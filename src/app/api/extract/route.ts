import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getModelInstance } from '@/lib/ai/provider';
import { extractJobData, computeMatchScore } from '@/lib/ai/extract';
import { getFullProfile } from '@/lib/profile/actions';
import { extractRequestSchema, validateWithSchema } from '@/lib/validation';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validation = validateWithSchema(extractRequestSchema, body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: validation.formErrors[0] ?? validation.fieldErrors.rawText?.[0] ?? 'Raw text is required',
          fieldErrors: validation.fieldErrors,
        },
        { status: 400 },
      );
    }

    // Get the model instance based on user settings
    const model = await getModelInstance(user.id);

    // 1. Extract job data
    const jobData = await extractJobData(validation.data.rawText, model);

    // 2. Fetch profile to compute match score
    const profile = await getFullProfile();
    
    // 3. Compute match score
    const matchScore = await computeMatchScore(jobData, profile, model);

    return NextResponse.json({
      success: true,
      jobData,
      matchScore
    });

  } catch (error: any) {
    console.error('Extraction error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
