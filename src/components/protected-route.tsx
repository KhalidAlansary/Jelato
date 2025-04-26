"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ReactNode } from "react";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user && !isLoading) {
    return null;
  }

  return children;
}
