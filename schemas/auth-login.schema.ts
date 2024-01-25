import { z } from "zod";

export const authSchema = z.object({
  email: z.string({
    required_error: "This field is required",
    invalid_type_error: "U r doing something sussy and i don't like it😐",
  })
    .email({ message: "Invallid field! Email is required" }).min(4, {
      message: "How can you email be less than 4 characters?🤔",
    }),
  password: z.string({
    required_error: "This field is required",
    invalid_type_error: "U r doing something sussy and i don't like it😐",
  }).min(6, {
    message: "Password must longer than 6 characters",
  }),
});
