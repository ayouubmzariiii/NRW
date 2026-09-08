"use client";

import { useEffect, useRef } from "react";

export function ReadingProgress({ targetId }: { targetId: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const bar = ref.current;
    const target = document.getElementById(targetId);
    if (!bar || !target) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = target.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const done = Math.min(1, Math.max(0, -rect.top / Math.max(1, total)));
      bar.style.setProperty("--progress", String(done));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, [targetId]);
  return <div ref={ref} aria-hidden className="progress-bar fixed inset-x-0 top-0 z-[60] h-1 bg-leaf-500" />;
}
