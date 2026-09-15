/** The CS-02 switchback mark, carried over from the approved site direction. */
export function Mark({ className = "h-8 w-8", knockout = "var(--ground)" }: { className?: string; knockout?: string }) {
  return (
    <svg aria-hidden="true" className={className} focusable="false" viewBox="0 0 64 64">
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 6 L24 18 L18 24 L46 40 L40 46 L52 58" stroke="var(--data)" strokeWidth="5.5" />
        <path d="M52 6 L40 18 L46 24 L18 40 L24 46 L12 58" stroke={knockout} strokeWidth="10" />
        <path d="M52 6 L40 18 L46 24 L18 40 L24 46 L12 58" stroke="var(--route)" strokeWidth="5.5" />
      </g>
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display text-[1.375rem] font-semibold tracking-[0.02em] ${className}`}>bxpk</span>
  );
}
