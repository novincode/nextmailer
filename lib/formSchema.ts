import { z } from "zod";

export const subscribeFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export type SubscribeFormValues = z.infer<typeof subscribeFormSchema>;
