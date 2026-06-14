import { useRouter } from "next/router";
import { ReactNode, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();

  const { user } = useAuth();

  // Redirects user to auth page when they aren't authenticated
  useEffect(() => {
    if (!user) router.push("/auth");
  }, []);

  return children;
}
