import Link from "next/link";
import clsx from "clsx";
import type { ComponentProps, ReactNode } from "react";

type ButtonVariant = "primary" | "dark" | "outline" | "ghost" | "white";
type ButtonSize = "sm" | "md" | "lg";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-leaf-700 text-white hover:bg-leaf-800 shadow-[0_8px_24px_-8px_rgb(38_116_28/0.5)] hover:shadow-[0_12px_28px_-8px_rgb(38_116_28/0.6)]",
  dark: "bg-forest-900 text-white hover:bg-forest-800",
  outline: "border border-ink/15 bg-white/70 text-ink hover:border-leaf-500 hover:text-leaf-700 backdrop-blur",
  ghost: "text-ink hover:bg-ink/5",
  white: "bg-white text-forest-900 hover:bg-leaf-50",
};
const sizes: Record<ButtonSize, string> = {
  sm: "min-h-10 px-4 py-2 text-sm gap-2",
  md: "min-h-12 px-5 py-2.5 text-[0.95rem] gap-2.5",
  lg: "min-h-12 px-5 py-3 text-[0.95rem] gap-2.5 sm:min-h-14 sm:px-7 sm:text-base sm:gap-3",
};

export function buttonClasses(variant: ButtonVariant = "primary", size: ButtonSize = "md", className?: string) {
  return clsx(
    "inline-flex items-center justify-center rounded-full text-center font-semibold leading-snug transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none",
    variants[variant],
    sizes[size],
    className,
  );
}

export function Button({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: { href?: string; variant?: ButtonVariant; size?: ButtonSize; className?: string; children: ReactNode } & Omit<ComponentProps<"a"> & ComponentProps<"button">, "href">) {
  const cls = buttonClasses(variant, size, className);
  if (href) {
    const external = /^(https?:|mailto:|tel:)/.test(href);
    if (external) return <a href={href} className={cls} {...(rest as ComponentProps<"a">)}>{children}</a>;
    // CTAs sit above the fold on every page; skipping viewport prefetch keeps the initial critical path lean (hover prefetch still applies).
    return <Link href={href} prefetch={false} className={cls} {...(rest as ComponentProps<"a">)}>{children}</Link>;
  }
  return <button className={cls} {...(rest as ComponentProps<"button">)}>{children}</button>;
}

export function Container({ className, children, as: Tag = "div" }: { className?: string; children: ReactNode; as?: "div" | "section" | "header" | "footer" | "nav" | "article" }) {
  return <Tag className={clsx("container-x", className)}>{children}</Tag>;
}

export function Eyebrow({ children, className, light = false }: { children: ReactNode; className?: string; light?: boolean }) {
  return (
    <p className={clsx("eyebrow inline-flex items-center gap-2", light && "text-leaf-300", className)}>
      <span className={clsx("h-1.5 w-1.5 rounded-full", light ? "bg-leaf-400" : "bg-leaf-500")} aria-hidden />
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  text,
  align = "left",
  light = false,
  className,
  as: Tag = "h2",
}: { eyebrow?: string; title: ReactNode; text?: ReactNode; align?: "left" | "center"; light?: boolean; className?: string; as?: "h1" | "h2" | "h3" }) {
  return (
    <div className={clsx("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <Eyebrow light={light} className={clsx("mb-4", align === "center" && "justify-center")}>{eyebrow}</Eyebrow>}
      <Tag className={clsx("display-lg text-balance", light ? "text-white" : "text-ink")}>{title}</Tag>
      {text && <div className={clsx("mt-5 text-lg leading-relaxed text-pretty", light ? "text-sage-200" : "text-muted")}>{text}</div>}
    </div>
  );
}

export function Badge({ children, className, tone = "leaf" }: { children: ReactNode; className?: string; tone?: "leaf" | "dark" | "white" | "amber" }) {
  const tones = {
    leaf: "bg-leaf-100 text-leaf-800",
    dark: "bg-forest-900 text-white",
    white: "bg-white text-forest-900 shadow-soft",
    amber: "bg-amber/15 text-amber-700",
  };
  return <span className={clsx("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold tracking-wide", tones[tone], className)}>{children}</span>;
}

export function Stars({ value = 5, className, size = "h-4 w-4" }: { value?: number; className?: string; size?: string }) {
  return (
    <span role="img" className={clsx("inline-flex items-center gap-0.5 text-amber", className)} aria-label={`${value} von 5 Sternen`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" className={clsx(size, i < Math.round(value) ? "fill-current" : "fill-current opacity-25")} aria-hidden="true">
          <path d="m12 2.5 2.9 6.2 6.7.8-5 4.6 1.4 6.7L12 17.4l-6 3.4 1.4-6.7-5-4.6 6.7-.8Z" />
        </svg>
      ))}
    </span>
  );
}
