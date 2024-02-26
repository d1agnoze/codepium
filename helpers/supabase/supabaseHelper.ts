import { SUPABASE_REF_ID } from "@/defaults/site";

export class SupabaseHelper {
  static domain = SUPABASE_REF_ID;
  static getImagePath(images: string[], bucketName: string): string[] {
    const imagePaths: string[] = [];
    const bucketPath = `/storage/v1/object/public/${bucketName}/`;
    images.forEach((image) => {
      const startIndex = image.indexOf(bucketPath);
      if (startIndex !== -1) {
        let endIndex = image.indexOf("?", startIndex);
        if (endIndex === -1) {
          endIndex = image.length;
        }
        const path = image.substring(startIndex + bucketPath.length, endIndex);
        imagePaths.push(path);
      }
    });
    return imagePaths;
  }
}
