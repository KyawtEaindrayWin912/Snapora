import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().min(3).max(20).regex(/^[a-z0-9._]+$/i, "letters, numbers, . or _ only"),
  email: z.string().email(),
  fullName: z.string().min(1),
  password: z.string().min(6),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
