import { Amiri, Noto_Naskh_Arabic } from "next/font/google";
import type { Metadata } from "next";
import "../globals.css";

const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "الشيخ سعيد الكملي - شرح موطأ الإمام مالك",
    template: "%s | الشيخ سعيد الكملي",
  },
  description: "المكتبة الشاملة لدروس شرح موطأ الإمام مالك للشيخ سعيد الكملي",
  openGraph: {
    type: "website",
    locale: "ar_SA",
    siteName: "الشيخ سعيد الكملي",
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
  },
  alternates: {
    canonical: "/",
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
