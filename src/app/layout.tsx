import type { Metadata } from "next";
import "@/index.css";
import AppProviders from "@/providers/AppProviders";
import { siteDescription, siteIcon, siteName } from "@/lib/seo";

export const metadata: Metadata = {
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  icons: {
    icon: [
      {
        url: siteIcon,
        type: "image/png",
      },
    ],
    apple: siteIcon,
  },
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
