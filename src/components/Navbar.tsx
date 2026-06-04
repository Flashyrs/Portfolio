import React, { useState } from 'react';
import { Copy, Check, FileDown, Menu, X } from 'lucide-react';
import { resumeData } from '../data/resumeData';

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
    <nav className="fixed top-0 left-0 w-full z-50 border-b border-border-muted bg-bg-dark/85 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand Logo - Keep lowercase, remove brackets */}
        <a href="#" className="font-mono text-zinc-100 font-bold text-lg flex items-center group">
          <span className="text-zinc-100 group-hover:text-accent-teal transition-colors">roshan.shukla</span>
          <span className="text-accent-teal group-hover:text-zinc-100 transition-colors font-semibold">()</span>
        </a>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#experience" className="text-xs uppercase tracking-widest font-mono text-zinc-400 hover:text-white transition-colors">Experience</a>
          <a href="#projects" className="text-xs uppercase tracking-widest font-mono text-zinc-400 hover:text-white transition-colors">Projects</a>
          <a href="#skills" className="text-xs uppercase tracking-widest font-mono text-zinc-400 hover:text-white transition-colors">Skills</a>
          <a href="#contact" className="text-xs uppercase tracking-widest font-mono text-zinc-400 hover:text-white transition-colors">Contact</a>
        </div>

        {/* Quick Actions (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          {/* Email Copy Button (90-degree corners, teal focus) */}
          <button
            onClick={handleCopyEmail}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-none border border-border-muted bg-bg-card hover:bg-zinc-800 text-xs font-mono text-zinc-300 hover:text-zinc-100 transition-all active:scale-95 cursor-pointer"
            title="Copy email to clipboard"
          >
            {copied ? (
              <>
                <Check size={14} className="text-accent-teal" />
                <span className="text-accent-teal">Copied!</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>{resumeData.email}</span>
              </>
            )}
          </button>

          {/* Download Resume Button (90-degree corners, teal accent) */}
          <a
            href="/Roshan_Resume.pdf"
            download="Roshan_Resume.pdf"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-none bg-accent-teal hover:bg-accent-teal-hover text-xs font-bold text-zinc-950 transition-all active:scale-95 shadow-md shadow-accent-teal/5"
          >
            <FileDown size={14} />
            <span>Resume</span>
          </a>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-1.5 rounded-none border border-border-muted text-zinc-400 hover:text-zinc-100 transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <div className="md:hidden border-b border-border-muted bg-bg-dark px-6 py-6 flex flex-col gap-6 animate-fade-in rounded-none">
          <div className="flex flex-col gap-4">
            <a
              href="#experience"
              onClick={() => setIsOpen(false)}
              className="text-sm font-mono uppercase tracking-wider text-zinc-400 hover:text-white transition-colors"
            >
              Experience
            </a>
            <a
              href="#projects"
              onClick={() => setIsOpen(false)}
              className="text-sm font-mono uppercase tracking-wider text-zinc-400 hover:text-white transition-colors"
            >
              Projects
            </a>
            <a
              href="#skills"
              onClick={() => setIsOpen(false)}
              className="text-sm font-mono uppercase tracking-wider text-zinc-400 hover:text-white transition-colors"
            >
              Skills
            </a>
            <a
              href="#contact"
              onClick={() => setIsOpen(false)}
              className="text-sm font-mono uppercase tracking-wider text-zinc-400 hover:text-white transition-colors"
            >
              Contact
            </a>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border-muted">
            <button
              onClick={handleCopyEmail}
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-none border border-border-muted bg-bg-card text-sm font-mono text-zinc-300 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check size={16} className="text-accent-teal" />
                  <span className="text-accent-teal">Copied!</span>
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
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-none bg-accent-teal text-sm font-bold text-zinc-950 transition-colors"
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
