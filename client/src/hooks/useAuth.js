import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";

export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => api.post("/auth/register", data).then(res => res.data),
    onSuccess: (data) => {
      queryClient.setQueryData(["me"], data.user);
      localStorage.setItem("accessToken", data.accessToken);
    },
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => api.post("/auth/login", data).then(res => res.data),
    onSuccess: (data) => {
      queryClient.setQueryData(["me"], data.user);
      localStorage.setItem("accessToken", data.accessToken);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.post("/auth/logout").then(res => res.data),
    onSuccess: () => {
      queryClient.removeQueries(["me"]);
      localStorage.removeItem("accessToken");
    },
  });
}

export function useMe() {
  const token = localStorage.getItem("accessToken");
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await api.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    enabled: !!token,
  });
}
