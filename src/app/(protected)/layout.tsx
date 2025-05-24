import { AuthProvider } from "@/components/provider/auth-context";
import { SprinLoading } from "@/components/sprin";
import { Suspense } from "react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AuthProvider>
        <Suspense
          fallback={
            <div className="flex h-screen w-full items-center justify-center text-sm text-muted-foreground">
              <SprinLoading />
            </div>
          }
        >
          {children}
        </Suspense>
      </AuthProvider>
    </>
  );
}
