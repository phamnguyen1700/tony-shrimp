interface MiniBarsProps {
  values: number[];
  accent?: boolean;
}

export default function MiniBars({ values, accent = false }: MiniBarsProps) {
  return (
    <div className="mt-6 flex h-24 items-end gap-1" aria-hidden="true">
      {values.map((value, index) => (
        <span
          key={index}
          style={{ height: `${value}%` }}
          className={`block min-h-3 flex-1 ${
            accent && index > values.length - 4
              ? "bg-secondary/60"
              : "bg-primary/75 dark:bg-[#d6d0c1]"
          }`}
        />
      ))}
    </div>
  );
}
