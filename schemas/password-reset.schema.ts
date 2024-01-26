import { z } from "zod";

export const formSchema = z.object({
  password: z.string({
    invalid_type_error: "You are doing something sussy and i don't like it 😐",
    required_error: "A new Password is required",
  }).min(6, {
    message: "Password must be long than 6 characters",
  }),
  password_confirm: z.string({
    invalid_type_error: "You are doing something sussy and i don't like it 😐",
    required_error: "A new Password is required",
  }).min(6, {
    message: "Password must be long than 6 characters",
  }),
}).superRefine(({ password_confirm, password }, ctx) => {
  if (password_confirm !== password) {
    ctx.addIssue({
      code: "custom",
      message: "Password confirmation does not match",
      path: ["password_confirm"]
    });
  }
});
export const serverScheme = z.object({
  password: z.string({
    required_error: "Invalid field",
    invalid_type_error: "Invalid field"
  }).min(6, {
    message: "Password must be longer than 6 characters"
  })
})
