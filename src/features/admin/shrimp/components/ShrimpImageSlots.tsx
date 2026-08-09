import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ShrimpImage } from "@/types/shrimp";

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
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
  const sortedImages = [...images].sort((a, b) => a.sort_order - b.sort_order);
  const slots = Array.from({ length: 4 }, (_, index) =>
    sortedImages.find((image) => image.sort_order === index) ?? null,
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sortedImages.findIndex((image) => image.id === active.id);
    const newIndex = sortedImages.findIndex((image) => image.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    onReorder(arrayMove(sortedImages, oldIndex, newIndex));
  }

  return (
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
                onDelete={onDelete}
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
  );
}

function SortableImageSlot({
  image,
  index,
  disabled,
  onDelete,
}: {
  image: ShrimpImage;
  index: number;
  disabled: boolean;
  onDelete: (imageId: string) => void;
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
      {...attributes}
      {...listeners}
    >
      {image.url ? (
        <img src={image.url} alt={image.alt_text ?? `Shrimp image ${index + 1}`} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <span className="font-mono-label text-[10px] uppercase text-white/45">IMG</span>
        </div>
      )}
      <button
        type="button"
        disabled={disabled}
        onPointerDown={(event) => event.stopPropagation()}
        onClick={(event) => {
          event.stopPropagation();
          onDelete(image.id);
        }}
        className="admin-image-delete-button"
        aria-label="Delete image"
      >
        Delete
      </button>
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
  return (
    <label className="admin-image-slot-empty" aria-label={`Upload image ${index + 1}`}>
      +
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
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
