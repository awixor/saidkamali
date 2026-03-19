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

    const [{ docs: books }, { docs: chapters }, { docs: videos }] =
      await Promise.all([
        payload.find({ collection: "books", sort: "order", limit: 100 }),
        payload.find({ collection: "chapters", sort: "order", limit: 500 }),
        payload.find({
          collection: "videos",
          sort: "lessonNumber",
          limit: 2000,
        }),
      ]);

    const bookPages: MetadataRoute.Sitemap = books.map((book) => ({
      url: `${baseUrl}/ar/books/${book.slug}`,
      lastModified: new Date(book.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    }));

    const chapterPages: MetadataRoute.Sitemap = chapters.map((chapter) => ({
      url: `${baseUrl}/ar/chapters/${chapter.id}`,
      lastModified: new Date(chapter.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    const videoPages: MetadataRoute.Sitemap = videos.map((video) => ({
      url: `${baseUrl}/ar/videos/${video.id}`,
      lastModified: new Date(video.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

    return [...staticPages, ...bookPages, ...chapterPages, ...videoPages];
  } catch {
    return staticPages;
  }
}
