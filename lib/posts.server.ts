import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import type { PostRecord } from "@/lib/content";

/** Server-only loader for full article bodies (kept out of lib/content so client bundles never see node:fs). */
export const getPost = cache((slug: string): PostRecord | null => {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  const file = path.join(process.cwd(), "content", "posts", `${slug}.json`);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf8")) as PostRecord;
});
