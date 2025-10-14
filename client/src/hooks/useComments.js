import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";

export function useGetComments(postId) {
  return useQuery({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const res = await api.get(`/posts/${postId}/comments`);
      return res.data;
    },
  });
}

export function useAddComment(postId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (text) => {
      const res = await api.post(`/posts/${postId}/comments`, { text });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", postId]);
    },
  });
}
