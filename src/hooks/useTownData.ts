import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useTown(slug: string | undefined) {
  return useQuery({
    queryKey: ["town", slug],
    enabled: !!slug,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("towns")
        .select("*")
        .eq("slug", slug!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useTownZones(slug: string | undefined) {
  return useQuery({
    queryKey: ["zones", slug],
    enabled: !!slug,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("zones")
        .select("*")
        .eq("town_slug", slug!)
        .order("code", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useTownPermits(slug: string | undefined) {
  return useQuery({
    queryKey: ["permits", slug],
    enabled: !!slug,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("permits")
        .select("*")
        .eq("town_slug", slug!)
        .order("name", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useTownOrdinances(slug: string | undefined) {
  return useQuery({
    queryKey: ["ordinances", slug],
    enabled: !!slug,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ordinances")
        .select("*")
        .eq("town_slug", slug!)
        .order("category", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useTownContacts(slug: string | undefined) {
  return useQuery({
    queryKey: ["contacts", slug],
    enabled: !!slug,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contacts")
        .select("*")
        .eq("town_slug", slug!)
        .order("dept", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useAllTowns() {
  return useQuery({
    queryKey: ["towns-all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("towns")
        .select("*")
        .order("name", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });
}