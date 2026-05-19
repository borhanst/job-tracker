# Applynexis — AI-Powered Job Application Tracker

> Turn any job listing into a tracked application with an AI-tailored CV in minutes.

Applynexis is a full-stack web application that helps job seekers capture job descriptions, extract structured data with AI, track applications through a visual pipeline, and generate tailored CVs and cover letters — all in one place.

## Features

- **Job Description Capture** — Paste a URL for auto-scraping, paste text manually, or use the browser extension to capture selected JD sections from any page
- **AI-Powered Extraction** — Automatically extracts company, title, location, salary, skills, responsibilities, and more from raw JD text
- **Match Score** — AI-calculated percentage (0–100%) estimating how well your profile aligns with each job
- **Application Pipeline** — Track applications through stages: Saved → Applied → Phone Screen → Interview → Offer → Accepted / Rejected / Withdrawn
- **Tailored CV Generation** — AI rewrites your master profile to match each specific JD, with live PDF preview and download
- **CV Builder Studio** — Edit, reorder, hide sections, switch layouts, and manage CV version snapshots per application
- **Cover Letter Generation** — AI-written, inline-editable, exportable as PDF or plain text
- **Rich User Profile** — Work experience, education, skills (with proficiency), projects, certifications, and languages
- **Bring Your Own AI** — Choose from Gemini, OpenAI, Anthropic, Groq, or self-hosted Ollama; API keys encrypted at rest
- **Dashboard Analytics** — Application counts, stage distribution, activity over time, average match score, upcoming follow-ups
- **Dark/Light Mode** — Full theming with CSS variables
- **Browser Extension** — Chrome extension for capturing JD sections from pages that block server-side scraping

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Database & Auth** | Supabase (Postgres + RLS + Auth) |
| **AI Framework** | Vercel AI SDK |
| **AI Providers** | Google Gemini, OpenAI, Anthropic, Groq, Ollama |
| **PDF Generation** | @react-pdf/renderer |
| **Web Scraping** | Cheerio + native fetch (server-side) |
| **Charts** | Recharts |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **Validation** | Zod |
| **Encryption** | CryptoJS |
| **Testing** | Vitest |
| **Styling** | Vanilla CSS with CSS variables |

## Project Structure

```
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (auth)/               # Login & Register routes
│   │   ├── (app)/                # Protected app routes
│   │   │   ├── dashboard/        # Analytics dashboard
│   │   │   ├── profile/          # Master profile management
│   │   │   ├── jobs/add/         # Add job / JD capture flow
│   │   │   ├── applications/     # Application list, detail, CV builder
│   │   │   ├── settings/         # AI provider & API key settings
│   │   │   └── cv-builder/       # CV Builder Studio
│   │   ├── onboarding/           # Post-registration profile setup
│   │   └── page.tsx              # Landing page
│   ├── components/
│   │   ├── auth/                 # Auth form components
│   │   ├── landing/              # Landing page sections (Hero, Features, CVMorph)
│   │   ├── layout/               # AppShell, Sidebar, ProtectedPage
│   │   └── onboarding/           # Onboarding flow
│   ├── lib/
│   │   ├── ai/                   # AI extraction, generation, provider factory
│   │   ├── cv/                   # CV actions, Professional ATS layout
│   │   ├── jobs/                 # Job actions, handoff logic
│   │   ├── profile/              # Profile actions, completion scoring
│   │   ├── dashboard/            # Dashboard analytics actions
│   │   ├── settings/             # Settings actions, API key encryption
│   │   ├── scraper/              # JD scraper (Cheerio-based)
│   │   ├── supabase/             # Supabase client (client, server, middleware)
│   │   └── validation/           # Zod schemas & validation utilities
│   └── proxy.ts                  # Route proxy configuration
├── extension/
│   └── browser-jd-capture/       # Chrome extension (Manifest V3)
│       ├── manifest.json
│       ├── background.js
│       ├── content.js
│       └── popup.js
├── supabase/
│   └── migrations/               # Database migration SQL files
├── docs/
│   ├── PRD.md                    # Product Requirements Document
│   ├── adr/                      # Architecture Decision Records
│   ├── issues/                   # Issue specifications & PRDs
│   └── agents/                   # Agent configuration docs
└── public/                       # Static assets
```

## Getting Started

### Prerequisites

- Node.js 20+
- A Supabase project (free tier works)
- At least one AI provider API key (Gemini, OpenAI, Anthropic, Groq, or self-hosted Ollama)

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd job-apply-tracker
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your credentials:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# AI API Keys (at least one required)
GOOGLE_GENERINI_API_KEY=
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GROQ_API_KEY=

# Ollama (optional, for self-hosted models)
OLLAMA_BASE_URL=http://localhost:11434

# Encryption secret for stored API keys (min 32 chars)
ENCRYPTION_SECRET=your-32-char-encryption-secret
```

4. **Run Supabase migrations**

Apply the SQL migrations in `supabase/migrations/` to your Supabase database in order:

```
20240504000000_initial_schema.sql
20260505000000_update_gemini_model_defaults.sql
20260505010000_add_profile_completion_fields.sql
20260505020000_add_provider_models.sql
20260505030000_add_jd_handoffs.sql
20260507010000_add_cv_versions.sql
20260507110000_add_ollama_provider.sql
```

You can run these via the Supabase dashboard SQL editor or the Supabase CLI:

```bash
npx supabase db push
```

5. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Installing the Browser Extension

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (top right)
3. Click **Load unpacked** and select `extension/browser-jd-capture/`
4. The extension icon appears in your toolbar. Visit any job listing, select text, and use "Add Selection" from the context menu or extension panel.

> The extension relies on your web app session — you must be logged into Applynexis in the same browser.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run test` | Run test suite with Vitest |

## Database Schema

| Table | Purpose |
|---|---|
| `profiles` | User personal info and professional summary |
| `work_experiences` | Work history entries |
| `educations` | Education entries |
| `skills` | Skills with proficiency levels |
| `projects` | Personal/project entries |
| `certifications` | Certifications |
| `languages` | Language proficiencies |
| `applications` | Job applications with JD data, status, match score |
| `generated_documents` | Generated CVs and cover letters per application |
| `user_settings` | AI provider selection and encrypted API keys |
| `jd_handoffs` | Short-lived records from browser extension captures |
| `cv_versions` | Saved CV states independent of master profile |

All tables use Row Level Security (RLS) — users can only access their own data.

## AI Provider Configuration

After signing up, navigate to **Settings** to configure your AI provider:

1. Select a provider (Gemini, OpenAI, Anthropic, Groq, or Ollama)
2. Enter your API key (encrypted before storage)
3. Choose a specific model within the provider
4. Test the connection before saving

You can switch providers at any time. All AI modules use a factory pattern (`getModelInstance`) — they never hard-code a provider.

## Architecture Highlights

- **Provider-agnostic AI** — All AI modules accept a model instance via the Vercel AI SDK, making provider swaps transparent
- **Server-side only scraping** — The JD scraper runs exclusively on the server; no client-side scraping logic
- **Encrypted API keys** — User API keys are encrypted with CryptoJS before storage in Supabase
- **Structured AI output** — AI extraction uses Zod schemas with `generateObject` for reliable structured data
- **JD Handoffs** — Browser extension creates short-lived (30 min) handoff records consumed by the Add Job flow
- **CV Version Snapshots** — Edited CV content is stored independently from the master profile, per application
- **Validation layer** — Zod schemas centralize validation across all modules (auth, profile, jobs, settings, handoffs, onboarding)

## Testing

Tests focus on external behavior, not implementation details. Run the full suite:

```bash
npm run test
```

Tested modules include:
- JD Scraper (URL → raw text extraction)
- AI Extraction & Match Score
- Status transition validation
- AI provider settings
- CV generation output structure
- Profile, auth, settings, onboarding validation schemas

## Documentation

| Document | Location |
|---|---|
| Product Requirements | `docs/PRD.md` |
| Domain Language | `CONTEXT.md` |
| Architecture Decisions | `docs/adr/` |
| Issue Specifications | `docs/issues/` |
| Agent Configuration | `docs/agents/` |
| Design Review | `docs/reviews/` |

## Out of Scope (v1)

- Email reminders / push notifications
- Fully automatic browser extension capture (requires user selection)
- Team / collaborative features
- Mobile native apps
- DOCX export (PDF only)
- Job board API integrations (scraping only)
- Interview prep AI

## License

Private — All rights reserved.
