import { useAppRuntime } from "@/providers/AppProviders";

export default function ProductLoadingState() {
  const { t } = useAppRuntime();

  return (
    <div className="app-page">
      <div className="app-container">
        <p className="mono-section-label">{t.product.loading}</p>
      </div>
    </div>
  );
}
