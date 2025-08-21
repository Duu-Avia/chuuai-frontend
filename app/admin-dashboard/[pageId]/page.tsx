// app/admin-dashboard/[pageId]/page.tsx
import AdminDashboard from "@/app/_components/AdminDashboard";

export default function Page({ params }: { params: { pageId: string } }) {
  return <AdminDashboard pageId={params.pageId} />;
}
