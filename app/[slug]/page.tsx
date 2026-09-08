import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPage, posts, SERVICE_PAGE_SLUGS } from "@/lib/content";
import { getPost } from "@/lib/posts.server";
import { ServicePage, servicePageMetadata } from "@/components/templates/service-page";
import { ArticlePage, articlePageMetadata } from "@/components/templates/article-page";

export const dynamicParams = false;

export function generateStaticParams() {
  return [...SERVICE_PAGE_SLUGS.map((slug) => ({ slug })), ...posts.map((p) => ({ slug: p.slug }))];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = SERVICE_PAGE_SLUGS.includes(slug) ? getPage(slug) : undefined;
  if (page) return servicePageMetadata(page);
  const post = getPost(slug);
  if (post) return articlePageMetadata(post);
  return {};
}

export default async function SlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = SERVICE_PAGE_SLUGS.includes(slug) ? getPage(slug) : undefined;
  if (page) return <ServicePage page={page} />;
  const post = getPost(slug);
  if (post) return <ArticlePage post={post} />;
  notFound();
}
