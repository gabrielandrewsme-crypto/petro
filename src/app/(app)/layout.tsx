import { headers } from "next/headers";
import { AppShell } from "@/components/app-shell";
import { requireUser } from "@/lib/auth";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const pathname = (await headers()).get("x-pathname") ?? "/dashboard";

  return (
    <AppShell pathname={pathname} userName={user.name}>
      {children}
    </AppShell>
  );
}
