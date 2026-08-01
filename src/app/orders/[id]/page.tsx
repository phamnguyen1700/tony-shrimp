import OrderTrackingFeature from "@/features/order-tracking";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <OrderTrackingFeature id={id} />;
}
