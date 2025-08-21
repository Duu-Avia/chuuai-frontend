import AdminDashboard from "@/app/_components/AdminDashboard";

export default function Page({ params }: any) {
  const pageId = decodeURIComponent(params.pageId);
  return <AdminDashboard pageId={pageId} />;
}
