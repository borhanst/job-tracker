import { NextResponse } from 'next/server';
import { scrapeJobDescription } from '@/lib/scraper';
import { scrapeRequestSchema, validateWithSchema } from '@/lib/validation';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = validateWithSchema(scrapeRequestSchema, body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: validation.formErrors[0] ?? validation.fieldErrors.url?.[0] ?? 'A valid URL is required',
          fieldErrors: validation.fieldErrors,
          rawText: null,
        },
        { status: 400 }
      );
    }

    const result = await scrapeJobDescription(validation.data.url);
    
    // Return 200 even if scraping failed so the client can handle the fallback gracefully
    return NextResponse.json(result);
    
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error', rawText: null },
      { status: 500 }
    );
  }
}
