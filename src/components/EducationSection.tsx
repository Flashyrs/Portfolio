import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Award, ShieldCheck, Users, Trophy } from 'lucide-react';
import { resumeData } from '../data/resumeData';

export const EducationSection: React.FC = () => {
  return (
    <section id="education" className="py-24 border-b border-border-muted relative bg-bg-card/5">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Section Heading */}
        <div className="mb-16">
          <div className="flex items-center gap-2 text-xs font-mono text-accent-teal mb-2">
            <span>04 // CREDENTIALS</span>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight font-sans">
            Education & Honors
          </h2>
          <p className="mt-2 text-sm text-zinc-500 max-w-xl">
            My academic foundation, professional certifications, competitive programming accolades, and student leadership details.
          </p>
        </div>

        {/* Dual Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Left Column: Education & Certifications */}
          <div className="space-y-8">
            {/* Education Block */}
            <div className="space-y-4">
              <h3 className="font-mono text-xs text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                <GraduationCap size={16} className="text-accent-teal" />
                <span>Academic Timeline</span>
              </h3>
              
              {resumeData.education.map((edu, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  className="p-6 rounded-none border border-border-muted bg-bg-card space-y-3"
                >
                  <div className="flex justify-between items-start gap-4">
                    <h4 className="font-bold text-white text-base leading-snug font-sans">
                      {edu.degree}
                    </h4>
                    <span className="font-mono text-[10px] text-accent-teal border border-accent-teal/20 px-2 py-0.5 rounded-none bg-accent-teal/5 shrink-0">
                      {edu.gpa}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 font-sans">
                    {edu.institution}
                  </p>
                  <p className="text-xs text-zinc-500 font-mono">
                    {edu.timeline}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Certifications Block */}
            <div className="space-y-4">
              <h3 className="font-mono text-xs text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck size={16} className="text-accent-teal" />
                <span>Certifications</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {resumeData.certifications.map((cert, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="p-4 rounded-none border border-border-muted bg-bg-card flex flex-col justify-between"
                  >
                    <h4 className="font-semibold text-white text-xs leading-snug font-sans">
                      {cert.name}
                    </h4>
                    <span className="mt-2 font-mono text-[9px] text-zinc-500 uppercase tracking-wider font-semibold">
                      {cert.issuer}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Honors & Leadership */}
          <div className="space-y-8">
            {/* Honors Block */}
            <div className="space-y-4">
              <h3 className="font-mono text-xs text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                <Trophy size={16} className="text-accent-teal" />
                <span>Competitive Coding & Hackathons</span>
              </h3>
              
              <div className="space-y-4">
                {resumeData.honors.map((honor, index) => {
                  const isCp = honor.startsWith("Competitive Programming");
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="p-6 rounded-none border border-border-muted bg-bg-card flex gap-4 items-start"
                    >
                      <div className="p-2 rounded-none bg-zinc-900 border border-border-muted text-accent-teal shrink-0 mt-0.5">
                        {isCp ? <Award size={18} /> : <Trophy size={18} />}
                      </div>
                      <div>
                        <h4 className="font-semibold text-white text-sm font-sans mb-1.5">
                          {isCp ? "LeetCode Peak Contest Rating: 1784" : "Hackathon Achievements"}
                        </h4>
                        <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                          {honor}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Leadership Block */}
            <div className="space-y-4">
              <h3 className="font-mono text-xs text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                <Users size={16} className="text-accent-teal" />
                <span>Leadership Roles</span>
              </h3>
              
              {resumeData.leadership.map((lead, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  className="p-6 rounded-none border border-border-muted bg-bg-card flex gap-4 items-start"
                >
                  <div className="p-2 rounded-none bg-zinc-900 border border-border-muted text-accent-teal shrink-0 mt-0.5">
                    <Users size={18} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm font-sans mb-1.5">
                      IEEE Student Branch Secretary
                    </h4>
                    <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                      {lead}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
