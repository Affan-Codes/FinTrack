import { z } from "zod";

const emailSchema = z
  .string()
  .min(1, { error: "Email is required" })
  .max(255, { error: "Email must be at most 255 characters" })
  .superRefine((val, ctx) => {
    if (!z.email().safeParse(val).success) {
      ctx.addIssue({
        code: "custom",
        message: "Invalid email address",
      });
    }
  });

export const passwordSchema = z
  .string()
  .trim()
  .min(8, { error: "Password should be minimum of 8 characters" });

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { error: "Name is required" })
    .max(255, { error: "Name must be at most 255 characters" }),
  email: emailSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type RegisterSchemaType = z.infer<typeof registerSchema>;
export type LoginSchemaType = z.infer<typeof loginSchema>;
