'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, 
  Cpu, 
  BarChart3, 
  Zap, 
  Layout, 
  Shield 
} from 'lucide-react';

const features = [
  {
    title: "Global Scraping",
    desc: "Import job descriptions from any URL with a single click. No manual entry needed.",
    icon: Globe,
    color: "from-blue-500 to-blue-600"
  },
  {
    title: "AI Analysis",
    desc: "Advanced neural networks extract titles, salaries, skills, and hidden requirements.",
    icon: Cpu,
    color: "from-purple-500 to-purple-600"
  },
  {
    title: "Match Scoring",
    desc: "Know your odds. Get an instant score based on how your profile fits the job.",
    icon: BarChart3,
    color: "from-emerald-500 to-emerald-600"
  },
  {
    title: "Multi-AI Engine",
    desc: "Harness the power of Gemini, GPT-4, and Claude to generate world-class CVs.",
    icon: Zap,
    color: "from-amber-500 to-amber-600"
  },
  {
    title: "Smart Tracking",
    desc: "A beautiful Kanban board to manage every stage of your application pipeline.",
    icon: Layout,
    color: "from-indigo-500 to-indigo-600"
  },
  {
    title: "Secure & Private",
    desc: "Your data and API keys are encrypted at rest. You maintain 100% control.",
    icon: Shield,
    color: "from-rose-500 to-rose-600"
  }
];

export default function Features() {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold mb-4">The ultimate job seeker's <span className="text-gradient">toolkit.</span></h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto text-lg">Built with cutting-edge AI to automate your search and maximize your success rate.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-slate-950 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:shadow-blue-500/5 transition-all group"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center text-white mb-6 shadow-lg shadow-inherit/20 group-hover:scale-110 transition-transform`}>
                <f.icon size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">{f.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
