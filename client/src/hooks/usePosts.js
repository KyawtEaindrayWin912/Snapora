import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import api from "../lib/api";

export function useLikePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId) => {
      const res = await api.post(`/posts/${postId}/like`);
      return res.data; 
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["feed"]); 
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId) => {
      await api.delete(`/posts/${postId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
      queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, caption, image }) => {
      const formData = new FormData();
      if (caption) formData.append("caption", caption);
      if (image) formData.append("image", image);

      const res = await api.put(`/posts/${postId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return res.data;
    },
    onSuccess: (updatedPost) => {
      queryClient.setQueryData(["feed"], (oldData = []) =>
        oldData.map((post) =>
          post._id === updatedPost._id ? updatedPost : post
        )
      );
    },
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

export function usePost(postId) {
  return useQuery({
    queryKey: ["post", postId],
    queryFn: async () => {
      const res = await api.get(`/posts/${postId}`);
      return res.data;
    },
    enabled: !!postId,
  });
}

export function useLikes(postId) {
  const queryClient = useQueryClient();

  const { data: likesData } = useQuery({
    queryKey: ["likes", postId],
    queryFn: async () => {
      const res = await api.get(`/posts/${postId}/likes`);
      return res.data; 
    },
    enabled: !!postId,
  });

  const likeMutation = useMutation({
    mutationFn: async () => api.post(`/posts/${postId}/like`),
    onSuccess: () => {
      queryClient.invalidateQueries(["feed"]);
      queryClient.invalidateQueries(["post", postId]);
      queryClient.invalidateQueries(["likes", postId]);
    },
  });

  const unlikeMutation = useMutation({
    mutationFn: async () => api.post(`/posts/${postId}/unlike`),
    onSuccess: () => {
      queryClient.invalidateQueries(["feed"]);
      queryClient.invalidateQueries(["post", postId]);
      queryClient.invalidateQueries(["likes", postId]);
    },
  });

  return {
    likes: likesData?.count || 0,
    users: likesData?.users || [],
    like: likeMutation.mutate,
    unlike: unlikeMutation.mutate,
  };
}

