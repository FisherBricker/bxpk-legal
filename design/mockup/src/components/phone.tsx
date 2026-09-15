import type { ReactNode } from "react";
import { ContourRings } from "@/components/kokonutui/background-paths";

/** Screen is 402 x 874 pt (iPhone 17); the frame adds a 12 pt rim. */
const SCREEN_W = 402;
const SCREEN_H = 874;
const RIM = 12;
const FRAME_W = SCREEN_W + RIM * 2;
const FRAME_H = SCREEN_H + RIM * 2;

export const PHONE_ASPECT = FRAME_H / FRAME_W;

function StatusBar() {
  return (
    <div className="flex items-center justify-between px-7 pt-3 text-[15px] font-bold text-ink">
      <span className="tnum">9:41</span>
      <span className="flex items-center gap-1.5">
        <svg aria-hidden="true" className="h-[13px] w-[17px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" viewBox="0 0 17 13">
          <path d="M1 11.5v-2M5.5 11.5V7M10 11.5V4M14.5 11.5V1.5" />
        </svg>
        <svg aria-hidden="true" className="h-[13px] w-[16px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" viewBox="0 0 16 13">
          <path d="M1 4.6a10 10 0 0 1 14 0M3.6 7.4a6.4 6.4 0 0 1 8.8 0M6.2 10.1a2.8 2.8 0 0 1 3.6 0M8 12.2h.01" />
        </svg>
        <svg aria-hidden="true" className="h-[13px] w-[25px]" fill="none" stroke="currentColor" strokeWidth="1.3" viewBox="0 0 25 13">
          <rect height="10" rx="2.6" width="20" x="1" y="1.5" />
          <path d="M23 5.4v2.8" strokeLinecap="round" />
          <rect fill="currentColor" height="6.4" rx="1.4" stroke="none" width="13" x="2.8" y="3.3" />
        </svg>
      </span>
    </div>
  );
}

interface PhoneProps {
  children: ReactNode;
  /** Rendered width of the frame in CSS pixels. */
  width?: number;
  className?: string;
  /** Every phone on the page carries the same caption. */
  caption?: boolean;
  label: string;
}

/**
 * Straight-on placeholder phone. Never tilted, never blank: each screen is a
 * token-colored skeleton of the real layout with its most important rows set in
 * real text.
 */
export function Phone({ children, width = 300, className = "", caption = true, label }: PhoneProps) {
  const scale = width / FRAME_W;
  return (
    <figure className={`m-0 flex flex-col items-center gap-3 ${className}`} style={{ width }}>
      <div
        className="relative shrink-0 overflow-hidden"
        role="img"
        aria-label={`Screen preview: ${label}`}
        style={{ width, height: FRAME_H * scale }}
      >
        <div
          className="absolute top-0 left-0 origin-top-left"
          style={{ width: FRAME_W, height: FRAME_H, transform: `scale(${scale})` }}
        >
          <div
            className="relative h-full w-full"
            style={{
              background: "var(--night)",
              borderRadius: 65,
              boxShadow: "inset 0 0 0 1px var(--moss), 0 40px 70px -40px rgba(16,20,13,0.65)",
              padding: RIM,
            }}
          >
            <div
              className="relative h-full w-full overflow-hidden bg-paper text-ink"
              style={{ borderRadius: 53 }}
            >
              <ContourRings className="opacity-70" seed={label.length + 11} stroke="rgba(95,112,64,0.13)" />
              <div className="relative flex h-full flex-col">
                <StatusBar />
                <div
                  className="absolute top-3 left-1/2 h-[37px] w-[125px] -translate-x-1/2 rounded-full"
                  style={{ background: "var(--night)" }}
                />
                <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-5 pt-8 pb-6">{children}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {caption ? (
        <figcaption className="text-center text-[0.8125rem] text-fg-muted">
          Screen preview. App screenshots coming soon.
        </figcaption>
      ) : null}
    </figure>
  );
}

/* ---------- screen furniture ---------- */

export function ScreenTitle({ sub, title }: { sub: string; title: string }) {
  return (
    <div className="mb-4">
      <div className="text-[13px] font-bold tracking-[0.08em] text-ink-muted uppercase">{sub}</div>
      <div className="font-display text-[30px] leading-tight font-medium">{title}</div>
    </div>
  );
}

export function ScreenRow({ left, note, right }: { left: string; note?: string; right: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3 text-[15px] last:border-b-0">
      <span className="min-w-0 truncate">
        <span className="font-bold">{left}</span>
        {note ? <span className="ml-2 text-[13px] text-ink-muted">{note}</span> : null}
      </span>
      <span className="shrink-0 font-bold tnum">{right}</span>
    </div>
  );
}

export function ScreenCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-line bg-surface ${className}`}>{children}</div>;
}

/** Quiet placeholder rows that fill whatever height is left above the tab bar, so no screen ends in an empty band. */
export function ScreenBars({ widths = [72, 58, 64, 49, 67, 55] }: { widths?: number[] }) {
  return (
    <div aria-hidden="true" className="mt-4 min-h-0 flex-1 overflow-hidden">
      <div className="overflow-hidden rounded-2xl border border-line bg-surface">
        {Array.from({ length: 16 }, (_, i) => (
          <div className="flex items-center gap-3 border-b border-line px-4 py-3.5 last:border-b-0" key={i}>
            <div className="h-2.5 rounded-full bg-line" style={{ width: `${widths[i % widths.length]}%` }} />
            <div className="ml-auto h-2.5 w-12 rounded-full bg-line" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ScreenTabBar({ active }: { active: number }) {
  const tabs = ["Trips", "Gear", "Packs", "Profile"];
  return (
    <div aria-hidden="true" className="mt-auto flex items-start justify-between border-t border-line px-4 pt-3">
      {tabs.map((tab, i) => (
        <span className="flex w-16 flex-col items-center gap-1.5" key={tab}>
          <span
            className="h-5 w-5 rounded-md border-2"
            style={{ borderColor: i === active ? "var(--moss)" : "var(--line)" }}
          />
          <span className="text-[11px] font-bold" style={{ color: i === active ? "var(--moss)" : "var(--ink-muted)" }}>
            {tab}
          </span>
        </span>
      ))}
    </div>
  );
}
