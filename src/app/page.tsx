import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  ClipboardList,
  FileSearch,
  FileText,
  KeyRound,
  LockKeyhole,
  PanelsTopLeft,
  ShieldCheck,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import Logo from "@/components/brand/Logo";
import styles from "./page.module.css";

const workflow = [
  {
    title: "Paste a JD URL",
    body: "Start with the job listing instead of another blank tracker row.",
    icon: FileSearch,
  },
  {
    title: "Review AI Extraction",
    body: "Company, role, skills, salary notes, and requirements become structured fields.",
    icon: Sparkles,
  },
  {
    title: "Generate a Tailored CV",
    body: "Your Master Profile is shaped into a focused CV for the role.",
    icon: FileText,
  },
  {
    title: "Track the next step",
    body: "Move the application through Saved, Applied, Interview, Offer, and beyond.",
    icon: ClipboardList,
  },
];

const features = [
  {
    title: "JD Scraper",
    body: "Capture raw job description text from a listing URL, with manual paste as a fallback.",
    icon: FileSearch,
  },
  {
    title: "AI Extraction",
    body: "Turn messy job text into the details you actually need to compare roles.",
    icon: WandSparkles,
  },
  {
    title: "Match Score",
    body: "See an AI estimate of how well your Master Profile aligns with the job.",
    icon: BarChart3,
  },
  {
    title: "Tailored CV",
    body: "Generate a job-specific CV that highlights the most relevant experience.",
    icon: FileText,
  },
  {
    title: "Application Pipeline",
    body: "Keep every role moving through a clear job-search workflow.",
    icon: PanelsTopLeft,
  },
  {
    title: "AI Provider Control",
    body: "Bring your own provider and keep usage under your account.",
    icon: KeyRound,
  },
];

const pipeline = ["Saved", "Applied", "Interview", "Offer"];

export default function RootPage() {
  return (
    <div className={styles.page}>
      <header className={styles.navWrap}>
        <nav className={styles.nav} aria-label="Primary navigation">
          <Link href="/" className={styles.brand} aria-label="Applynexis home">
            <Logo size={34} />
            <span>Applynexis</span>
          </Link>

          <div className={styles.navLinks}>
            <a href="#workflow">Workflow</a>
            <a href="#features">Features</a>
            <a href="#trust">Privacy</a>
          </div>

          <div className={styles.navActions}>
            <Link href="/login" className={styles.loginLink}>
              Login
            </Link>
            <Link href="/register" className={styles.smallCta}>
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      <main>
        <section className={styles.hero}>
          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <div className={styles.eyebrow}>
                <BriefcaseBusiness size={16} />
                <span>Built for high-volume job searches</span>
              </div>
              <h1>Turn any job listing into a tracked application with an AI-tailored CV.</h1>
              <p>
                Save the role, understand the fit, generate a focused CV, and keep the next
                step visible without rebuilding your process in a spreadsheet.
              </p>
              <div className={styles.heroActions}>
                <Link href="/register" className={styles.primaryCta}>
                  Get Started
                  <ArrowRight size={18} />
                </Link>
                <Link href="/login" className={styles.secondaryCta}>
                  Sign in
                </Link>
              </div>
              <div className={styles.proofRow} aria-label="Product capabilities">
                <span>JD Scraper</span>
                <span>AI Extraction</span>
                <span>Tailored CV</span>
              </div>
            </div>

            <div className={styles.heroScene} aria-label="Applynexis workflow preview">
              <div className={styles.sceneHeader}>
                <span>New application</span>
                <span className={styles.liveBadge}>AI ready</span>
              </div>

              <div className={styles.urlBar}>
                <FileSearch size={18} />
                <span>https://jobs.example.com/senior-product-engineer</span>
                <button type="button">Import</button>
              </div>

              <div className={styles.sceneGrid}>
                <div className={styles.extractionPanel}>
                  <div className={styles.panelTitle}>
                    <Sparkles size={16} />
                    <span>AI Extraction</span>
                  </div>
                  <dl>
                    <div>
                      <dt>Company</dt>
                      <dd>Northstar Labs</dd>
                    </div>
                    <div>
                      <dt>Role</dt>
                      <dd>Senior Product Engineer</dd>
                    </div>
                    <div>
                      <dt>Required skills</dt>
                      <dd>React, AI SDK, Postgres</dd>
                    </div>
                  </dl>
                </div>

                <div className={styles.scorePanel}>
                  <span>Match Score</span>
                  <strong>86%</strong>
                  <p>Strong profile overlap with product engineering and AI workflows.</p>
                </div>
              </div>

              <div className={styles.cvPreview}>
                <div>
                  <span className={styles.docLabel}>Tailored CV</span>
                  <h2>Product Engineer focused on AI-enabled workflows</h2>
                </div>
                <div className={styles.cvLines} aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
              </div>

              <div className={styles.pipeline} aria-label="Application Pipeline preview">
                {pipeline.map((stage, index) => (
                  <div key={stage} className={index === 1 ? styles.activeStage : undefined}>
                    <span>{stage}</span>
                    {index < pipeline.length - 1 ? <ChevronRight size={15} /> : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="workflow" className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.kicker}>Workflow</span>
            <h2>From listing to next step, without losing the thread.</h2>
            <p>
              Applynexis keeps the job description, fit signal, generated documents, and
              Application Pipeline in one connected flow.
            </p>
          </div>
          <div className={styles.workflowGrid}>
            {workflow.map((item, index) => (
              <article key={item.title} className={styles.workflowItem}>
                <div className={styles.stepNumber}>0{index + 1}</div>
                <item.icon size={22} />
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="features" className={styles.sectionAlt}>
          <div className={styles.sectionHeader}>
            <span className={styles.kicker}>Feature proof</span>
            <h2>The pieces that make a high-volume search manageable.</h2>
          </div>
          <div className={styles.featureGrid}>
            {features.map((feature) => (
              <article key={feature.title} className={styles.featureItem}>
                <feature.icon size={22} />
                <h3>{feature.title}</h3>
                <p>{feature.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="trust" className={styles.trustSection}>
          <div className={styles.trustCopy}>
            <span className={styles.kicker}>Privacy and control</span>
            <h2>Your search data should stay yours.</h2>
            <p>
              Applynexis is designed around private job-search data, encrypted API keys,
              and bring-your-own AI provider settings.
            </p>
          </div>
          <div className={styles.trustList}>
            <div>
              <ShieldCheck size={22} />
              <span>Row-level access patterns for private application data</span>
            </div>
            <div>
              <LockKeyhole size={22} />
              <span>API keys are treated as sensitive account settings</span>
            </div>
            <div>
              <Check size={22} />
              <span>Match Score is presented as an AI estimate, not a guarantee</span>
            </div>
          </div>
        </section>

        <section className={styles.ctaSection}>
          <div className={styles.ctaInner}>
            <span className={styles.kicker}>Start with one listing</span>
            <h2>Bring your next job description into focus.</h2>
            <p>
              Create an account, add a job listing, and let Applynexis organize the
              application around the role.
            </p>
            <Link href="/register" className={styles.primaryCta}>
              Get Started
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerBrand}>
          <Link href="/" className={styles.brand} aria-label="Applynexis home">
            <Logo size={32} />
            <span>Applynexis</span>
          </Link>
          <p>AI-assisted job tracking for people applying to many roles with care.</p>
          <div className={styles.socials}>
            <a href="#" aria-label="Applynexis on LinkedIn">
              <span aria-hidden="true">in</span>
            </a>
            <a href="#" aria-label="Applynexis on X">
              <span aria-hidden="true">X</span>
            </a>
            <a href="#" aria-label="Applynexis on Instagram">
              <span aria-hidden="true">IG</span>
            </a>
          </div>
        </div>

        <div className={styles.footerLinks}>
          <div>
            <h2>Product</h2>
            <a href="#features">Features</a>
            <a href="#workflow">Workflow</a>
            <a href="#trust">Privacy</a>
          </div>
          <div>
            <h2>Account</h2>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </div>
          <div>
            <h2>Legal</h2>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
