"use client";

import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { PlayIcon } from "@/components/icons";

/** Click-to-play YouTube embed: zero third-party JS until the visitor taps play. */
export function VideoCard({ id, title, poster, posterAlt, className, priority = false, aspect = "aspect-[9/16]" }: { id: string; title: string; poster: string; posterAlt: string; className?: string; priority?: boolean; aspect?: string }) {
  const [play, setPlay] = useState(false);
  return (
    <div className={clsx("relative overflow-hidden rounded-[2rem] bg-forest-900 shadow-lift", aspect, className)}>
      {play ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button type="button" onClick={() => setPlay(true)} className="group absolute inset-0 h-full w-full text-left">
          <Image src={poster} alt={posterAlt} fill sizes="(min-width: 1024px) 420px, 80vw" quality={75} priority={priority} className="object-cover transition duration-700 group-hover:scale-[1.03]" />
          <span className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-forest-950/10 to-transparent" />
          <span className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-forest-900 shadow-lift transition group-hover:scale-105">
            <PlayIcon className="ml-1 h-9 w-9" />
          </span>
          <span className="absolute inset-x-5 bottom-5 text-white">
            <span className="block text-xs font-bold uppercase tracking-[0.16em] text-leaf-300">Imagefilm</span>
            <span className="mt-1 block font-display text-xl">{title}</span>
            <span className="sr-only"> – Video abspielen</span>
          </span>
        </button>
      )}
    </div>
  );
}
