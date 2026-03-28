import { getPayload } from "payload";
import config from "@payload-config";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import NavbarWrapper from "@/components/NavbarWrapper";
import Footer from "@/components/Footer";
import Divider from "@/components/Divider";
import LessonsSidebar from "@/components/LessonsSidebar";
import JsonLd from "@/components/SEO/JsonLd";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const payload = await getPayload({ config });

  try {
    const video = await payload.findByID({
      collection: "videos",
      id,
      depth: 1,
    });
    const desc =
      video.description || `${video.title} من شرح موطأ الإمام مالك للشيخ سعيد الكملي`;
    return {
      title: `${video.title} - دروس مفهرسة | الشيخ سعيد الكملي`,
      description: desc,
      alternates: { canonical: `/ar/videos/${id}` },
      openGraph: {
        title: video.title,
        description: desc,
        url: `/ar/videos/${id}`,
        type: "video.other",
        images: [
          {
            url: `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`,
            width: 1280,
            height: 720,
            alt: video.title,
          },
        ],
        videos: [
          {
            url: `https://www.youtube.com/embed/${video.youtubeId}`,
            width: 1280,
            height: 720,
            type: "text/html",
          },
        ],
      },
    };
  } catch {
    return { title: "غير موجود" };
  }
}

export default async function VideoPage({ params }: Props) {
  const { id } = await params;
  const payload = await getPayload({ config });

  let video;
  try {
    video = await payload.findByID({ collection: "videos", id, depth: 1 });
  } catch {
    notFound();
  }

  const book = typeof video.book === "object" ? video.book : null;

  // Get adjacent lessons in the same book for navigation
  const bookId = book ? book.id : video.book;
  const { docs: allLessons } = await payload.find({
    collection: "videos",
    where: { book: { equals: bookId } },
    sort: "lessonNumber",
    limit: 500,
  });

  const currentIndex = allLessons.findIndex(
    (v) => String(v.id) === String(video.id),
  );
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const sidebarLessons = allLessons.map((l) => ({
    id: String(l.id),
    title: l.title,
    lessonNumber: l.lessonNumber,
    chapter: typeof l.chapter === "object" && l.chapter ? l.chapter.name : null,
  }));

  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.title,
    description:
      video.description || `${video.title} من شرح موطأ الإمام مالك للشيخ سعيد الكملي`,
    thumbnailUrl: `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`,
    uploadDate: video.publishedAt || undefined,
    embedUrl: `https://www.youtube.com/embed/${video.youtubeId}`,
    contentUrl: `https://www.youtube.com/watch?v=${video.youtubeId}`,
    ...(video.durationMinutes && {
      duration: `PT${video.durationMinutes}M`,
    }),
    author: {
      "@type": "Person",
      name: "الشيخ سعيد الكملي",
      url: baseUrl,
    },
    isPartOf: book
      ? {
          "@type": "CreativeWorkSeries",
          name: book.name,
          url: `${baseUrl}/ar/books/${book.slug}`,
        }
      : undefined,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "الرئيسية",
        item: `${baseUrl}/ar`,
      },
      ...(book
        ? [
            {
              "@type": "ListItem",
              position: 2,
              name: book.name,
              item: `${baseUrl}/ar/books/${book.slug}`,
            },
          ]
        : []),
      {
        "@type": "ListItem",
        position: book ? 3 : 2,
        name: video.title,
        item: `${baseUrl}/ar/videos/${id}`,
      },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <NavbarWrapper />

      <div className="max-w-7xl mx-auto px-4 py-6 lg:py-8 flex flex-col lg:flex-row gap-6">
        <main className="flex-1 min-w-0">
          {/* Breadcrumb */}
          <nav className="font-naskh text-sm text-foreground/60 mb-4 lg:mb-6 flex items-center gap-2 overflow-x-auto whitespace-nowrap">
            <Link href="/ar" className="hover:text-accent transition-colors shrink-0">
              الرئيسية
            </Link>
            <span className="shrink-0">/</span>
            {book && (
              <>
                <Link
                  href={`/ar/books/${book.slug}`}
                  className="hover:text-accent transition-colors shrink-0"
                >
                  {book.name}
                </Link>
                <span className="shrink-0">/</span>
              </>
            )}
            <span className="text-foreground shrink-0">الدرس {video.lessonNumber}</span>
          </nav>

          {/* Video Player */}
          <div className="aspect-video w-full rounded overflow-hidden border border-border">
            <iframe
              src={`https://www.youtube.com/embed/${video.youtubeId}`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>

          {/* Video Info */}
          <div className="mt-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="font-amiri text-2xl md:text-3xl font-bold text-foreground leading-relaxed">
                  {video.title}
                </h1>
                {video.chapter && typeof video.chapter === "object" && (
                  <p className="font-naskh text-foreground/60 mt-1">
                    {video.chapter.name}
                  </p>
                )}
              </div>
              <span className="shrink-0 bg-accent text-white text-sm font-bold px-3 py-1 rounded font-naskh">
                الدرس {video.lessonNumber}
              </span>
            </div>

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-4 font-naskh text-sm text-foreground/50">
              {book && (
                <Link
                  href={`/ar/books/${book.slug}`}
                  className="hover:text-accent transition-colors"
                >
                  {book.name}
                </Link>
              )}
              {video.durationMinutes && (
                <span>{video.durationMinutes} دقيقة</span>
              )}
              {video.publishedAt && (
                <span>
                  {new Date(video.publishedAt).toLocaleDateString("ar-SA")}
                </span>
              )}
            </div>
          </div>

          <Divider />

          {/* Description */}
          {video.description && (
            <section className="mb-8">
              <h2 className="font-amiri text-xl font-bold text-foreground mb-3">
                وصف الدرس
              </h2>
              <div className="font-naskh text-foreground/80 leading-loose whitespace-pre-line">
                {video.description}
              </div>
            </section>
          )}

          {/* Lesson Navigation */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 py-6 border-t border-border">
            {nextLesson ? (
              <Link
                href={`/ar/videos/${nextLesson.id}`}
                className="group flex items-center gap-2 font-naskh text-sm text-foreground/70 hover:text-accent transition-colors p-3 sm:p-0 rounded border border-border sm:border-0"
              >
                <span className="text-lg">&rarr;</span>
                <div className="min-w-0">
                  <span className="block text-xs text-foreground/40">
                    الدرس التالي
                  </span>
                  <span className="group-hover:text-accent truncate block">
                    {nextLesson.title}
                  </span>
                </div>
              </Link>
            ) : (
              <div />
            )}
            {prevLesson ? (
              <Link
                href={`/ar/videos/${prevLesson.id}`}
                className="group flex items-center gap-2 font-naskh text-sm text-foreground/70 hover:text-accent transition-colors text-left p-3 sm:p-0 rounded border border-border sm:border-0"
              >
                <div className="min-w-0">
                  <span className="block text-xs text-foreground/40">
                    الدرس السابق
                  </span>
                  <span className="group-hover:text-accent truncate block">
                    {prevLesson.title}
                  </span>
                </div>
                <span className="text-lg">&larr;</span>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </main>

        {/* Sidebar - lessons list */}
        <LessonsSidebar
          lessons={sidebarLessons}
          currentId={String(video.id)}
          bookName={book?.name || ""}
        />
      </div>

      <Footer />
    </>
  );
}
