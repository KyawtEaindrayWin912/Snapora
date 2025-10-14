import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";

export function useSearch(query) {
  return useQuery({
    queryKey: ["search", query],
    queryFn: async () => {
      if (!query) return { users: [], posts: [] };
      const res = await api.get(`/search?q=${query}`);
      return res.data;
    },
    enabled: !!query, 
  });
}
