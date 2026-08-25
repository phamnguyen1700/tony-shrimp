import type { ReactNode } from "react";
import { createNoIndexMetadata } from "@/lib/seo/metadata";

export const metadata = createNoIndexMetadata();

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
