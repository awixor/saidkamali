import type { MetadataRoute } from "next";
import { getPayload } from "payload";
import config from "@payload-config";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/ar`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/ar/videos`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  try {
    const payload = await getPayload({ config });
    const { docs: books } = await payload.find({
      collection: "books",
      sort: "order",
      limit: 100,
    });

    const bookPages: MetadataRoute.Sitemap = books.map((book) => ({
      url: `${baseUrl}/ar/books/${book.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    }));

    return [...staticPages, ...bookPages];
  } catch {
    return staticPages;
  }
}
