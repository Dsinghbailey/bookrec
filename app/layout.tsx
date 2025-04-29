import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bookrec",
  description: "Bookrec",
  generator: "Bookrec",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
