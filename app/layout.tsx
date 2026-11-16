import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "陈茜文｜市场与新媒体运营",
  description: "陈茜文的市场营销、新媒体运营及品牌传播经历。",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hans">
      <body className="antialiased">{children}</body>
    </html>
  );
}
