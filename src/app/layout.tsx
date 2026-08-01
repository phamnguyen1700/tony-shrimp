import type { Metadata } from "next";
import "@/index.css";
import AppProviders from "@/providers/AppProviders";

export const metadata: Metadata = {
  title: "TONY SHRIMP",
  description: "Premium freshwater shrimp storefront.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
