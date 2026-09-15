/**
 * Adapted from KokonutUI "Slide Text Button" (MIT, kokonutui.com).
 * Kept: the label sliding up out of view while its copy slides in underneath.
 * Changed: a plain anchor instead of next/link, Topo tokens instead of black and
 * white, an arrow that walks with the text, and no entrance animation (the
 * original starts at opacity 0 and 200 px off, which would hide the link if
 * motion never ran).
 */

import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SlideTextButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  text: string;
  hoverText?: string;
  href: string;
  className?: string;
  variant?: "link" | "solid";
}

export function SlideTextButton({
  text,
  hoverText,
  href,
  className,
  variant = "link",
  ...props
}: SlideTextButtonProps) {
  const slideText = hoverText ?? text;
  return (
    <a
      className={cn(
        "group relative inline-flex min-h-11 items-center overflow-hidden rounded-full font-bold no-underline",
        variant === "solid" ? "bg-data px-5 text-ground" : "px-1 text-fg",
        className
      )}
      href={href}
      {...props}
    >
      <span className="relative inline-block overflow-hidden py-1">
        <span className="relative block transition-transform duration-300 ease-[var(--ease-expo)] group-hover:-translate-y-full group-focus-visible:-translate-y-full">
          <span className="flex items-center gap-2">
            {text}
            <ArrowRight aria-hidden="true" className="h-4 w-4 text-data" strokeWidth={1.75} />
          </span>
          <span aria-hidden="true" className="absolute top-full left-0 flex items-center gap-2 whitespace-nowrap">
            {slideText}
            <ArrowRight className="h-4 w-4 text-data" strokeWidth={1.75} />
          </span>
        </span>
      </span>
    </a>
  );
}

export default SlideTextButton;
