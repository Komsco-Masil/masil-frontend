import type { Metadata, Viewport } from "next";
import EmotionRegistry from "@/lib/emotion-registry";
import "./globals.css";

export const metadata: Metadata = {
  title: "마실 | 소상공인 커뮤니티",
  description: "소상공인을 위한 지역 커뮤니티 — 마실",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body>
        <EmotionRegistry>{children}</EmotionRegistry>
      </body>
    </html>
  );
}
