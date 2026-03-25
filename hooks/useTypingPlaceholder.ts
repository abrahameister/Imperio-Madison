import { useState, useEffect, useRef } from 'react';

const DEFAULT_PHRASES = [
  "Busca 'Azúcar Iansa'...",
  "Encuentra 'Aceite Natura'...",
  "¿Qué vamos a ahorrar hoy?",
  "Busca 'Leche Colun'...",
  "Compara 'Detergente Omo'...",
];

type Phase = 'typing' | 'pausing' | 'deleting';

/**
 * Cycles through phrases with a typewriter char-by-char effect.
 * Returns the current display string for use as search placeholder.
 */
export function useTypingPlaceholder(
  phrases: string[] = DEFAULT_PHRASES,
  typingSpeed: number = 55,
  deletingSpeed: number = 28,
  pauseDuration: number = 1800,
): string {
  const [displayText, setDisplayText] = useState('');
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>('typing');
  const charIdx = useRef(0);

  useEffect(() => {
    const currentPhrase = phrases[phraseIdx];

    if (phase === 'typing') {
      if (charIdx.current < currentPhrase.length) {
        const timer = setTimeout(() => {
          charIdx.current += 1;
          setDisplayText(currentPhrase.slice(0, charIdx.current));
        }, typingSpeed);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => setPhase('pausing'), pauseDuration);
        return () => clearTimeout(timer);
      }
    }

    if (phase === 'pausing') {
      setPhase('deleting');
    }

    if (phase === 'deleting') {
      if (charIdx.current > 0) {
        const timer = setTimeout(() => {
          charIdx.current -= 1;
          setDisplayText(currentPhrase.slice(0, charIdx.current));
        }, deletingSpeed);
        return () => clearTimeout(timer);
      } else {
        setPhraseIdx((prev) => (prev + 1) % phrases.length);
        setPhase('typing');
      }
    }
  }, [displayText, phase, phraseIdx, phrases, typingSpeed, deletingSpeed, pauseDuration]);

  return displayText;
}
