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

/** Upload a /public asset and return a Sanity image field (cached per path). */
export async function uploadPublicImage(
  client: SanityClient,
  image: SanityImage | null | undefined
): Promise<SanityImageField | undefined> {
  if (!image?.url) return undefined;

  const publicPath = image.url;
  let assetId = uploadCache.get(publicPath);

  if (!assetId) {
    const filePath = path.join(process.cwd(), "public", publicPath.replace(/^\//, ""));
    if (!fs.existsSync(filePath)) {
      console.warn(`  ⚠ image not found: ${publicPath}`);
      return undefined;
    }

    const buffer = fs.readFileSync(filePath);
    const filename = path.basename(filePath);
    const asset = await client.assets.upload("image", buffer, {
      filename,
      contentType: mimeFor(filename),
      source: {
        id: `girai-seed${publicPath.replace(/\//g, "-")}`,
        name: filename,
      },
    });

    assetId = asset._id;
    uploadCache.set(publicPath, assetId);
    console.log(`  ↑ uploaded ${publicPath}`);
  }

  return {
    _type: "image",
    ...(image.alt ? { alt: image.alt } : {}),
    asset: { _type: "reference", _ref: assetId },
  };
}
