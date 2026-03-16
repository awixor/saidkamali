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

const videos = [
  {
    youtubeId: "fgPYSrwVMiY",
    title: "الدرس 1 – بَاب وُقُوتِ الصَّلاَة",
    lessonNumber: 1,
    bookSlug: "woqoot-al-salah",
    chapter: "بَاب وُقُوتِ الصَّلاَة",
  },
  {
    youtubeId: "fgPYSrwVMiY",
    title: "الدرس 2 – بَاب وُقُوتِ الصَّلاَة",
    lessonNumber: 2,
    bookSlug: "woqoot-al-salah",
    chapter: "بَاب وُقُوتِ الصَّلاَة",
  },
  {
    youtubeId: "fgPYSrwVMiY",
    title: "الدرس 3 – بَاب وُقُوتِ الصَّلاَة",
    lessonNumber: 3,
    bookSlug: "woqoot-al-salah",
    chapter: "بَاب وُقُوتِ الصَّلاَة",
  },
  {
    youtubeId: "fgPYSrwVMiY",
    title: "الدرس 17 – باب الْعَمَلِ فِي الْوُضُوءِ",
    lessonNumber: 17,
    bookSlug: "al-tahara",
    chapter: "باب الْعَمَلِ فِي الْوُضُوءِ",
  },
  {
    youtubeId: "fgPYSrwVMiY",
    title: "الدرس 57 – باب مَا جَاءَ فِي النِّدَاءِ لِلصَّلاَةِ",
    lessonNumber: 57,
    bookSlug: "al-salah",
    chapter: "باب مَا جَاءَ فِي النِّدَاءِ لِلصَّلاَةِ",
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
      const created = await payload.create({
        collection: "books",
        data: book,
      });
      bookMap[book.slug] = String(created.id);
      console.log(`  Created book: ${book.name}`);
    }
  }

  console.log("Seeding videos...");
  for (const video of videos) {
    const bookId = bookMap[video.bookSlug];
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
          chapter: video.chapter,
        },
      });
      console.log(`  Created video: ${video.title}`);
    }
  }

  console.log("Seeding complete!");
  process.exit(0);
}

seed();
