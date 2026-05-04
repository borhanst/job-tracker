import { NextResponse } from 'next/server';
import { scrapeJobDescription } from '@/lib/scraper';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { success: false, error: 'A valid URL is required', rawText: null },
        { status: 400 }
      );
    }

    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid URL format', rawText: null },
        { status: 400 }
      );
    }

    const result = await scrapeJobDescription(url);
    
    // Return 200 even if scraping failed so the client can handle the fallback gracefully
    return NextResponse.json(result);
    
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error', rawText: null },
      { status: 500 }
    );
  }
}
