import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getModelInstance } from '@/lib/ai/provider';
import { generateTailoredCV } from '@/lib/ai/generate';
import { getApplicationById } from '@/lib/jobs/actions';
import { getFullProfile } from '@/lib/profile/actions';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { applicationId } = await request.json();

    if (!applicationId) {
      return NextResponse.json({ error: 'Application ID is required' }, { status: 400 });
    }

    const [application, profile] = await Promise.all([
      getApplicationById(applicationId),
      getFullProfile()
    ]);

    if (!application || !profile) {
      return NextResponse.json({ error: 'Application or Profile not found' }, { status: 404 });
    }

    const model = await getModelInstance(user.id);
    const tailoredData = await generateTailoredCV(application.job_data, profile, model);

    // Save the generated document to the database
    const { data: doc, error } = await supabase
      .from('generated_documents')
      .insert({
        application_id: applicationId,
        user_id: user.id,
        type: 'cv',
        content: tailoredData
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving document:', error);
    }

    return NextResponse.json({
      success: true,
      tailoredData,
      profile,
      application
    });

  } catch (error: any) {
    console.error('CV Generation error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
