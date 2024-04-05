import { z } from "zod";

export const accountSettingsSchema = z.object({
  username: z
    .string({
      required_error: "Username is required",
      invalid_type_error: "Username must be a string",
    })
    .min(4).max(30),
  displayName: z
    .string({
      required_error: "display name is required",
      invalid_type_error: "display name must be a string",
    })
    .min(4).max(30),
  about: z.string().max(200).default(""),
  expertises: z
    .object({
      id: z.string().min(1),
      display_name: z.string().min(1),
    })
    .array()
    .min(1)
});
