import type { ReactNode } from "react";
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
      {children}
    </section>
  );
}

/** The content column inside a route section. */
export function RouteColumn({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("mx-auto w-full max-w-[90rem] pr-5 pl-[2.125rem] sm:pr-8 lg:pr-[190px] lg:pl-[240px]", className)}>
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
