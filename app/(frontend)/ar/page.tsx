import { getPayload } from "payload";
import config from "@payload-config";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import NavbarWrapper from "@/components/NavbarWrapper";
import Footer from "@/components/Footer";
import Divider from "@/components/Divider";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "الشيخ سعيد الكملي - شرح موطأ الإمام مالك",
  description: "المكتبة الشاملة لدروس شرح موطأ الإمام مالك للشيخ سعيد الكملي",
  openGraph: {
    title: "الشيخ سعيد الكملي - شرح موطأ الإمام مالك",
    description: "المكتبة الشاملة لدروس شرح موطأ الإمام مالك",
  },
};

export default async function HomePage() {
  const payload = await getPayload({ config });

  const { docs: books } = await payload.find({
    collection: "books",
    sort: "order",
    limit: 100,
  });

  const { totalDocs: totalLessons } = await payload.find({
    collection: "videos",
    limit: 0,
  });

  // Get lesson counts per book
  const booksWithCounts = await Promise.all(
    books.map(async (book) => {
      const { totalDocs } = await payload.find({
        collection: "videos",
        where: { book: { equals: book.id } },
        limit: 0,
      });

      const coverVideoId =
        book.coverVideoId && typeof book.coverVideoId === "object"
          ? book.coverVideoId.youtubeId
          : null;

      return {
        id: book.id,
        slug: book.slug,
        name: book.name,
        lessonCount: totalDocs,
        coverYoutubeId: coverVideoId || "fgPYSrwVMiY",
      };
    }),
  );

  return (
    <>
      <NavbarWrapper />

      <main>
        {/* Hero */}
        <section className="py-16 md:py-24 text-center">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="font-amiri text-4xl md:text-6xl font-bold text-foreground leading-tight">
              الشيخ سعيد الكملي
            </h1>
            <p className="font-naskh text-lg md:text-xl text-foreground/70 mt-4">
              المكتبة الشاملة لدروس شرح موطأ الإمام مالك
            </p>
            <div className="mt-6">
              <span className="inline-block bg-accent/10 text-accent font-naskh font-semibold text-sm px-4 py-2 rounded border border-accent/20">
                {totalLessons} درسًا
              </span>
            </div>
            <Divider />
          </div>
        </section>

        {/* Books Grid */}
        <section className="max-w-7xl mx-auto px-4 pb-16">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {booksWithCounts.map((book) => (
              <Link
                key={book.id}
                href={`/ar/books/${book.slug}`}
                className="group block bg-card border border-border border-t-accent border-t rounded hover:border-accent transition-colors overflow-hidden"
              >
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={`https://img.youtube.com/vi/${book.coverYoutubeId}/hqdefault.jpg`}
                    alt={book.name}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3 md:p-4">
                  <h2 className="font-amiri text-sm md:text-base font-bold text-foreground leading-relaxed">
                    {book.name}
                  </h2>
                  <p className="font-naskh text-xs text-foreground/60 mt-1">
                    {book.lessonCount} درس
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
