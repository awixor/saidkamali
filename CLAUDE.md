# Said Kamali Digital Library

Build a personal video library website for الشيخ سعيد الكملي (Sheikh Said Al-Kamali) —
a Moroccan Islamic scholar known for his detailed explanation of Muwatta Imam Malik.
The site organizes all his YouTube videos by Book and Chapter, similar to eyadqunaibi.com.

Reference: https://eyadqunaibi.com
Existing site to improve upon: https://saidelkamali.com

## Identity

- Full name: الشيخ سعيد بن محمد الكملي
- Specialty: شرح موطأ الإمام مالك (Explanation of Muwatta Imam Malik)
- Language: Arabic only (RTL)
- YouTube video example ID: fgPYSrwVMiY

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Payload CMS 3.x (runs inside the same Next.js project)
- MongoDB Atlas (free tier) as the database

## Content Structure

The sheikh's content follows the structure of the Muwatta book:
Each video belongs to a Book (كتاب), and each Book has multiple Chapters (باب).
Videos are sequential lessons — درس 1, درس 2, درس 3... up to 100+ lessons.

Real Books from the Muwatta (use these as seed data):

- كتاب وقوت الصلاة (Book of Prayer Times)
- كتاب الطهارة (Book of Purification)
- كتاب الصلاة (Book of Prayer)
- كتاب السهو (Book of Forgetfulness in Prayer)
- كتاب الجمعة (Book of Friday Prayer)
- كتاب صلاة الليل (Book of Night Prayer)
- كتاب صلاة الجماعة (Book of Congregational Prayer)

## Payload Collections

### Videos collection /collections/Videos.ts

Fields:

- youtubeId (text, required)
- title (text, required) — Arabic, e.g. "الدرس 3 – بَاب وُقُوتِ الصَّلاَة"
- lessonNumber (number, required) — e.g. 3
- book (relationship → Books, required)
- chapter (text) — the باب name within the book
- publishedAt (date)
- durationMinutes (number)

### Books collection /collections/Books.ts

Fields:

- slug (text, required, unique) — e.g. "woqoot-al-salah"
- name (text, required) — Arabic, e.g. "كتاب وقوت الصلاة"
- order (number, required) — for sorting books in Muwatta sequence
- coverVideoId (relationship → Videos)

## Payload Config /payload.config.ts

- Register both collections: Videos, Books
- Connect to MongoDB via MONGODB_URI env variable
- Admin panel at /admin

## Environment Variables

Create .env.local:

```
MONGODB_URI=mongodb+srv://...
PAYLOAD_SECRET=some-long-random-string
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

## Pages to Build

### 1. Homepage /app/ar/page.tsx

- Sticky navbar: site name right (RTL) + book links + no language switcher
- Hero section:
  - Large Amiri font heading: "الشيخ سعيد الكملي"
  - Subtitle: "المكتبة الشاملة لدروس شرح موطأ الإمام مالك"
  - Total lesson count badge: e.g. "١١٩ درسًا"
  - Thin gold divider
- Books grid (2 cols mobile, 3-4 cols desktop):
  - YouTube thumbnail from coverVideo
  - Book name (كتاب وقوت الصلاة)
  - Lesson count per book
  - Gold border on hover
- Footer: "© ١٤٤٦ - سعيد الكملي" (Hijri year)

### 2. Book page /app/ar/books/[slug]/page.tsx

- Hero: book name + total lessons in this book
- Ordered grid of all lessons in this book (sorted by lessonNumber)
- Each card shows: lesson number, chapter name (باب), YouTube thumbnail, duration

### 3. All Videos page /app/ar/videos/page.tsx

- Title: "جميع الدروس"
- Filter by book (pill buttons)
- Ordered list/grid of all lessons across all books
- Client-side filtering

### 4. Video Card component /components/VideoCard.tsx

- YouTube thumbnail: https://img.youtube.com/vi/[youtubeId]/hqdefault.jpg
- Lesson number badge (gold, top-right corner): "١٠٣"
- Lesson title in Arabic (Amiri font)
- Chapter name (باب) as subtitle in smaller text
- Duration if available
- Entire card links to https://youtube.com/watch?v=[youtubeId] (new tab)
- Gold border on hover

## Navigation

- Sticky navbar, warm off-white (#FAFAF7) background
- Right side (RTL): "الشيخ سعيد الكملي" in Amiri font
- Center: book links (up to 5, rest in dropdown)
- Left side: "جميع الدروس" link
- Mobile: hamburger menu

## Design & Branding

### Feel

Classical Islamic scholarly aesthetic. Like a digital edition of a traditional
Arabic kitab — dignified, structured, content-first. NOT modern tech/startup.

### Colors

- Background: #FAFAF7 (warm off-white, aged paper feel)
- Text: #1C1C1C
- Accent: #B8860B (antique gold)
- Secondary: #2D5016 (deep Islamic green)
- Card background: #FFFFFF
- Borders: #E8E4DC

### Typography

- Headings: "Amiri" from Google Fonts (classical Naskh, used in Quran prints)
- Body: "Noto Naskh Arabic" from Google Fonts
- Load via next/font/google

### Details

- Lesson number badges in gold
- Thin gold (1px) top border on cards
- Section dividers: thin gold line with small geometric diamond ◆ in center
- Rounded corners: 4px max
- No emojis

## Data Fetching

Use Payload local API in all server components:

```ts
import { getPayload } from "payload";
import config from "@payload-config";

const payload = await getPayload({ config });

// Get all books ordered by sequence
const books = await payload.find({
  collection: "books",
  sort: "order",
});

// Get all lessons in a book
const videos = await payload.find({
  collection: "videos",
  where: { book: { equals: bookId } },
  sort: "lessonNumber",
});
```

## Seed Data

After setup, create in Payload admin (/admin):

Books (in order):

1. { slug: "woqoot-al-salah", name: "كتاب وقوت الصلاة", order: 1 }
2. { slug: "al-tahara", name: "كتاب الطهارة", order: 2 }
3. { slug: "al-salah", name: "كتاب الصلاة", order: 3 }
4. { slug: "al-sahw", name: "كتاب السهو", order: 4 }
5. { slug: "al-jumua", name: "كتاب الجمعة", order: 5 }
6. { slug: "salat-al-layl", name: "كتاب صلاة الليل", order: 6 }
7. { slug: "salat-al-jamaa", name: "كتاب صلاة الجماعة", order: 7 }

Sample videos (5 lessons, all using youtubeId: "fgPYSrwVMiY"):

- lessonNumber: 1, title: "الدرس 1 – بَاب وُقُوتِ الصَّلاَة", book: woqoot-al-salah
- lessonNumber: 2, title: "الدرس 2 – بَاب وُقُوتِ الصَّلاَة", book: woqoot-al-salah
- lessonNumber: 3, title: "الدرس 3 – بَاب وُقُوتِ الصَّلاَة", book: woqoot-al-salah
- lessonNumber: 17, title: "الدرس 17 – باب الْعَمَلِ فِي الْوُضُوءِ", book: al-tahara
- lessonNumber: 57, title: "الدرس 57 – باب مَا جَاءَ فِي النِّدَاءِ لِلصَّلاَةِ", book: al-salah

## SEO

- <html lang="ar" dir="rtl"> on all pages
- Page titles in Arabic
- og:image from coverVideo YouTube thumbnail
- sitemap.xml and robots.txt

## GitHub Workflow — Repo Setup & Incremental Commits

### Initial Setup

After scaffolding the project, immediately initialize a Git repo and push to GitHub:

```bash
git init
git add .
git commit -m "chore: initial Next.js + Payload CMS scaffold"
gh repo create saidkamali --public --source=. --remote=origin --push
```

### Commit Strategy

Commit after every meaningful, working unit of work — not at the end of everything.
Never commit broken code. Each commit should leave the project in a runnable state.

Commit after each of these milestones:

```bash
# 1. Project scaffold
git commit -m "chore: scaffold Next.js 14 with TypeScript, Tailwind, Payload CMS"

# 2. Collections defined
git commit -m "feat: add Books and Videos Payload collections"

# 3. Payload config wired up
git commit -m "feat: configure Payload with MongoDB, register collections"

# 4. Shared components
git commit -m "feat: add Navbar, Footer, and VideoCard components"

# 5. Homepage
git commit -m "feat: build homepage with hero, books grid, and lesson count"

# 6. Book page
git commit -m "feat: add book detail page with ordered lessons grid"

# 7. All videos page
git commit -m "feat: add all videos page with client-side book filter"

# 8. Fonts and design tokens
git commit -m "style: apply Amiri + Noto Naskh Arabic fonts and color palette"

# 9. SEO
git commit -m "feat: add dynamic metadata, og:image, sitemap, robots.txt"

# 10. Deployment config
git commit -m "chore: add vercel.json, .env.example, and CONTENT.md"
```

### Commit Message Format

Use conventional commits:

- feat: new feature or page
- fix: bug fix
- style: visual/CSS changes only
- chore: config, tooling, dependencies
- docs: README or documentation only
- refactor: code restructure, no behavior change

### Branch Strategy

Work directly on main for this solo project.
If experimenting with a risky change, create a branch:

```bash
git checkout -b experiment/new-homepage-layout
# if good:
git checkout main && git merge experiment/new-homepage-layout
# if not:
git checkout main && git branch -D experiment/new-homepage-layout
```

### .gitignore

Make sure these are ignored:

```
.env.local
.env
node_modules/
.next/
.payload/
```

## Deployment (Vercel)

- Connect the GitHub repo to Vercel (auto-deploy on push to main)
- Add MONGODB_URI, PAYLOAD_SECRET, NEXT_PUBLIC_SERVER_URL to Vercel env vars
- vercel.json:

```json
{
  "functions": {
    "app/api/**": { "maxDuration": 30 }
  }
}
```

- .env.example with all required variables
- /CONTENT.md explaining how to add new lessons via /admin
