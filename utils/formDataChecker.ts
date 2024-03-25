import { z } from "zod";

/**
 * Check if the form data is valid to the schema
 * @function schemaChecker
 * @param {FormData} formData - The form data to be checked
 * @param {ZodObject} T - The schema to be checked
 * @returns {boolean} - Returns true if the form data is valid
 */
export const schemaChecker = (
  formData: FormData,
  T: z.ZodObject<any>,
): boolean => {
  for (const field in T.shape) {
    if (formData.get(field) == null) {
      return false;
    }
  }
  return true;
};
