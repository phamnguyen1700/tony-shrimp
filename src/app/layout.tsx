import type { Metadata } from "next";
import "@/index.css";
import AppProviders from "@/providers/AppProviders";
import { absoluteUrl, defaultOpenGraphImage, siteDescription, siteIcon, siteName, siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  alternates: {
    canonical: absoluteUrl(),
  },
  openGraph: {
    title: siteName,
    description: siteDescription,
    url: absoluteUrl(),
    siteName,
    type: "website",
    images: [{ url: defaultOpenGraphImage }],
  },
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
