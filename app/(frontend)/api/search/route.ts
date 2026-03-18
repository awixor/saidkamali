import { getPayload } from "payload";
import config from "@payload-config";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q || q.length < 2) {
    return NextResponse.json({ books: [], chapters: [], videos: [] });
  }

  const payload = await getPayload({ config });

  const [booksResult, chaptersResult, videosResult] = await Promise.all([
    payload.find({
      collection: "books",
      where: { name: { contains: q } },
      sort: "order",
      limit: 5,
    }),
    payload.find({
      collection: "chapters",
      where: { name: { contains: q } },
      sort: "order",
      limit: 8,
      depth: 1,
    }),
    payload.find({
      collection: "videos",
      where: {
        or: [
          { title: { contains: q } },
          { description: { contains: q } },
        ],
      },
      sort: "lessonNumber",
      limit: 10,
      depth: 1,
    }),
  ]);

  const books = booksResult.docs.map((b) => ({
    id: String(b.id),
    slug: b.slug,
    name: b.name,
  }));

  const chapters = chaptersResult.docs.map((c) => ({
    id: String(c.id),
    name: c.name,
    bookName: typeof c.book === "object" && c.book ? c.book.name : null,
  }));

  const videos = videosResult.docs.map((v) => ({
    id: String(v.id),
    title: v.title,
    youtubeId: v.youtubeId,
    lessonNumber: v.lessonNumber,
    bookName: typeof v.book === "object" && v.book ? v.book.name : null,
    chapterName: typeof v.chapter === "object" && v.chapter ? v.chapter.name : null,
  }));

  return NextResponse.json({ books, chapters, videos });
}
