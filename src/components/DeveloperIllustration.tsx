import React from 'react';

export const DeveloperIllustration: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg
      viewBox="0 0 200 220"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Hair (Parted, combed short hair matching photo silhouette) */}
      <path
        d="M55 85 C55 45, 80 35, 100 35 C125 35, 145 45, 145 85 C145 75, 135 60, 115 62 C95 64, 85 50, 70 65 C60 75, 55 80, 55 85"
        className="text-accent-teal"
      />
      <path d="M70 65 C80 62, 90 68, 100 68 C115 68, 125 58, 135 68" />
      
      {/* Ears */}
      <path d="M55 90 C50 90, 50 105, 55 105" />
      <path d="M145 90 C150 90, 150 105, 145 105" />

      {/* Head / Jaw Outline */}
      <path d="M55 95 C55 130, 75 160, 100 160 C125 160, 145 130, 145 95" />

      {/* Eyebrows & Eyes */}
      <path d="M70 85 Q80 80 90 85" className="text-zinc-600" />
      <path d="M73 92 Q81 89 89 92" />
      <path d="M110 85 Q120 80 130 85" className="text-zinc-600" />
      <path d="M111 92 Q119 89 127 92" />

      {/* Nose */}
      <path d="M100 85 L100 115 Q100 120 105 120" />

      {/* Mustache & Lips */}
      <path d="M88 132 C94 128, 106 128, 112 132" className="text-accent-teal" />
      <path d="M92 137 Q100 141 108 137" />

      {/* Trimmed Beard (outlined shadow along jawline matching photo) */}
      <path
        d="M55 105 C60 145, 80 165, 100 165 C120 165, 140 145, 145 105 M55 105 C65 115, 80 120, 100 120 C120 120, 135 115, 145 105"
        className="text-accent-teal"
        strokeWidth="1.2"
        strokeDasharray="2 2"
      />

      {/* Neck */}
      <path d="M80 160 L80 185" />
      <path d="M120 160 L120 185" />

      {/* Collar & Tie (strictly matching professional portrait look) */}
      <path d="M80 185 L60 202 L95 202 L95 188 Z" />
      <path d="M120 185 L140 202 L105 202 L105 188 Z" />
      <path d="M95 188 L105 188 L110 215 L100 220 L90 215 Z" className="text-accent-teal" />
    </svg>
  );
};
