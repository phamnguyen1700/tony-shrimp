import ProductDetailFeature from "@/features/product-detail";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: slug } = await params;

  return <ProductDetailFeature slug={slug} />;
}
