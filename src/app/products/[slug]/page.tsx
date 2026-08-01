import ProductDetailFeature from "@/features/product-detail";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <ProductDetailFeature slug={slug} />;
}
