import { NextResponse } from 'next/server';
import { createJdHandoff } from '@/lib/jobs/handoffs';
import { createClient } from '@/lib/supabase/server';
import { jdHandoffCreateSchema, validateWithSchema } from '@/lib/validation';

function corsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get('origin');

  if (!origin) return {};

  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    Vary: 'Origin',
  };
}

export async function OPTIONS(request: Request) {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(request),
  });
}

export async function POST(request: Request) {
  const headers = corsHeaders(request);

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401, headers },
      );
    }

    const body = await request.json();
    const validation = validateWithSchema(jdHandoffCreateSchema, body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error:
            validation.formErrors[0] ??
            validation.fieldErrors.url?.[0] ??
            validation.fieldErrors.sections?.[0] ??
            'Invalid JD Handoff payload',
          fieldErrors: validation.fieldErrors,
        },
        { status: 400, headers },
      );
    }

    const handoff = await createJdHandoff(user.id, validation.data);

    return NextResponse.json(
      {
        success: true,
        handoff,
        openUrl: `/jobs/add?handoff=${handoff.id}`,
      },
      { headers },
    );
  } catch (error: any) {
    console.error('JD Handoff create error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500, headers },
    );
  }
}
