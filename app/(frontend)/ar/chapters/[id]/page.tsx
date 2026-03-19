import { getPayload } from "payload";
import config from "@payload-config";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import NavbarWrapper from "@/components/NavbarWrapper";
import Footer from "@/components/Footer";
import VideoCard from "@/components/VideoCard";
import Divider from "@/components/Divider";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const payload = await getPayload({ config });
  const chapter = await payload
    .findByID({
      collection: "chapters",
      id,
    })
    .catch(() => null);

  if (!chapter) return { title: "غير موجود" };

  const bookName =
    typeof chapter.book === "object" && chapter.book
      ? (chapter.book as { name: string }).name
      : "";

  return {
    title: `${chapter.name} - ${bookName} - الشيخ سعيد الكملي`,
    description: `دروس ${chapter.name} من ${bookName}`,
  };
}

export default async function ChapterPage({ params }: Props) {
  const { id } = await params;
  const payload = await getPayload({ config });

  const chapter = await payload
    .findByID({
      collection: "chapters",
      id,
      depth: 1,
    })
    .catch(() => null);

  if (!chapter) notFound();

  const bookName =
    typeof chapter.book === "object" && chapter.book
      ? (chapter.book as { name: string }).name
      : "";
  const bookSlug =
    typeof chapter.book === "object" && chapter.book
      ? (chapter.book as { slug: string }).slug
      : "";

  const { docs: videos, totalDocs } = await payload.find({
    collection: "videos",
    where: { chapter: { equals: chapter.id } },
    sort: "lessonNumber",
    limit: 500,
    depth: 0,
  });

  return (
    <>
      <NavbarWrapper />

      <main>
        {/* Breadcrumb */}
        <section className="max-w-7xl mx-auto px-4 pt-6">
          <nav className="font-naskh text-sm text-foreground/50 flex gap-2 items-center">
            <a href="/ar" className="hover:text-accent transition-colors">
              الرئيسية
            </a>
            <span>›</span>
            <a
              href={`/ar/books/${bookSlug}`}
              className="hover:text-accent transition-colors"
            >
              {bookName}
            </a>
            <span>›</span>
            <span className="text-foreground/80">{chapter.name}</span>
          </nav>
        </section>

        {/* Hero */}
        <section className="py-10 md:py-14 text-center">
          <div className="max-w-4xl mx-auto px-4">
            <p className="font-naskh text-sm text-accent mb-6">{bookName}</p>
            <h1 className="font-amiri text-3xl md:text-5xl font-bold text-foreground leading-tight">
              {chapter.name}
            </h1>
            <p className="font-naskh text-foreground/60 mt-3">
              {totalDocs} دروس
            </p>
            <Divider />
          </div>
        </section>

        {/* Lessons Grid */}
        <section className="max-w-7xl mx-auto px-4 pb-16">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {videos.map((video) => (
              <VideoCard
                key={video.id}
                id={String(video.id)}
                youtubeId={video.youtubeId}
                lessonNumber={video.lessonNumber}
                title={video.title}
                chapter={chapter.name}
                durationMinutes={video.durationMinutes}
              />
            ))}
          </div>

          {videos.length === 0 && (
            <p className="text-center font-naskh text-foreground/50 py-16">
              لا توجد دروس بعد
            </p>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}
