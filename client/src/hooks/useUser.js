import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";

export function useUser(userId) {
    return useQuery({
      queryKey: ["user", userId],
      queryFn: async () => {
        const res = await api.get(`/users/${userId}`); 
        return res.data;
      },
      enabled: !!userId,
    });
  }

export function useUserPosts(userId) {
  return useQuery({
    queryKey: ["userPosts", userId],
    queryFn: async () => {
      const res = await api.get(`/posts/user/${userId}`);
      return res.data;
    },
    enabled: !!userId,
  });
}
