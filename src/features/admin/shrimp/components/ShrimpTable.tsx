import type { Translations } from "@/i18n";
import type { ShrimpDetail, ShrimpImage, ShrimpListItem } from "@/types/shrimp";
import Badge from "@/shared/ui/Badge";
import MotionButton from "@/components/common/motion/MotionButton";
import { gradeBadgeClass, rarityBadgeClass, traitBadgeClass } from "@/lib/shrimpBadgeStyles";
import { statusVariant } from "@/lib/shrimpAdminUtils";
import ShrimpImageSlots from "./ShrimpImageSlots";

interface ShrimpTableProps {
  products: ShrimpListItem[];
  detailById: Map<string, ShrimpDetail>;
  imagePendingById: Record<string, boolean>;
  t: Translations;
  isLoading: boolean;
  onEdit: (product: ShrimpListItem) => void;
  onAdd: () => void;
  onViewVariants: (product: ShrimpListItem) => void;
  onActivate: (productId: string) => void;
  onDeactivate: (productId: string) => void;
  onHardDelete: (productId: string) => void;
  onUploadImage: (product: ShrimpListItem, file: File | undefined, index: number) => void;
  onDeleteImage: (product: ShrimpListItem, imageId: string) => void;
  onReorderImages: (product: ShrimpListItem, images: ShrimpImage[]) => void;
}

export default function ShrimpTable({
  products,
  detailById,
  imagePendingById,
  t,
  isLoading,
  onEdit,
  onAdd,
  onViewVariants,
  onActivate,
  onDeactivate,
  onHardDelete,
  onUploadImage,
  onDeleteImage,
  onReorderImages,
}: ShrimpTableProps) {
  const table = t.admin.table;
  const formLabels = t.admin.form;
  const actions = t.admin.actions;

  return (
    <div className="w-full p-6 md:p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-foreground md:text-3xl">{t.admin.shrimp}</h1>
        <MotionButton variant="accent" size="sm" onClick={onAdd}>
          {t.admin.addShrimp}
        </MotionButton>
      </div>

      <div className="hidden w-full overflow-x-auto border border-border bg-card md:block" style={{ borderRadius: "var(--radius)" }}>
        <table className="admin-data-table">
          <thead>
            <tr className="border-b border-border">
              {[
                { label: table.name, align: "text-left" },
                { label: table.type, align: "text-center" },
                { label: table.badges, align: "text-left" },
                { label: table.price, align: "text-center" },
                { label: table.available, align: "text-center" },
                { label: table.status, align: "text-center" },
                { label: table.actions, align: "text-center" },
                { label: formLabels.primaryImage, align: "text-center" },
              ].map((heading) => (
                <th key={heading.label} className={`admin-data-th ${heading.align}`}>
                  {heading.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="admin-data-row"
              >
                <td className="admin-data-cell admin-data-name-cell">
                  <div className="text-sm font-body text-foreground">{product.name}</div>
                  <div className="mt-0.5 font-mono-label text-xs text-muted-foreground">{product.species ?? "N/A"}</div>
                </td>
                <td className="admin-data-cell admin-data-type-cell">{product.type}</td>
                <td className="admin-data-cell admin-data-badge-cell">
                  <div className="flex flex-wrap gap-1.5">
                    {product.grade && <Badge variant="accent" className={gradeBadgeClass(product.grade)}>{product.grade}</Badge>}
                    {product.rarity && <Badge variant="muted" className={rarityBadgeClass(product.rarity)}>{product.rarity}</Badge>}
                    {product.traits.map((trait) => (
                      <Badge key={trait} variant="muted" className={traitBadgeClass(trait)}>{trait}</Badge>
                    ))}
                    {product.colors.map((color) => (
                      <Badge key={color} variant="muted">{color}</Badge>
                    ))}
                  </div>
                </td>
                <td className="admin-data-cell min-w-[130px] text-center">
                  <button onClick={() => onViewVariants(product)} className="font-mono-label text-xs uppercase tracking-widest text-accent hover:underline">
                    {actions.viewVariants}
                  </button>
                </td>
                <td className="admin-data-cell min-w-[110px] text-center">
                  <Badge variant={product.is_available ? "inStock" : "outOfStock"}>
                    {product.is_available ? actions.yes : actions.no}
                  </Badge>
                </td>
                <td className="admin-data-cell min-w-[120px] text-center">
                  <Badge variant={statusVariant(product.catalog_status)}>{product.catalog_status}</Badge>
                </td>
                <td className="admin-data-cell admin-data-action-cell">
                  <div className="flex items-center justify-center gap-3">
                    <button onClick={() => onEdit(product)} className="font-mono-label text-xs uppercase tracking-widest text-accent hover:underline">
                      {t.admin.editShrimp}
                    </button>
                    {product.catalog_status === "active" ? (
                      <button onClick={() => onDeactivate(product.id)} className="font-mono-label text-xs uppercase tracking-widest text-red-500 hover:underline">
                        {actions.deactivate}
                      </button>
                    ) : (
                      <>
                        <button onClick={() => onActivate(product.id)} className="font-mono-label text-xs uppercase tracking-widest text-accent hover:underline">
                          {actions.activate}
                        </button>
                        <button onClick={() => onHardDelete(product.id)} className="font-mono-label text-xs uppercase tracking-widest text-red-500 hover:underline">
                          {actions.hardDelete}
                        </button>
                      </>
                    )}
                  </div>
                </td>
                <td className="admin-data-cell admin-data-image-cell">
                  <ShrimpImageSlots
                    images={detailById.get(product.id)?.images ?? []}
                    disabled={Boolean(imagePendingById[product.id])}
                    onUpload={(file, index) => onUploadImage(product, file, index)}
                    onDelete={(imageId) => onDeleteImage(product, imageId)}
                    onReorder={(images) => onReorderImages(product, images)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {products.map((product) => (
          <div key={product.id} className="flex gap-3 border border-border bg-card p-4" style={{ borderRadius: "var(--radius)" }}>
            <div className="h-14 w-14 shrink-0 overflow-hidden bg-[#080b08]" style={{ borderRadius: "var(--radius-sm)" }}>
              {product.primary_image_url ? <img src={product.primary_image_url} alt={product.name} className="h-full w-full object-cover" /> : null}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-sm font-body text-foreground">{product.name}</div>
                  <div className="mt-0.5 font-mono-label text-xs text-muted-foreground">{product.type}</div>
                </div>
                <Badge variant={statusVariant(product.catalog_status)}>{product.catalog_status}</Badge>
              </div>
              <div className="mt-2 flex gap-4">
                <button onClick={() => onEdit(product)} className="font-mono-label text-xs uppercase tracking-widest text-accent">
                  {t.admin.editShrimp}
                </button>
                <button onClick={() => onViewVariants(product)} className="font-mono-label text-xs uppercase tracking-widest text-accent">
                  {actions.viewVariants}
                </button>
                {product.catalog_status === "active" ? (
                  <button onClick={() => onDeactivate(product.id)} className="font-mono-label text-xs uppercase tracking-widest text-red-500">
                    {actions.deactivate}
                  </button>
                ) : (
                  <>
                    <button onClick={() => onActivate(product.id)} className="font-mono-label text-xs uppercase tracking-widest text-accent">
                      {actions.activate}
                    </button>
                    <button onClick={() => onHardDelete(product.id)} className="font-mono-label text-xs uppercase tracking-widest text-red-500">
                      {actions.hardDelete}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {isLoading && (
        <div className="py-12">
          <p className="mono-section-label">{actions.loadingShrimp}</p>
        </div>
      )}
    </div>
  );
}
