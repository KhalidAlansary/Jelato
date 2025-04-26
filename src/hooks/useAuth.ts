import supabase from "@/utils/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export function useAuth() {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      return session?.user || null;
    },
  });

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      queryClient.setQueryData(["user"], session?.user || null);
    });

    return subscription.unsubscribe;
  }, [queryClient]);

  return { user, isLoading };
}
