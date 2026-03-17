import { getPayload } from "payload";
import config from "@payload-config";
import type { Metadata } from "next";
import NavbarWrapper from "@/components/NavbarWrapper";
import Footer from "@/components/Footer";
import Divider from "@/components/Divider";
import VideosClient from "./VideosClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "جميع الدروس - الشيخ سعيد الكملي",
  description: "جميع دروس شرح موطأ الإمام مالك للشيخ سعيد الكملي",
};

export default async function AllVideosPage() {
  const payload = await getPayload({ config });

  const { docs: books } = await payload.find({
    collection: "books",
    sort: "order",
    limit: 100,
  });

  const { docs: videos } = await payload.find({
    collection: "videos",
    sort: "lessonNumber",
    limit: 1000,
    depth: 1,
  });

  const serializedBooks = books.map((book) => ({
    id: String(book.id),
    name: book.name,
  }));

  const serializedVideos = videos.map((video) => ({
    id: String(video.id),
    youtubeId: video.youtubeId,
    title: video.title,
    lessonNumber: video.lessonNumber,
    chapter: typeof video.chapter === "object" && video.chapter ? video.chapter.name : null,
    durationMinutes: video.durationMinutes || null,
    bookId: String(
      typeof video.book === "object" ? video.book.id : video.book
    ),
  }));

  return (
    <>
      <NavbarWrapper />

      <main>
        <section className="py-12 md:py-16 text-center">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="font-amiri text-3xl md:text-5xl font-bold text-foreground leading-tight">
              جميع الدروس
            </h1>
            <Divider />
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 pb-16">
          <VideosClient books={serializedBooks} videos={serializedVideos} />
        </section>
      </main>

      <Footer />
    </>
  );
}
