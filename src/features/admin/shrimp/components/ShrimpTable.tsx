import type { ReactNode } from "react";
import AdminDataTable, { type AdminDataTableColumn } from "@/components/common/table/AdminDataTable";
import type { Translations } from "@/i18n";
import type { OwnerShrimpListItem, ShrimpImage } from "@/types/shrimp";
import { Play } from "lucide-react";
import FallbackImage from "@/components/common/images/FallbackImage";
import Badge from "@/components/ui/Badge";
import MotionButton from "@/components/common/motion/MotionButton";
import { isVideoMediaUrl } from "@/lib/config/media";
import { gradeBadgeClass, rarityBadgeClass, traitBadgeClass } from "@/lib/shrimp/badgeStyles";
import { statusVariant } from "@/lib/shrimp/adminUtils";
import ShrimpImageSlots from "./ShrimpImageSlots";

interface ShrimpTableProps {
  products: OwnerShrimpListItem[];
  imagePendingById: Record<string, boolean>;
  t: Translations;
  isLoading: boolean;
  page: number;
  pageSize: number;
  totalRows: number;
  selectedProductId?: string | null;
  onPageChange: (page: number) => void;
  filtersSlot?: ReactNode;
  onEdit: (product: OwnerShrimpListItem) => void;
  onAdd: () => void;
  onViewVariants: (product: OwnerShrimpListItem) => void;
  onActivate: (productId: string) => void;
  onDeactivate: (productId: string) => void;
  onUploadImage: (product: OwnerShrimpListItem, file: File | undefined, index: number) => void;
  onDeleteImage: (product: OwnerShrimpListItem, imageId: string) => void;
  onReorderImages: (product: OwnerShrimpListItem, images: ShrimpImage[]) => void;
}

export default function ShrimpTable({
  products,
  imagePendingById,
  t,
  isLoading,
  page,
  pageSize,
  totalRows,
  selectedProductId,
  onPageChange,
  filtersSlot,
  onEdit,
  onAdd,
  onViewVariants,
  onActivate,
  onDeactivate,
  onUploadImage,
  onDeleteImage,
  onReorderImages,
}: ShrimpTableProps) {
  const table = t.admin.table;
  const formLabels = t.admin.form;
  const actions = t.admin.actions;
  const columns: AdminDataTableColumn<OwnerShrimpListItem>[] = [
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
      key: "available",
      header: table.available,
      align: "center",
      className: "min-w-[110px]",
      render: (product) => (
        <Badge
          variant={product.total_stock > 0 ? "inStock" : "outOfStock"}
          className={product.total_stock > 0 ? "" : "border-red-400/30 bg-red-400/8 text-red-500"}
        >
          {product.total_stock > 0 ? product.total_stock : "Out stock"}
        </Badge>
      ),
    },
    {
      key: "status",
      header: table.status,
      align: "center",
      className: "min-w-[120px]",
      render: (product) => (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            if (product.catalog_status === "active") {
              onDeactivate(product.id);
              return;
            }
            onActivate(product.id);
          }}
          className="group"
          aria-label={product.catalog_status === "active" ? actions.deactivate : actions.activate}
        >
          <Badge
            variant={statusVariant(product.catalog_status)}
            className={`w-[118px] justify-center ${
              product.catalog_status === "active"
                ? "group-hover:border-red-400/30 group-hover:bg-red-400/8 group-hover:text-red-500"
                : "group-hover:border-accent/30 group-hover:bg-accent/8 group-hover:text-accent"
            }`}
          >
            <span className="group-hover:hidden">{product.catalog_status}</span>
            <span className="hidden group-hover:inline">
              {product.catalog_status === "active" ? actions.deactivate : actions.activate}
            </span>
          </Badge>
        </button>
      ),
    },
    {
      key: "actions",
      header: table.actions,
      align: "center",
      className: "admin-data-action-cell",
      render: (product) => (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={(event) => {
              event.stopPropagation();
              onEdit(product);
            }}
            className="font-mono-label text-xs uppercase tracking-widest text-accent hover:underline"
          >
            {t.admin.editShrimp}
          </button>
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
          images={product.images ?? []}
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
          onRowClick={onViewVariants}
          rowClassName={(product) =>
            product.id === selectedProductId ? "outline outline-1 outline-accent/50" : ""
          }
          minWidth="1320px"
        />
      </div>

      <div className="space-y-3 md:hidden">
        {products.map((product) => (
          <div
            key={product.id}
            className={`border bg-card p-4 ${
              product.id === selectedProductId ? "border-accent/60" : "border-border"
            }`}
            style={{ borderRadius: "var(--radius)" }}
          >
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
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      if (product.catalog_status === "active") {
                        onDeactivate(product.id);
                        return;
                      }
                      onActivate(product.id);
                    }}
                    className="group"
                  >
                    <Badge
                      variant={statusVariant(product.catalog_status)}
                      className={`w-[118px] justify-center ${
                        product.catalog_status === "active"
                          ? "group-hover:border-red-400/30 group-hover:bg-red-400/8 group-hover:text-red-500"
                          : "group-hover:border-accent/30 group-hover:bg-accent/8 group-hover:text-accent"
                      }`}
                    >
                      <span className="group-hover:hidden">{product.catalog_status}</span>
                      <span className="hidden group-hover:inline">
                        {product.catalog_status === "active" ? actions.deactivate : actions.activate}
                      </span>
                    </Badge>
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-4">
                  <Badge
                    variant={product.total_stock > 0 ? "inStock" : "outOfStock"}
                    className={product.total_stock > 0 ? "" : "border-red-400/30 bg-red-400/8 text-red-500"}
                  >
                    {product.total_stock > 0 ? product.total_stock : "Out stock"}
                  </Badge>
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      onEdit(product);
                    }}
                    className="font-mono-label text-xs uppercase tracking-widest text-accent"
                  >
                    {t.admin.editShrimp}
                  </button>
                  <button
                    onClick={() => onViewVariants(product)}
                    className="font-mono-label text-xs uppercase tracking-widest text-accent"
                  >
                    {formLabels.variants}
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-4 overflow-x-auto pb-1">
              <ShrimpImageSlots
                images={product.images ?? []}
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
