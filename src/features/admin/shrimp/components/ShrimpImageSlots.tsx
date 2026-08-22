import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Play, Trash2, Video } from "lucide-react";
import { useState } from "react";
import FallbackImage from "@/components/common/images/FallbackImage";
import Dialog from "@/components/ui/Dialog";
import { isVideoMediaUrl } from "@/lib/media";
import type { ShrimpImage } from "@/types/shrimp";

const imageSlotCount = 4;
const emptySlotIdPrefix = "empty-slot-";

interface ShrimpImageSlotsProps {
  images: ShrimpImage[];
  disabled: boolean;
  onUpload: (file: File | undefined, index: number) => void;
  onDelete: (imageId: string) => void;
  onReorder: (images: ShrimpImage[]) => void;
}

export default function ShrimpImageSlots({
  images,
  disabled,
  onUpload,
  onDelete,
  onReorder,
}: ShrimpImageSlotsProps) {
  const [previewImage, setPreviewImage] = useState<ShrimpImage | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
  const sortedImages = [...images].sort((a, b) => a.sort_order - b.sort_order);
  const slots = createImageSlots(sortedImages);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const sourceIndex = slots.findIndex((image) => image?.id === active.id);
    const targetIndex = getDropSlotIndex(String(over.id), slots);
    if (sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex) return;

    const nextSlots = [...slots];
    const sourceImage = nextSlots[sourceIndex];
    const targetImage = nextSlots[targetIndex];
    if (!sourceImage) return;

    nextSlots[targetIndex] = sourceImage;
    nextSlots[sourceIndex] = targetImage;
    onReorder(
      nextSlots.flatMap((image, index) =>
        image ? [{ ...image, sort_order: index }] : [],
      ),
    );
  }

  return (
    <>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sortedImages.map((image) => image.id)} strategy={horizontalListSortingStrategy}>
          <div className="admin-image-slots">
            {slots.map((image, index) =>
              image ? (
                <SortableImageSlot
                  key={image.id}
                  image={image}
                  index={index}
                  disabled={disabled}
                  onPreview={setPreviewImage}
                />
              ) : (
                <EmptyImageSlot
                  key={`empty-${index}`}
                  index={index}
                  disabled={disabled}
                  onUpload={(file) => onUpload(file, index)}
                />
              ),
            )}
          </div>
        </SortableContext>
      </DndContext>

      <Dialog
        open={previewImage !== null}
        onClose={() => setPreviewImage(null)}
        title={previewImage?.alt_text ?? "Shrimp media"}
        maxWidth="max-w-4xl"
      >
        {previewImage && (
          <div className="space-y-4">
            <div className="overflow-hidden bg-[#080b08]" style={{ borderRadius: "var(--radius)" }}>
              {previewImage.url && isVideoMediaUrl(previewImage.url) ? (
                <video
                  src={previewImage.url}
                  className="max-h-[72vh] w-full object-contain"
                  controls
                  playsInline
                  preload="metadata"
                />
              ) : (
                <FallbackImage
                  src={previewImage.url}
                  alt={previewImage.alt_text ?? "Shrimp image preview"}
                  className="max-h-[72vh] w-full object-contain"
                />
              )}
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                disabled={disabled}
                onClick={() => {
                  onDelete(previewImage.id);
                  setPreviewImage(null);
                }}
                className="inline-flex h-10 w-10 items-center justify-center border border-red-500/40 text-red-500 transition-colors hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                style={{ borderRadius: "var(--radius-sm)" }}
                aria-label="Delete media"
                title="Delete media"
              >
                <Trash2 className="h-4 w-4" strokeWidth={1.7} />
              </button>
            </div>
          </div>
        )}
      </Dialog>
    </>
  );
}

function createImageSlots(images: ShrimpImage[]) {
  const slots: Array<ShrimpImage | null> = Array.from({ length: imageSlotCount }, () => null);

  for (const image of images) {
    const targetIndex =
      Number.isInteger(image.sort_order) &&
      image.sort_order >= 0 &&
      image.sort_order < imageSlotCount &&
      slots[image.sort_order] === null
        ? image.sort_order
        : slots.findIndex((slot) => slot === null);

    if (targetIndex >= 0) slots[targetIndex] = image;
  }

  return slots;
}

function getDropSlotIndex(overId: string, slots: Array<ShrimpImage | null>) {
  if (overId.startsWith(emptySlotIdPrefix)) {
    return Number(overId.slice(emptySlotIdPrefix.length));
  }

  return slots.findIndex((image) => image?.id === overId);
}

function SortableImageSlot({
  image,
  index,
  disabled,
  onPreview,
}: {
  image: ShrimpImage;
  index: number;
  disabled: boolean;
  onPreview: (image: ShrimpImage) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: image.id,
    disabled,
  });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`admin-image-slot group ${
        disabled ? "cursor-not-allowed" : "cursor-grab active:cursor-grabbing"
      } ${isDragging ? "z-10 opacity-70 shadow-lg" : ""}`}
      onClick={() => onPreview(image)}
      {...attributes}
      {...listeners}
    >
      {image.url && isVideoMediaUrl(image.url) ? (
        <VideoThumbnail />
      ) : (
        <FallbackImage
          src={image.url}
          alt={image.alt_text ?? `Shrimp image ${index + 1}`}
          className="h-full w-full object-cover"
        />
      )}
    </div>
  );
}

function VideoThumbnail() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-[#080b08] text-muted-foreground">
      <div className="flex h-7 w-7 items-center justify-center border border-border bg-card/70" style={{ borderRadius: "999px" }}>
        <Play className="ml-0.5 h-3.5 w-3.5" fill="currentColor" strokeWidth={1.5} />
      </div>
      <Video className="h-3.5 w-3.5" strokeWidth={1.5} />
    </div>
  );
}

function EmptyImageSlot({
  index,
  disabled,
  onUpload,
}: {
  index: number;
  disabled: boolean;
  onUpload: (file?: File) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `${emptySlotIdPrefix}${index}`,
    disabled,
  });

  return (
    <label
      ref={setNodeRef}
      className={`admin-image-slot-empty ${isOver ? "border-accent text-accent" : ""}`}
      aria-label={`Upload image ${index + 1}`}
    >
      +
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime"
        className="sr-only"
        disabled={disabled}
        onChange={(event) => {
          onUpload(event.target.files?.[0]);
          event.target.value = "";
        }}
      />
    </label>
  );
}
