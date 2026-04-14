import React from 'react';
import { Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full py-10 px-4 border-t border-border/40 mt-auto bg-bg">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-6 text-center">
        <a
          href="https://www.instagram.com/imperiomadison/"
          target="_blank"
          rel="noopener noreferrer"
          className="
            flex items-center justify-center w-12 h-12 rounded-full 
            bg-surface2/40 text-text-muted border border-border/50
            hover:text-accent-secondary hover:bg-surface2/80 hover:border-accent-secondary/50
            transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_4px_12px_rgba(134,171,69,0.2)]
          "
          aria-label="Visita nuestro Instagram"
        >
          <Instagram size={22} strokeWidth={2} />
        </a>
        
        <p className="text-sm md:text-base text-text-muted text-balance px-4">
          Dando vida a tus ideas web. Creado por{' '}
          <a
            href="https://www.duetsolutions.cl/"
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline font-heading font-black text-transparent bg-clip-text
              bg-gradient-to-r from-accent-primary to-warning
              hover:opacity-80 transition-all hover:scale-105 ml-1
            "
          >
            Duet Solutions
          </a>
        </p>
      </div>
    </footer>
  );
}
