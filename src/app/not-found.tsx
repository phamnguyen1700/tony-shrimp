export default function NotFound() {
  return (
    <div className="min-h-screen pt-14 flex items-center justify-center bg-background">
      <div className="text-center">
        <p className="font-mono-label text-xs tracking-widest uppercase text-muted-foreground mb-3">
          404
        </p>
        <h1 className="font-display italic text-4xl text-foreground mb-6">
          Page not found
        </h1>
        <a
          href="/"
          className="text-xs font-mono-label uppercase tracking-widest text-accent hover:text-accent/80"
        >
          Return home
        </a>
      </div>
    </div>
  );
}
