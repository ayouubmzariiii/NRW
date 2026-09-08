import Image from "next/image";
import Link from "next/link";
import parse, { domToReact, Element, type DOMNode, type HTMLReactParserOptions } from "html-react-parser";
import clsx from "clsx";
import { imageSize } from "@/lib/content";

/**
 * Renders migrated WordPress HTML as React, swapping <img> for next/image
 * (with real dimensions → no layout shift) and internal <a> for <Link>.
 */
export function Prose({ html, className, invert = false, priorityFirstImage = false }: { html: string; className?: string; invert?: boolean; priorityFirstImage?: boolean }) {
  let imgIndex = 0;
  const options: HTMLReactParserOptions = {
    replace(node) {
      if (!(node instanceof Element)) return undefined;
      if (node.name === "img") {
        const src = node.attribs.src || "";
        if (!src.startsWith("/")) return undefined;
        const { width, height } = imageSize(src, { width: Number(node.attribs.width) || 1600, height: Number(node.attribs.height) || 1000 });
        const i = imgIndex++;
        return (
          <Image
            src={src}
            alt={node.attribs.alt || ""}
            width={width}
            height={height}
            sizes="(min-width: 1024px) 720px, 100vw"
            quality={75}
            priority={priorityFirstImage && i === 0}
            loading={priorityFirstImage && i === 0 ? undefined : "lazy"}
          />
        );
      }
      if (node.name === "a") {
        const href = node.attribs.href || "";
        if (href.startsWith("/")) {
          return <Link href={href}>{domToReact(node.children as DOMNode[], options)}</Link>;
        }
      }
      if (node.name === "table") {
        return (
          <div className="table-wrap">
            <table>{domToReact(node.children as DOMNode[], options)}</table>
          </div>
        );
      }
      return undefined;
    },
  };
  return <div className={clsx("prose-nrw", invert && "prose-invert", className)}>{parse(html, options)}</div>;
}
