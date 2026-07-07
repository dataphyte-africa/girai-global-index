import fs from "node:fs";
import path from "node:path";
import type { SanityClient } from "next-sanity";
import type { SanityImage } from "../src/content/about.defaults";

export type SanityImageField = {
  _type: "image";
  alt?: string;
  asset: { _type: "reference"; _ref: string };
};

const uploadCache = new Map<string, string>();

function mimeFor(filename: string): string {
  switch (path.extname(filename).toLowerCase()) {
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    default:
      return "application/octet-stream";
  }
}

/**
 * Upload an image and return a Sanity image field (cached per source).
 * Accepts a `/public` path (read from disk) or an absolute http(s) URL
 * (fetched over the network) so remote placeholder images can be seeded too.
 */
export async function uploadPublicImage(
  client: SanityClient,
  image: SanityImage | null | undefined
): Promise<SanityImageField | undefined> {
  if (!image?.url) return undefined;

  const src = image.url;
  const isRemote = /^https?:\/\//i.test(src);
  let assetId = uploadCache.get(src);

  if (!assetId) {
    let buffer: Buffer;
    let filename: string;

    if (isRemote) {
      try {
        const res = await fetch(src);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        buffer = Buffer.from(await res.arrayBuffer());
      } catch (err) {
        console.warn(`  ⚠ could not fetch remote image: ${src} (${String(err)})`);
        return undefined;
      }
      const base = path.basename(new URL(src).pathname) || "remote-image";
      filename = /\.(png|jpe?g|webp)$/i.test(base) ? base : `${base}.jpg`;
    } else {
      const filePath = path.join(process.cwd(), "public", src.replace(/^\//, ""));
      if (!fs.existsSync(filePath)) {
        console.warn(`  ⚠ image not found: ${src}`);
        return undefined;
      }
      buffer = fs.readFileSync(filePath);
      filename = path.basename(filePath);
    }

    const asset = await client.assets.upload("image", buffer, {
      filename,
      contentType: mimeFor(filename),
      source: {
        id: `girai-seed${src.replace(/[/:]/g, "-")}`,
        name: filename,
      },
    });

    assetId = asset._id;
    uploadCache.set(src, assetId);
    console.log(`  ↑ uploaded ${src}`);
  }

  return {
    _type: "image",
    ...(image.alt ? { alt: image.alt } : {}),
    asset: { _type: "reference", _ref: assetId },
  };
}
