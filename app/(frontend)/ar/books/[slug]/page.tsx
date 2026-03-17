import { getPayload } from "payload";
import config from "@payload-config";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import NavbarWrapper from "@/components/NavbarWrapper";
import Footer from "@/components/Footer";
import VideoCard from "@/components/VideoCard";
import Divider from "@/components/Divider";

type Props = {
  params: Promise<{ slug: string }>;
};

function toArabicNumerals(num: number): string {
  const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return String(num)
    .split("")
    .map((d) => arabicDigits[parseInt(d)] || d)
    .join("");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "books",
    where: { slug: { equals: slug } },
    limit: 1,
  });

  if (!docs[0]) return { title: "غير موجود" };

  return {
    title: `${docs[0].name} - الشيخ سعيد الكملي`,
    description: `دروس ${docs[0].name} من شرح موطأ الإمام مالك`,
  };
}

export default async function BookPage({ params }: Props) {
  const { slug } = await params;
  const payload = await getPayload({ config });

  const { docs: books } = await payload.find({
    collection: "books",
    where: { slug: { equals: slug } },
    limit: 1,
  });

  const book = books[0];
  if (!book) notFound();

  const { docs: videos, totalDocs } = await payload.find({
    collection: "videos",
    where: { book: { equals: book.id } },
    sort: "lessonNumber",
    limit: 500,
    depth: 1,
  });

  return (
    <>
      <NavbarWrapper />

      <main>
        {/* Hero */}
        <section className="py-12 md:py-16 text-center">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="font-amiri text-3xl md:text-5xl font-bold text-foreground leading-tight">
              {book.name}
            </h1>
            <p className="font-naskh text-foreground/60 mt-3">
              {toArabicNumerals(totalDocs)} درس
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
                chapter={typeof video.chapter === "object" && video.chapter ? video.chapter.name : null}
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
