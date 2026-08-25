import "@/index.css";
import AppProviders from "@/providers/AppProviders";
import { createRootMetadata } from "@/lib/seo/metadata";

export const metadata = createRootMetadata();

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
