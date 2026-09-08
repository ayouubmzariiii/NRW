import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { formatDate, imageSize, type PostSummary } from "@/lib/content";
import { Reveal } from "@/components/reveal";
import { ArrowRight, ClockIcon } from "@/components/icons";

export function PostCard({ post, index = 0, priority = false, className }: { post: PostSummary; index?: number; priority?: boolean; className?: string }) {
  const img = post.featured;
  const size = img ? imageSize(img.src, { width: 1600, height: 900 }) : null;
  return (
    <Reveal as="article" delay={(index % 3) * 70} className={clsx("group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-ink/6 bg-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift", className)}>
      <Link href={post.path} className="relative block aspect-video overflow-hidden bg-sage-100">
        {img && size ? (
          <Image src={img.src} alt={img.alt || post.title} fill sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw" quality={60} priority={priority} className="object-cover transition duration-700 group-hover:scale-105" />
        ) : (
          <span className="absolute inset-0 grid place-items-center font-display text-4xl text-sage-300">Ratgeber</span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-muted">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span className="inline-flex items-center gap-1"><ClockIcon className="h-3.5 w-3.5" /> {post.readingMinutes} Min.</span>
        </div>
        <h3 className="mt-3 font-sans text-[1.08rem] font-bold leading-snug text-ink">
          <Link href={post.path} className="transition hover:text-leaf-700">{post.title}</Link>
        </h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted">{post.excerpt}</p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-leaf-700">Weiterlesen <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
      </div>
    </Reveal>
  );
}
