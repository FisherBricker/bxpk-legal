import type { ReactNode } from "react";
import { ContourPaths } from "@/components/kokonutui/background-paths";
import { cn } from "@/lib/utils";

const GROUNDS = {
  paper: "bg-paper text-ink",
  map: "bg-map text-ink",
  night: "night bg-night text-night-ink",
} as const;

export type Ground = keyof typeof GROUNDS;

/** A section on the route: the content column leaves the left gutter to the line and the right to the rail. */
export function RouteSection({
  children,
  className = "",
  ground = "paper",
  id,
  labelledBy,
  nav,
}: {
  children: ReactNode;
  className?: string;
  ground?: Ground;
  id?: string;
  labelledBy?: string;
  nav?: string;
}) {
  return (
    <section
      aria-labelledby={labelledBy}
      className={cn("relative isolate", GROUNDS[ground], className)}
      data-nav={nav}
      data-night={ground === "night" ? "" : undefined}
      id={id}
    >
      {/* Faint contour hairlines behind the route, a different sheet of the quadrangle per waypoint */}
      <ContourPaths className="-z-10" seed={(labelledBy ?? "route").length * 7 + 3} />
      {children}
    </section>
  );
}

/** The content column inside a route section. */
export function RouteColumn({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("mx-auto w-full max-w-[90rem] pr-5 pl-12 sm:pr-8 lg:pr-[190px] lg:pl-[240px]", className)}>
      <div className="relative">{children}</div>
    </div>
  );
}

/** A plain section off the route (community, privacy, news, close, footer). */
export function PlainSection({
  children,
  className = "",
  ground = "paper",
  id,
  labelledBy,
  nav,
}: {
  children: ReactNode;
  className?: string;
  ground?: Ground;
  id?: string;
  labelledBy?: string;
  nav?: string;
}) {
  return (
    <section
      aria-labelledby={labelledBy}
      className={cn("relative isolate", GROUNDS[ground], className)}
      data-nav={nav}
      id={id}
    >
      <ContourPaths className="-z-10" seed={(labelledBy ?? "sheet").length * 11 + 5} />
      <div className={cn("mx-auto w-full max-w-[82rem] px-5 sm:px-10")}>{children}</div>
    </section>
  );
}

export function SectionHeading({
  body,
  children,
  id,
  title,
}: {
  body?: string;
  children?: ReactNode;
  id: string;
  title: string;
}) {
  return (
    <div className="max-w-[46rem]">
      <h2 className="display-2" id={id}>
        {title}
      </h2>
      {body ? <p className="lead mt-5">{body}</p> : null}
      {children}
    </div>
  );
}

/**
 * A quadrangle neatline: a hairline with small tick marks, set along the top edge
 * of the first route sheet and the bottom edge of the last.
 */
export function Neatline({ edge }: { edge: "top" | "bottom" }) {
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute right-0 left-0 px-5 sm:px-10", edge === "top" ? "top-6" : "bottom-6")}>
      <div
        className="mx-auto h-2 max-w-[86rem] border-fg-muted/40"
        style={{
          borderTopWidth: edge === "top" ? 1 : 0,
          borderBottomWidth: edge === "bottom" ? 1 : 0,
          backgroundImage:
            "repeating-linear-gradient(to right, color-mix(in srgb, var(--fg-muted) 45%, transparent) 0 1px, transparent 1px 48px)",
          backgroundPosition: edge === "top" ? "0 0" : "0 100%",
          backgroundSize: "100% 6px",
          backgroundRepeat: "repeat-x",
        }}
      />
    </div>
  );
}
