import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const cleanText = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const snapshot = body?.snapshot;

    if (!snapshot || typeof snapshot !== 'object') {
      return NextResponse.json({ success: false, error: 'Snapshot is required' }, { status: 400 });
    }

    const versionId = cleanText(body?.id);
    const applicationId = cleanText(body?.applicationId) || null;
    const hiddenSections = Array.isArray(body?.hiddenSections) ? body.hiddenSections : [];
    const template = cleanText(snapshot?.template) || 'professional-ats';
    const name = cleanText(body?.name) || null;

    const payload = {
      user_id: user.id,
      application_id: applicationId,
      name,
      template,
      content: snapshot,
      section_order: Array.isArray(snapshot?.section_order) ? snapshot.section_order : [],
      section_visibility: { hidden_sections: hiddenSections },
    };

    if (versionId) {
      const { data, error } = await supabase
        .from('cv_versions')
        .update(payload)
        .eq('id', versionId)
        .eq('user_id', user.id)
        .select('*')
        .single();

      if (error) {
        console.error('Error updating CV version:', error);
        return NextResponse.json({ success: false, error: 'Failed to update CV version' }, { status: 500 });
      }

      return NextResponse.json({ success: true, version: data });
    }

    const { data, error } = await supabase
      .from('cv_versions')
      .insert(payload)
      .select('*')
      .single();

    if (error) {
      console.error('Error creating CV version:', error);
      return NextResponse.json({ success: false, error: 'Failed to save CV version' }, { status: 500 });
    }

    return NextResponse.json({ success: true, version: data });
  } catch (error: any) {
    console.error('CV version persistence error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Internal server error' },
      { status: 500 },
    );
  }
}
