import * as cheerio from 'cheerio';

export interface ScrapeResult {
  success: boolean;
  rawText: string | null;
  error: string | null;
}

export async function scrapeJobDescription(url: string): Promise<ScrapeResult> {
  try {
    const parsedUrl = new URL(url);
    
    // Check for definitely blocked domains
    if (parsedUrl.hostname.includes('linkedin.com')) {
      return {
        success: false,
        rawText: null,
        error: "LinkedIn blocks automated scraping. Please copy and paste the job description manually.",
      };
    }

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      next: { revalidate: 3600 } // Cache for an hour to avoid spamming job boards
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Remove script, style, and navigation elements
    $('script, style, nav, footer, header, noscript, iframe, svg').remove();

    let mainContent = '';

    // Strategy 1: Look for known job board structures
    if (parsedUrl.hostname.includes('greenhouse.io')) {
      mainContent = $('#main').text() || $('#app').text();
    } else if (parsedUrl.hostname.includes('lever.co')) {
      mainContent = $('.content-wrapper').text() || $('.posting-page').text();
    } else if (parsedUrl.hostname.includes('workday.com')) {
      // Workday is often an SPA, might not work without a headless browser
      // but we try to grab any main container
      mainContent = $('[data-automation-id="jobPostingDescription"]').text() || $('main').text();
    } 
    // Strategy 2: Look for common generic semantic tags
    else if ($('main').length > 0) {
      mainContent = $('main').text();
    } else if ($('article').length > 0) {
      mainContent = $('article').text();
    } else if ($('#content, .content, #main, .main, [role="main"]').length > 0) {
      mainContent = $('#content, .content, #main, .main, [role="main"]').text();
    } 
    // Strategy 3: Fallback to the whole body
    else {
      mainContent = $('body').text();
    }

    // Clean up the text: remove excess whitespace and empty lines
    const cleanText = mainContent
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText || cleanText.length < 100) {
      return {
        success: false,
        rawText: null,
        error: "Could not extract enough text from the page. Please copy and paste manually.",
      };
    }

    return {
      success: true,
      rawText: cleanText,
      error: null,
    };

  } catch (error: any) {
    console.error('Scraping error:', error);
    return {
      success: false,
      rawText: null,
      error: error.message || "An unknown error occurred while trying to scrape the URL.",
    };
  }
}
