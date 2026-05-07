'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { 
  LayoutDashboard, 
  Briefcase, 
  PlusCircle, 
  FileText,
  UserCircle, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Sun,
  Moon,
  LogOut
} from 'lucide-react';
import Logo from '@/components/brand/Logo';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Applications', href: '/applications', icon: Briefcase },
  { name: 'Add Job', href: '/jobs/add', icon: PlusCircle },
  { name: 'CV Builder', href: '/cv-builder', icon: FileText },
  { name: 'Profile', href: '/profile', icon: UserCircle },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = savedTheme || systemTheme;
    
    setTheme(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <aside 
      className={`app-sidebar${isCollapsed ? ' app-sidebar--collapsed' : ''}`}
      aria-label="Primary navigation"
    >
      <div className="app-sidebar__brand">
        <Link href="/dashboard" className="app-sidebar__brand-link" aria-label="Applynexis dashboard">
          <Logo size={34} />
          <span className="app-sidebar__brand-text">Applynexis</span>
        </Link>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="app-sidebar__collapse"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <nav className="app-sidebar__nav">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`app-sidebar__item${isActive ? ' is-active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
              title={item.name}
            >
              <span className="app-sidebar__icon">
                <Icon size={20} />
              </span>
              <span className="app-sidebar__label">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="app-sidebar__footer">
        <button 
          onClick={toggleTheme}
          className="app-sidebar__item app-sidebar__button"
          title={theme === 'light' ? 'Dark Mode' : 'Light Mode'}
        >
          <span className="app-sidebar__icon">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </span>
          <span className="app-sidebar__label">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
        </button>
        
        <button 
          onClick={handleSignOut}
          className="app-sidebar__item app-sidebar__button app-sidebar__button--danger"
          title="Sign Out"
        >
          <span className="app-sidebar__icon">
            <LogOut size={20} />
          </span>
          <span className="app-sidebar__label">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
