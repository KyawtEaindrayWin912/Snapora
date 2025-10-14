import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";

export function useFollow(userId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      return await api.post(`/users/${userId}/follow`);
    },
    onSuccess: () => queryClient.invalidateQueries(["user", userId]),
  });
}

export function useUnfollow(userId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      return await api.delete(`/users/${userId}/follow`);
    },
    onSuccess: () => queryClient.invalidateQueries(["user", userId]),
  });
}
