"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import clsx from "clsx";

/** Jemny fade-up pri prvnim vstupu do viewportu. */
export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "span";
}) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Component = Tag as "div";

  return (
    <Component
      ref={ref as React.RefObject<HTMLDivElement>}
      data-visible={visible}
      style={{ transitionDelay: `${delay}ms` }}
      className={clsx("reveal", className)}
    >
      {children}
    </Component>
  );
}
