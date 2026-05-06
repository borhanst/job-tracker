import { NextResponse } from 'next/server';
import { loadAndConsumeJdHandoff } from '@/lib/jobs/handoffs';
import { createClient } from '@/lib/supabase/server';

function corsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get('origin');

  if (!origin) return {};

  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    Vary: 'Origin',
  };
}

export async function OPTIONS(request: Request) {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(request),
  });
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
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

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'JD Handoff ID is required' },
        { status: 400, headers },
      );
    }

    const result = await loadAndConsumeJdHandoff(id, user.id);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: result.status, headers },
      );
    }

    return NextResponse.json(result, { headers });
  } catch (error: any) {
    console.error('JD Handoff load error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500, headers },
    );
  }
}
