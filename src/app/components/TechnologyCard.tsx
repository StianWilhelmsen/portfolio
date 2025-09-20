'use client';

import Image from 'next/image';
import React from 'react';

type TechnologyCardProps = {
  name: string;
  iconSrc: string;
  color: string;
  href?: string;
  subtitle?: string;
  className?: string;
};

function hexToRgba(hex: string, alpha = 0.12) {
  const h = hex.replace('#', '');
  const v = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const num = parseInt(v, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// allow a CSS custom property on the style prop (no `any`)
type StyleWithVar = React.CSSProperties & { ['--ring-color']?: string };

export default function TechnologyCard({
  name,
  iconSrc,
  color,
  href,
  subtitle,
  className = '',
}: TechnologyCardProps) {
  const tint = hexToRgba(color, 0.1);
  const glow = hexToRgba(color, 0.45);
  const ring = hexToRgba(color, 0.35);

  const content = (
    <div
      className={[
        'relative group rounded-xl border border-gray-300 dark:border-gray-700',
        'bg-[var(--background)] text-[var(--foreground)] overflow-hidden',
        'transition-transform duration-300 hover:-translate-y-0.5',
        className,
      ].join(' ')}
      style={{ boxShadow: '0 0 0 rgba(0,0,0,0)' }}
      aria-label={name}
    >
      {/* Top half */}
      <div className="h-16 md:h-20" style={{ background: tint }} />

      {/* Divider line */}
      <div className="h-px w-full bg-gray-200 dark:bg-gray-800" />

      {/* Bottom half */}
      <div className="h-14 md:h-16 flex flex-col items-center justify-center px-2 text-center">
        <span className="text-xs font-medium">{name}</span>
        {subtitle ? <span className="text-[10px] opacity-70">{subtitle}</span> : null}
      </div>

      {/* Icon */}
      <div
        className="
          absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
          w-12 h-12 md:w-14 md:h-14 rounded-full
          flex items-center justify-center
          bg-[var(--background)]
          shadow-md
          transition
          ring-1 ring-transparent
          group-hover:ring-[color:var(--ring-color)]
        "
        // no `any` here
        style={{ ['--ring-color']: ring } as StyleWithVar}
      >
        {/* Glow */}
        <div
          className="pointer-events-none absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md"
          style={{ boxShadow: `0 6px 15px ${glow}, 0 0 0 1px ${ring}` }}
        />

        <Image
          src={iconSrc}
          alt={name}
          width={28}
          height={28}
          className="relative z-[1] object-contain"
        />
      </div>
    </div>
  );

  return href ? (
    <a href={href} target="_blank" rel="noreferrer" className="block">
      {content}
    </a>
  ) : (
    content
  );
}
