import { z } from "zod";

export const formSchema = z.object({
    username: z.string({
        required_error: "Username is required",
        invalid_type_error: "Username must be a string",
    }).min(4),
    displayName: z.string({
        required_error: "display name is required",
        invalid_type_error: "display name must be a string",
    }).min(4),
    about: z.string().default(''),
})