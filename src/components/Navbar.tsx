import React, { useState } from 'react';
import { Copy, Check, FileDown, Menu, X } from 'lucide-react';
import { resumeData } from '../data/resumeData';
import { ThemeToggle } from './ThemeToggle';

export const Navbar: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(resumeData.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 border-b-2 border-border-muted bg-bg-dark/85 backdrop-blur-md">
      <div className="w-full px-6 md:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo - Keep lowercase, remove brackets */}
        <a href="#" className="font-mono text-theme-text font-bold text-lg flex items-center group">
          <span className="text-theme-text group-hover:underline">roshan.shukla</span>
          <span className="text-accent-teal font-semibold">()</span>
        </a>
 
        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#experience" className="text-xs uppercase tracking-widest font-mono text-theme-text-muted hover:text-theme-text transition-colors">Experience</a>
          <a href="#projects" className="text-xs uppercase tracking-widest font-mono text-theme-text-muted hover:text-theme-text transition-colors">Projects</a>
          <a href="#skills" className="text-xs uppercase tracking-widest font-mono text-theme-text-muted hover:text-theme-text transition-colors">Skills</a>
          <a href="#contact" className="text-xs uppercase tracking-widest font-mono text-theme-text-muted hover:text-theme-text transition-colors">Contact</a>
        </div>
 
        {/* Quick Actions (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />

          {/* Email Copy Button (90-degree corners, teal focus) */}
          <button
            onClick={handleCopyEmail}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-none border-2 border-border-muted bg-bg-card hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-mono text-theme-text-muted hover:text-theme-text transition-all active:scale-95 cursor-pointer"
            title="Copy email to clipboard"
          >
            {copied ? (
              <>
                <Check size={14} className="text-green-600" />
                <span className="text-green-600 font-bold">Copied!</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>{resumeData.email}</span>
              </>
            )}
          </button>
 
          {/* Download Resume Button (90-degree corners, theme contrast shadow) */}
          <a
            href="/Roshan_Resume.pdf"
            download="Roshan_Resume.pdf"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-none bg-theme-text text-bg-dark hover:opacity-95 border-2 border-border-muted text-xs font-bold transition-all active:scale-95 shadow-brutalist-sm"
          >
            <FileDown size={14} />
            <span>Resume</span>
          </a>
        </div>
 
        {/* Mobile menu toggle / theme toggle controls */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 rounded-none border-2 border-border-muted text-theme-text-muted hover:text-theme-text transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
 
      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <div className="md:hidden border-b-2 border-border-muted bg-bg-dark px-6 py-6 flex flex-col gap-6 animate-fade-in rounded-none">
          <div className="flex flex-col gap-4">
            <a
              href="#experience"
              onClick={() => setIsOpen(false)}
              className="text-sm font-mono uppercase tracking-wider text-theme-text-muted hover:text-theme-text transition-colors"
            >
              Experience
            </a>
            <a
              href="#projects"
              onClick={() => setIsOpen(false)}
              className="text-sm font-mono uppercase tracking-wider text-theme-text-muted hover:text-theme-text transition-colors"
            >
              Projects
            </a>
            <a
              href="#skills"
              onClick={() => setIsOpen(false)}
              className="text-sm font-mono uppercase tracking-wider text-theme-text-muted hover:text-theme-text transition-colors"
            >
              Skills
            </a>
            <a
              href="#contact"
              onClick={() => setIsOpen(false)}
              className="text-sm font-mono uppercase tracking-wider text-theme-text-muted hover:text-theme-text transition-colors"
            >
              Contact
            </a>
          </div>
 
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border-muted">
            <button
              onClick={handleCopyEmail}
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-none border-2 border-border-muted bg-bg-card text-sm font-mono text-theme-text transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check size={16} className="text-green-600" />
                  <span className="text-green-600 font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={16} />
                  <span>{resumeData.email}</span>
                </>
              )}
            </button>
 
            <a
              href="/Roshan_Resume.pdf"
              download="Roshan_Resume.pdf"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-none bg-theme-text text-bg-dark border-2 border-border-muted text-sm font-bold transition-colors shadow-brutalist"
            >
              <FileDown size={16} />
              <span>Download Resume</span>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};
