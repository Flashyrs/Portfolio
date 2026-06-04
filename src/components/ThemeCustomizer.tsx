import React, { useState, useEffect } from 'react';
import { Palette, X, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ThemePreset {
  name: string;
  bg: string;
  text: string;
  accent: string;
}

const PRESETS: ThemePreset[] = [
  {
    name: "Warm Stone",
    bg: "#1c1917",
    text: "#d6d3d1",
    accent: "#d97706",
  },
  {
    name: "Teal & Carbon",
    bg: "#09090b",
    text: "#a1a1aa",
    accent: "#14b8a6",
  },
  {
    name: "Golden Obsidian",
    bg: "#000000",
    text: "#e5e5e7",
    accent: "#d4af37",
  },
  {
    name: "Sage & Emerald",
    bg: "#06140d",
    text: "#ccdacf",
    accent: "#10b981",
  }
];

// Helper to convert hex to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  let color = hex.replace('#', '');
  if (color.length === 3) {
    color = color.split('').map(c => c + c).join('');
  }
  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// Helper to adjust color brightness
function adjustBrightness(hex: string, amount: number): string {
  let color = hex.replace('#', '');
  if (color.length === 3) {
    color = color.split('').map(c => c + c).join('');
  }
  let r = parseInt(color.substring(0, 2), 16) + amount;
  let g = parseInt(color.substring(2, 4), 16) + amount;
  let b = parseInt(color.substring(4, 6), 16) + amount;

  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));

  const rHex = r.toString(16).padStart(2, '0');
  const gHex = g.toString(16).padStart(2, '0');
  const bHex = b.toString(16).padStart(2, '0');

  return `#${rHex}${gHex}${bHex}`;
}

// Helper to get luminance
function getLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  return (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
}

export const ThemeCustomizer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [bg, setBg] = useState("#1c1917");
  const [text, setText] = useState("#d6d3d1");
  const [accent, setAccent] = useState("#d97706");

  // Load saved colors from localStorage on mount
  useEffect(() => {
    const savedBg = localStorage.getItem('theme-bg');
    const savedText = localStorage.getItem('theme-text');
    const savedAccent = localStorage.getItem('theme-accent');

    if (savedBg) setBg(savedBg);
    if (savedText) setText(savedText);
    if (savedAccent) setAccent(savedAccent);

    if (savedBg || savedText || savedAccent) {
      applyTheme(
        savedBg || "#1c1917",
        savedText || "#d6d3d1",
        savedAccent || "#d97706"
      );
    }
  }, []);

  const applyTheme = (newBg: string, newText: string, newAccent: string) => {
    const root = document.documentElement;
    const isLight = getLuminance(newBg) > 0.5;

    // Adjust card backgrounds and borders dynamically based on theme brightness
    const bgCard = isLight ? adjustBrightness(newBg, -8) : adjustBrightness(newBg, 8);
    const borderMuted = isLight ? adjustBrightness(newBg, -20) : adjustBrightness(newBg, 18);
    
    // Adjust accent hovers and dark accents
    const accentHover = adjustBrightness(newAccent, isLight ? -15 : 15);
    const accentDark = adjustBrightness(newAccent, isLight ? 15 : -25);

    // Convert accent color to RGB for the background dot grid transparency
    const rgb = hexToRgb(newAccent);
    const gridDot = rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.04)` : 'rgba(20, 184, 166, 0.03)';

    // Update style properties
    root.style.setProperty('--theme-bg', newBg);
    root.style.setProperty('--theme-text', newText);
    root.style.setProperty('--theme-accent', newAccent);
    root.style.setProperty('--theme-accent-hover', accentHover);
    root.style.setProperty('--theme-accent-dark', accentDark);
    root.style.setProperty('--theme-bg-card', bgCard);
    root.style.setProperty('--theme-border-muted', borderMuted);
    root.style.setProperty('--theme-grid-dot', gridDot);

    // Save to localStorage
    localStorage.setItem('theme-bg', newBg);
    localStorage.setItem('theme-text', newText);
    localStorage.setItem('theme-accent', newAccent);
  };

  const handleBgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setBg(color);
    applyTheme(color, text, accent);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setText(color);
    applyTheme(bg, color, accent);
  };

  const handleAccentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setAccent(color);
    applyTheme(bg, text, color);
  };

  const handlePresetSelect = (preset: ThemePreset) => {
    setBg(preset.bg);
    setText(preset.text);
    setAccent(preset.accent);
    applyTheme(preset.bg, preset.text, preset.accent);
  };

  const handleReset = () => {
    const defaultPreset = PRESETS[0];
    handlePresetSelect(defaultPreset);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-3.5 bg-accent-teal text-bg-dark border border-accent-teal/20 hover:scale-105 active:scale-95 transition-all shadow-lg cursor-pointer"
        style={{ borderRadius: '0' }}
        title="Customize Colors"
      >
        <Palette size={20} />
      </button>

      {/* Control Panel Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-80 z-50 bg-bg-card/95 border-l border-border-muted p-6 flex flex-col justify-between shadow-2xl backdrop-blur-md text-zinc-300 font-sans"
            style={{ borderRadius: '0' }}
          >
            {/* Header */}
            <div>
              <div className="flex items-center justify-between border-b border-border-muted/50 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <Palette size={18} className="text-accent-teal" />
                  <span className="font-mono text-sm font-bold text-white uppercase tracking-wider">
                    Theme Customizer
                  </span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-zinc-500 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Presets Section */}
              <div className="space-y-4 mb-8">
                <h4 className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
                  Aesthetic Combinations
                </h4>
                <div className="grid grid-cols-1 gap-2.5">
                  {PRESETS.map((preset) => {
                    const isActive = preset.bg === bg && preset.accent === accent;
                    return (
                      <button
                        key={preset.name}
                        onClick={() => handlePresetSelect(preset)}
                        className={`flex items-center justify-between px-3 py-2.5 border transition-all text-xs font-mono rounded-none text-left cursor-pointer ${
                          isActive
                            ? 'border-accent-teal bg-accent-teal/5 text-white'
                            : 'border-border-muted bg-bg-dark/50 hover:border-zinc-500 text-zinc-400'
                        }`}
                      >
                        <span>{preset.name}</span>
                        <div className="flex gap-1.5 items-center">
                          <span
                            className="w-3.5 h-3.5 border border-white/10 block"
                            style={{ backgroundColor: preset.bg, borderRadius: '0' }}
                            title="Background Color"
                          />
                          <span
                            className="w-3.5 h-3.5 border border-white/10 block"
                            style={{ backgroundColor: preset.accent, borderRadius: '0' }}
                            title="Accent Color"
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Adjustments Section */}
              <div className="space-y-5">
                <h4 className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
                  Fine-Tune Colors
                </h4>

                {/* Background color input */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono">Background</span>
                  <div className="flex items-center gap-2 bg-bg-dark/50 border border-border-muted px-2 py-1">
                    <span className="text-[10px] font-mono text-zinc-500">{bg.toUpperCase()}</span>
                    <input
                      type="color"
                      value={bg}
                      onChange={handleBgChange}
                      className="w-6 h-6 border-0 bg-transparent cursor-pointer p-0 block outline-none"
                    />
                  </div>
                </div>

                {/* Text color input */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono">Text Color</span>
                  <div className="flex items-center gap-2 bg-bg-dark/50 border border-border-muted px-2 py-1">
                    <span className="text-[10px] font-mono text-zinc-500">{text.toUpperCase()}</span>
                    <input
                      type="color"
                      value={text}
                      onChange={handleTextChange}
                      className="w-6 h-6 border-0 bg-transparent cursor-pointer p-0 block outline-none"
                    />
                  </div>
                </div>

                {/* Accent color input */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono">Accent Color</span>
                  <div className="flex items-center gap-2 bg-bg-dark/50 border border-border-muted px-2 py-1">
                    <span className="text-[10px] font-mono text-zinc-500">{accent.toUpperCase()}</span>
                    <input
                      type="color"
                      value={accent}
                      onChange={handleAccentChange}
                      className="w-6 h-6 border-0 bg-transparent cursor-pointer p-0 block outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer / Reset button */}
            <button
              onClick={handleReset}
              className="w-full flex items-center justify-center gap-2 py-2.5 border border-border-muted hover:border-zinc-500 hover:text-white transition-all text-xs font-mono uppercase bg-bg-dark/50 cursor-pointer"
              style={{ borderRadius: '0' }}
            >
              <RotateCcw size={14} />
              <span>Reset to default</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
