import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Copy, Check, ExternalLink } from 'lucide-react';
import { resumeData } from '../data/resumeData';

export const ContactSection: React.FC = () => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const handleCopy = async (text: string, type: 'email' | 'phone') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'email') {
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2000);
      } else {
        setCopiedPhone(true);
        setTimeout(() => setCopiedPhone(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <section id="contact" className="py-24 relative bg-grid-dots overflow-hidden">
      {/* Teal Ambient Glows */}
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-teal/3 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-teal-dark/3 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Section Heading */}
        <div className="mb-16 text-center max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-accent-teal mb-2 justify-center">
            <span>05 // INQUIRIES</span>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight font-sans">
            Get In Touch
          </h2>
          <p className="mt-2 text-sm text-zinc-500">
            Let's discuss distributed architectures, low-latency design, database optimization, or potential collaborations.
          </p>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          
          {/* Email Card (90-degree corners, teal highlight) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="p-6 rounded-none border border-border-muted bg-bg-card flex flex-col justify-between items-start min-h-[160px] group hover:border-accent-teal/40 transition-colors"
          >
            <div className="flex justify-between items-center w-full">
              <div className="p-2.5 rounded-none bg-zinc-900 border border-border-muted text-accent-teal">
                <Mail size={18} />
              </div>
              <button
                onClick={() => handleCopy(resumeData.email, 'email')}
                className="text-zinc-500 hover:text-zinc-300 transition-colors p-1.5 rounded-none hover:bg-zinc-900 border border-transparent hover:border-border-muted cursor-pointer"
                title="Copy Email"
              >
                {copiedEmail ? <Check size={14} className="text-accent-teal" /> : <Copy size={14} />}
              </button>
            </div>
            <div className="mt-6 w-full">
              <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest block mb-1">
                Email Address
              </span>
              <a
                href={`mailto:${resumeData.email}`}
                className="text-white hover:text-accent-teal font-mono text-sm break-all font-semibold transition-colors flex items-center gap-1.5"
              >
                <span>{resumeData.email}</span>
                <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              {copiedEmail && (
                <span className="text-[10px] font-mono text-accent-teal mt-1 block">
                  Email copied to clipboard!
                </span>
              )}
            </div>
          </motion.div>

          {/* Phone Card (90-degree corners, teal highlight) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="p-6 rounded-none border border-border-muted bg-bg-card flex flex-col justify-between items-start min-h-[160px] group hover:border-accent-teal/40 transition-colors"
          >
            <div className="flex justify-between items-center w-full">
              <div className="p-2.5 rounded-none bg-zinc-900 border border-border-muted text-accent-teal">
                <Phone size={18} />
              </div>
              <button
                onClick={() => handleCopy(resumeData.phone, 'phone')}
                className="text-zinc-500 hover:text-zinc-300 transition-colors p-1.5 rounded-none hover:bg-zinc-900 border border-transparent hover:border-border-muted cursor-pointer"
                title="Copy Phone Number"
              >
                {copiedPhone ? <Check size={14} className="text-accent-teal" /> : <Copy size={14} />}
              </button>
            </div>
            <div className="mt-6 w-full">
              <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest block mb-1">
                Phone Number
              </span>
              <a
                href={`tel:${resumeData.phone.replace(/\s+/g, '')}`}
                className="text-white hover:text-accent-teal font-mono text-sm font-semibold transition-colors flex items-center gap-1.5"
              >
                <span>{resumeData.phone}</span>
                <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              {copiedPhone && (
                <span className="text-[10px] font-mono text-accent-teal mt-1 block">
                  Phone copied to clipboard!
                </span>
              )}
            </div>
          </motion.div>

          {/* Location Card (90-degree corners, teal highlight) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="p-6 rounded-none border border-border-muted bg-bg-card flex flex-col justify-between items-start min-h-[160px] group hover:border-accent-teal/40 transition-colors"
          >
            <div className="flex justify-between items-center w-full">
              <div className="p-2.5 rounded-none bg-zinc-900 border border-border-muted text-accent-teal">
                <MapPin size={18} />
              </div>
            </div>
            <div className="mt-6 w-full">
              <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest block mb-1">
                Current Location
              </span>
              <span className="text-white font-sans text-sm font-semibold block">
                {resumeData.location}
              </span>
              <span className="text-[10px] font-mono text-zinc-500 mt-1 block">
                Open to relocation & remote work
              </span>
            </div>
          </motion.div>

        </div>

        {/* Footer info */}
        <div className="mt-24 pt-8 border-t border-border-muted flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-zinc-500">
          <div>
            © {new Date().getFullYear()} {resumeData.name}. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Designed & Engineered in India</span>
            <span>•</span>
            <a href={resumeData.links.github} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              Source Code
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
