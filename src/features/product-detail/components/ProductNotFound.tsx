import Link from "next/link";

export default function ProductNotFound() {
  return (
    <div className="app-page flex items-center justify-center">
      <div className="space-y-4 text-center">
        <p className="mono-meta uppercase">Product not found</p>
        <Link
          href="/shop"
          className="font-mono-label text-xs uppercase tracking-widest text-accent underline underline-offset-2"
        >
          Back to Shop
        </Link>
      </div>
    </div>
  );
}
