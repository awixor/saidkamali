import { getPayload } from "payload";
import config from "@payload-config";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import NavbarWrapper from "@/components/NavbarWrapper";
import Footer from "@/components/Footer";
import Divider from "@/components/Divider";
import JsonLd from "@/components/SEO/JsonLd";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "books",
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  });

  if (!docs[0]) return { title: "غير موجود" };

  const book = docs[0];
  const coverYoutubeId =
    typeof book.coverVideoId === "object" && book.coverVideoId
      ? book.coverVideoId.youtubeId
      : "fgPYSrwVMiY";

  return {
    title: `${book.name} - دروس مفهرسة | الشيخ سعيد الكملي`,
    description: `المكتبة الشاملة لدروس ${book.name} (دروس مفهرسة) من شرح موطأ الإمام مالك للشيخ سعيد الكملي`,
    alternates: { canonical: `/ar/books/${slug}` },
    openGraph: {
      title: `${book.name} - دروس مفهرسة | الشيخ سعيد الكملي`,
      description: `المكتبة الشاملة لدروس ${book.name} (دروس مفهرسة) من شرح موطأ الإمام مالك للشيخ سعيد الكملي`,
      url: `/ar/books/${slug}`,
      images: [`https://img.youtube.com/vi/${coverYoutubeId}/maxresdefault.jpg`],
    },
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

  // Fetch chapters for this book
  const { docs: chapters } = await payload.find({
    collection: "chapters",
    where: { book: { equals: book.id } },
    sort: "order",
    limit: 100,
  });

  // Count videos per chapter
  const chapterCounts: Record<string, number> = {};
  await Promise.all(
    chapters.map(async (chapter) => {
      const { totalDocs } = await payload.find({
        collection: "videos",
        where: { chapter: { equals: chapter.id } },
        limit: 0,
      });
      chapterCounts[String(chapter.id)] = totalDocs;
    }),
  );

  // Total lessons in this book
  const { totalDocs } = await payload.find({
    collection: "videos",
    where: { book: { equals: book.id } },
    limit: 0,
  });

  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${book.name} - دروس مفهرسة`,
    description: `دروس ${book.name} من شرح موطأ الإمام مالك للشيخ سعيد الكملي`,
    url: `${baseUrl}/ar/books/${slug}`,
    mainEntity: {
      "@type": "CreativeWorkSeries",
      name: book.name,
      author: {
        "@type": "Person",
        name: "سعيد الكملي",
      },
    },
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <NavbarWrapper />

      <main>
        {/* Hero */}
        <section className="py-12 md:py-16 text-center">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="font-amiri text-3xl md:text-5xl font-bold text-foreground leading-tight">
              {book.name}
            </h1>
            <p className="font-naskh text-foreground/60 mt-3">
              {totalDocs} درس
            </p>
            <Divider />
          </div>
        </section>

        {/* Chapters Grid */}
        <section className="max-w-5xl mx-auto px-4 pb-16">
          {chapters.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {chapters.map((chapter) => {
                const count = chapterCounts[String(chapter.id)] ?? 0;
                return (
                  <Link
                    key={chapter.id}
                    href={`/ar/chapters/${chapter.id}`}
                    className="group block bg-card border border-border rounded-sm p-5 hover:border-accent transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h2 className="font-amiri text-xl font-bold text-foreground group-hover:text-accent transition-colors leading-tight">
                          {chapter.name}
                        </h2>
                        <p className="font-naskh text-sm text-foreground/50 mt-1">
                          {count} درس
                        </p>
                      </div>
                      <span className="font-naskh text-sm text-accent/60 shrink-0 mt-1">
                        {chapter.order}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="text-center font-naskh text-foreground/50 py-16">
              لا توجد أبواب بعد
            </p>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}
