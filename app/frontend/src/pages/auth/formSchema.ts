import { z } from "zod";
export const FORM_SCHEMA_SIGNUP = z.object({
  email: z.string().email(),
  name: z.string(),
  password: z.string().min(6),
});
