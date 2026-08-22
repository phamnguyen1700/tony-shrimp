import type { ReactNode } from "react";
import AdminDataTable, { type AdminDataTableColumn } from "@/components/common/table/AdminDataTable";
import type { Translations } from "@/i18n";
import type { ShrimpDetail, ShrimpImage, ShrimpListItem } from "@/types/shrimp";
import { Play } from "lucide-react";
import FallbackImage from "@/components/common/images/FallbackImage";
import Badge from "@/components/ui/Badge";
import MotionButton from "@/components/common/motion/MotionButton";
import { isVideoMediaUrl } from "@/lib/media";
import { gradeBadgeClass, rarityBadgeClass, traitBadgeClass } from "@/lib/shrimpBadgeStyles";
import { statusVariant } from "@/lib/shrimpAdminUtils";
import ShrimpImageSlots from "./ShrimpImageSlots";

interface ShrimpTableProps {
  products: ShrimpListItem[];
  detailById: Map<string, ShrimpDetail>;
  imagePendingById: Record<string, boolean>;
  t: Translations;
  isLoading: boolean;
  page: number;
  pageSize: number;
  totalRows: number;
  onPageChange: (page: number) => void;
  filtersSlot?: ReactNode;
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
  page,
  pageSize,
  totalRows,
  onPageChange,
  filtersSlot,
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
  const columns: AdminDataTableColumn<ShrimpListItem>[] = [
    {
      key: "name",
      header: table.name,
      className: "admin-data-name-cell",
      render: (product) => (
        <>
          <div className="text-sm font-body text-foreground">{product.name}</div>
          <div className="mt-0.5 font-mono-label text-xs text-muted-foreground">{product.species ?? "N/A"}</div>
        </>
      ),
    },
    {
      key: "line",
      header: table.type,
      align: "center",
      className: "admin-data-type-cell",
      render: (product) => product.line,
    },
    {
      key: "badges",
      header: table.badges,
      className: "admin-data-badge-cell",
      render: (product) => (
        <div className="flex flex-wrap gap-1.5">
          {product.grade && <Badge variant="accent" className={gradeBadgeClass(product.grade)}>{product.grade}</Badge>}
          {product.rarity && <Badge variant="muted" className={rarityBadgeClass(product.rarity)}>{product.rarity}</Badge>}
          {product.traits.map((trait) => (
            <Badge key={trait} variant="muted" className={traitBadgeClass(trait)}>{trait}</Badge>
          ))}
        </div>
      ),
    },
    {
      key: "price",
      header: table.price,
      align: "center",
      className: "min-w-[130px]",
      render: (product) => (
        <button onClick={() => onViewVariants(product)} className="font-mono-label text-xs uppercase tracking-widest text-accent hover:underline">
          {actions.viewVariants}
        </button>
      ),
    },
    {
      key: "available",
      header: table.available,
      align: "center",
      className: "min-w-[110px]",
      render: (product) => (
        <Badge variant={product.is_available ? "inStock" : "outOfStock"}>
          {product.is_available ? actions.yes : actions.no}
        </Badge>
      ),
    },
    {
      key: "status",
      header: table.status,
      align: "center",
      className: "min-w-[120px]",
      render: (product) => <Badge variant={statusVariant(product.catalog_status)}>{product.catalog_status}</Badge>,
    },
    {
      key: "actions",
      header: table.actions,
      align: "center",
      className: "admin-data-action-cell",
      render: (product) => (
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
      ),
    },
    {
      key: "images",
      header: formLabels.primaryImage,
      align: "center",
      className: "admin-data-image-cell",
      render: (product) => (
        <ShrimpImageSlots
          images={detailById.get(product.id)?.images ?? []}
          disabled={Boolean(imagePendingById[product.id])}
          onUpload={(file, index) => onUploadImage(product, file, index)}
          onDelete={(imageId) => onDeleteImage(product, imageId)}
          onReorder={(images) => onReorderImages(product, images)}
        />
      ),
    },
  ];

  return (
    <div className="w-full p-6 md:p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-foreground md:text-3xl">{t.admin.shrimp}</h1>
        <MotionButton variant="accent" size="sm" onClick={onAdd}>
          {t.admin.addShrimp}
        </MotionButton>
      </div>

      {filtersSlot}

      <div className="hidden md:block">
        <AdminDataTable
          rows={products}
          columns={columns}
          getRowKey={(product) => product.id}
          emptyText="No shrimp found."
          loadingText={actions.loadingShrimp}
          isLoading={isLoading}
          page={page}
          pageSize={pageSize}
          totalRows={totalRows}
          onPageChange={onPageChange}
          minWidth="1480px"
        />
      </div>

      <div className="space-y-3 md:hidden">
        {products.map((product) => (
          <div key={product.id} className="border border-border bg-card p-4" style={{ borderRadius: "var(--radius)" }}>
            <div className="flex gap-3">
              <div className="h-14 w-14 shrink-0 overflow-hidden bg-[#080b08]" style={{ borderRadius: "var(--radius-sm)" }}>
                {product.primary_image_url && isVideoMediaUrl(product.primary_image_url) ? (
                  <div className="flex h-full w-full items-center justify-center bg-[#080b08] text-muted-foreground">
                    <Play className="h-4 w-4" fill="currentColor" strokeWidth={1.5} />
                  </div>
                ) : (
                  <FallbackImage src={product.primary_image_url} alt={product.name} className="h-full w-full object-cover" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-body text-foreground">{product.name}</div>
                    <div className="mt-0.5 font-mono-label text-xs text-muted-foreground">{product.line}</div>
                  </div>
                  <Badge variant={statusVariant(product.catalog_status)}>{product.catalog_status}</Badge>
                </div>
                <div className="mt-2 flex flex-wrap gap-4">
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
            <div className="mt-4 overflow-x-auto pb-1">
              <ShrimpImageSlots
                images={detailById.get(product.id)?.images ?? []}
                disabled={Boolean(imagePendingById[product.id])}
                onUpload={(file, index) => onUploadImage(product, file, index)}
                onDelete={(imageId) => onDeleteImage(product, imageId)}
                onReorder={(images) => onReorderImages(product, images)}
              />
            </div>
          </div>
        ))}
      </div>

      {isLoading && products.length === 0 && (
        <div className="py-12">
          <p className="mono-section-label">{actions.loadingShrimp}</p>
        </div>
      )}

      {totalRows > 0 && (
        <div className="mt-4 flex items-center justify-between gap-4 md:hidden">
          <p className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground">
            Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, totalRows)} of {totalRows}
          </p>
          {totalRows > pageSize && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onPageChange(Math.max(1, page - 1))}
                disabled={page === 1}
                className="ui-radius-sm border border-border px-3 py-1.5 font-mono-label text-xs uppercase tracking-widest text-foreground transition-colors hover:bg-accent/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={() => onPageChange(page + 1)}
                disabled={page * pageSize >= totalRows}
                className="ui-radius-sm border border-border px-3 py-1.5 font-mono-label text-xs uppercase tracking-widest text-foreground transition-colors hover:bg-accent/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
