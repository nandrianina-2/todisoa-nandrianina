import { AuthSessionProvider } from "@/components/session-provider";
import { AdminNav } from "@/components/admin-nav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthSessionProvider>
      <div className="min-h-screen bg-bg text-text">
        <AdminNav />
        <main className="mx-auto max-w-4xl px-6 py-10">{children}</main>
      </div>
    </AuthSessionProvider>
  );
}
