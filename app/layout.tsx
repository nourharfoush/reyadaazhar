import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "منظومة المتابعة والقياس والتقييم | المشروع القومي للياقة البدنية",
  description: "منصة إدارة وتتبع المشروع القومي للياقة البدنية بالمعاهد الأزهرية - المتابعة الميدانية والقياس والتقييم والتقويم",
  keywords: "لياقة بدنية, معاهد أزهرية, متابعة, قياس, تقييم, تقويم",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&family=Tajawal:wght@300;400;500;700;800;900&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>{children}</body>
    </html>
  );
}
