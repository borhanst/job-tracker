import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getModelInstance } from '@/lib/ai/provider';
import { generateCoverLetter } from '@/lib/ai/generate';
import { getAiErrorMessage } from '@/lib/ai/errors';
import { getApplicationById } from '@/lib/jobs/actions';
import { getFullProfile } from '@/lib/profile/actions';
import { generationRequestSchema, validateWithSchema } from '@/lib/validation';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validation = validateWithSchema(generationRequestSchema, body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: validation.formErrors[0] ?? validation.fieldErrors.applicationId?.[0] ?? 'Application ID is required',
          fieldErrors: validation.fieldErrors,
        },
        { status: 400 },
      );
    }
    const { applicationId } = validation.data;

    const [application, profile] = await Promise.all([
      getApplicationById(applicationId),
      getFullProfile()
    ]);

    if (!application || !profile) {
      return NextResponse.json({ error: 'Application or Profile not found' }, { status: 404 });
    }

    const model = await getModelInstance(user.id);
    const content = await generateCoverLetter(application.job_data, profile, model);

    // Save the generated document to the database
    const { data: doc, error } = await supabase
      .from('generated_documents')
      .insert({
        application_id: applicationId,
        user_id: user.id,
        type: 'cover_letter',
        content: { text: content }
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving document:', error);
    }

    return NextResponse.json({
      success: true,
      content
    });

  } catch (error: any) {
    console.error('Cover Letter Generation error:', error);
    return NextResponse.json(
      { success: false, error: getAiErrorMessage(error) },
      { status: 500 }
    );
  }
}
