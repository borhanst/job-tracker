import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

function resolveOllamaRootBaseUrl() {
  const rawBaseUrl = (process.env.OLLAMA_BASE_URL || 'http://localhost:11434').trim();
  const rootBaseUrl = rawBaseUrl.endsWith('/') ? rawBaseUrl.slice(0, -1) : rawBaseUrl;

  return rootBaseUrl.endsWith('/v1') ? rootBaseUrl.slice(0, -3) : rootBaseUrl;
}

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const endpoint = `${resolveOllamaRootBaseUrl()}/api/tags`;
    const response = await fetch(endpoint, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: 'Could not load installed Ollama models.' },
        { status: 502 },
      );
    }

    const payload = await response.json();
    const models = Array.isArray(payload?.models)
      ? payload.models
          .map((model: { name?: string }) => model?.name)
          .filter((name: string | undefined): name is string => Boolean(name))
      : [];

    return NextResponse.json({ success: true, models });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Could not load installed Ollama models.' },
      { status: 502 },
    );
  }
}
