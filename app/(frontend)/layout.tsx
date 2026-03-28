import { Amiri, Noto_Naskh_Arabic } from "next/font/google";
import type { Metadata } from "next";
import "../globals.css";

const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "الشيخ سعيد الكملي - شرح موطأ الإمام مالك | دروس مفهرسة",
    template: "%s | الشيخ سعيد الكملي",
  },
  description:
    "المكتبة الشاملة لدروس الشيخ سعيد الكملي (Said Kamali) - شرح موطأ الإمام مالك. دروس مفهرسة ومنظمة لسهولة البحث والوصول.",
  keywords: [
    "سعيد الكملي",
    "Said Kamali",
    "دروس الشيخ سعيد الكملي",
    "شرح الموطأ",
    "موطأ الإمام مالك",
    "دروس مفهرسة",
    "الفقه المالكي",
    "الحديث النبوي",
  ],
  authors: [{ name: "Sheikh Said Kamali", url: baseUrl }],
  openGraph: {
    type: "website",
    locale: "ar_SA",
    siteName: "الشيخ سعيد الكملي - Said Kamali",
    title: "الشيخ سعيد الكملي - شرح موطأ الإمام مالك | دروس مفهرسة",
    description:
      "المكتبة الشاملة لدروس الشيخ سعيد الكملي (Said Kamali) - شرح موطأ الإمام مالك. دروس مفهرسة ومنظمة لسهولة البحث والوصول.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "الشيخ سعيد الكملي - شرح موطأ الإمام مالك",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "الشيخ سعيد الكملي - شرح موطأ الإمام مالك | دروس مفهرسة",
    description: "المكتبة الشاملة لدروس الشيخ سعيد الكملي - شرح موطأ الإمام مالك",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "/ar",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

const notoNaskh = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-naskh",
  display: "swap",
});

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${amiri.variable} ${notoNaskh.variable} font-naskh antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
