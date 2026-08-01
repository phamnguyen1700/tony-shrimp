const imageKeys = [
  "red-boa",
  "yellow-snowflake-galaxy",
  "blue-snowflake-galaxy",
  "red-snowflake-galaxy",
  "orange-boa",
  "blue-boa",
  "ocean-red",
  "ocean-blue",
] as const;

type ShrimpImageKey = (typeof imageKeys)[number];

export const shrimpImageGalleries: Record<ShrimpImageKey, string[]> =
  Object.fromEntries(
    imageKeys.map((key) => [
      key,
      Array.from({ length: 5 }, (_, index) =>
        `/shrimp/${key}/${String(index + 1).padStart(2, "0")}.jpg`
      ),
    ]),
  ) as Record<ShrimpImageKey, string[]>;

export const shrimpImages: Record<string, string> = {
  "red-boa": "/shrimp/red-boa/01.jpg",
  "yellow-snowflake-galaxy": "/shrimp/yellow-snowflake-galaxy/01.jpg",
  "blue-snowflake-galaxy": "/shrimp/blue-snowflake-galaxy/01.jpg",
  "red-snowflake-galaxy": "/shrimp/red-snowflake-galaxy/01.jpg",
  "orange-boa": "/shrimp/orange-boa/01.jpg",
  "blue-boa": "/shrimp/blue-boa/01.jpg",
  "ocean-red": "/shrimp/ocean-red/01.jpg",
  "ocean-blue": "/shrimp/ocean-blue/01.jpg",
};

export function getShrimpImage(imageKey: string, imageIndex = 0) {
  return shrimpImageGalleries[imageKey as ShrimpImageKey]?.[imageIndex] ??
    shrimpImages[imageKey] ??
    shrimpImages["red-boa"];
}
