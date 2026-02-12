import z from "zod";

export const registerSchema = z.object({
  fullname: z.string().min(3).max(50),
  username: z.string().min(6).max(50),
  email: z.email(),
  password: z.string().min(6).max(60),
});

export const loginSchema = z.object({
  // email: z.email(),
  username: z.string().min(6).max(50),
  password: z.string().min(6).max(60),
});
