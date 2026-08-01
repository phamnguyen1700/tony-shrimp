import AdminOrderDetailFeature from "@/features/admin/order-detail";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <AdminOrderDetailFeature id={id} />;
}
