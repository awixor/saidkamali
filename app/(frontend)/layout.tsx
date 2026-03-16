import { Amiri, Noto_Naskh_Arabic } from "next/font/google";
import "../globals.css";

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
