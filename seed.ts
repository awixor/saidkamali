import { getPayload } from "payload";
import config from "@payload-config";

const books = [
  { slug: "woqoot-al-salah", name: "كتاب وقوت الصلاة", order: 1 },
  { slug: "al-tahara", name: "كتاب الطهارة", order: 2 },
  { slug: "al-salah", name: "كتاب الصلاة", order: 3 },
  { slug: "al-sahw", name: "كتاب السهو", order: 4 },
  { slug: "al-jumua", name: "كتاب الجمعة", order: 5 },
  { slug: "salat-al-layl", name: "كتاب صلاة الليل", order: 6 },
  { slug: "salat-al-jamaa", name: "كتاب صلاة الجماعة", order: 7 },
];

// Chapters per book: { bookSlug, name, order }
const chapters = [
  { bookSlug: "woqoot-al-salah", name: "بَاب وُقُوتِ الصَّلاَة", order: 1 },
  { bookSlug: "al-tahara", name: "باب الْعَمَلِ فِي الْوُضُوءِ", order: 1 },
  { bookSlug: "al-salah", name: "باب مَا جَاءَ فِي النِّدَاءِ لِلصَّلاَةِ", order: 1 },
];

// Videos: reference chapter by bookSlug + chapterName
const videos = [
  {
    youtubeId: "fgPYSrwVMiY",
    title: "الدرس 1 – بَاب وُقُوتِ الصَّلاَة",
    lessonNumber: 1,
    bookSlug: "woqoot-al-salah",
    chapterName: "بَاب وُقُوتِ الصَّلاَة",
  },
  {
    youtubeId: "fgPYSrwVMiY",
    title: "الدرس 2 – بَاب وُقُوتِ الصَّلاَة",
    lessonNumber: 2,
    bookSlug: "woqoot-al-salah",
    chapterName: "بَاب وُقُوتِ الصَّلاَة",
  },
  {
    youtubeId: "fgPYSrwVMiY",
    title: "الدرس 3 – بَاب وُقُوتِ الصَّلاَة",
    lessonNumber: 3,
    bookSlug: "woqoot-al-salah",
    chapterName: "بَاب وُقُوتِ الصَّلاَة",
  },
  {
    youtubeId: "fgPYSrwVMiY",
    title: "الدرس 17 – باب الْعَمَلِ فِي الْوُضُوءِ",
    lessonNumber: 17,
    bookSlug: "al-tahara",
    chapterName: "باب الْعَمَلِ فِي الْوُضُوءِ",
  },
  {
    youtubeId: "fgPYSrwVMiY",
    title: "الدرس 57 – باب مَا جَاءَ فِي النِّدَاءِ لِلصَّلاَةِ",
    lessonNumber: 57,
    bookSlug: "al-salah",
    chapterName: "باب مَا جَاءَ فِي النِّدَاءِ لِلصَّلاَةِ",
  },
];

async function seed() {
  const payload = await getPayload({ config });

  console.log("Seeding books...");
  const bookMap: Record<string, string> = {};

  for (const book of books) {
    const existing = await payload.find({
      collection: "books",
      where: { slug: { equals: book.slug } },
      limit: 1,
    });

    if (existing.docs.length > 0) {
      bookMap[book.slug] = String(existing.docs[0].id);
      console.log(`  Book "${book.name}" already exists, skipping.`);
    } else {
      const created = await payload.create({ collection: "books", data: book });
      bookMap[book.slug] = String(created.id);
      console.log(`  Created book: ${book.name}`);
    }
  }

  console.log("Seeding chapters...");
  // key: "bookSlug::chapterName" → id
  const chapterMap: Record<string, string> = {};

  for (const chapter of chapters) {
    const bookId = bookMap[chapter.bookSlug];
    const key = `${chapter.bookSlug}::${chapter.name}`;

    const existing = await payload.find({
      collection: "chapters",
      where: {
        and: [
          { name: { equals: chapter.name } },
          { book: { equals: bookId } },
        ],
      },
      limit: 1,
    });

    if (existing.docs.length > 0) {
      chapterMap[key] = String(existing.docs[0].id);
      console.log(`  Chapter "${chapter.name}" already exists, skipping.`);
    } else {
      const created = await payload.create({
        collection: "chapters",
        data: { name: chapter.name, book: bookId, order: chapter.order },
      });
      chapterMap[key] = String(created.id);
      console.log(`  Created chapter: ${chapter.name}`);
    }
  }

  console.log("Seeding videos...");
  for (const video of videos) {
    const bookId = bookMap[video.bookSlug];
    const chapterId = chapterMap[`${video.bookSlug}::${video.chapterName}`];

    const existing = await payload.find({
      collection: "videos",
      where: {
        and: [
          { lessonNumber: { equals: video.lessonNumber } },
          { book: { equals: bookId } },
        ],
      },
      limit: 1,
    });

    if (existing.docs.length > 0) {
      console.log(`  Video "${video.title}" already exists, skipping.`);
    } else {
      await payload.create({
        collection: "videos",
        data: {
          youtubeId: video.youtubeId,
          title: video.title,
          lessonNumber: video.lessonNumber,
          book: bookId,
          chapter: chapterId,
        },
      });
      console.log(`  Created video: ${video.title}`);
    }
  }

  console.log("Seeding complete!");
  process.exit(0);
}

seed();
