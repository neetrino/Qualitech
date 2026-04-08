import { z } from "zod";

export const adminLoginBodySchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(500),
});

export type AdminLoginBody = z.infer<typeof adminLoginBodySchema>;
