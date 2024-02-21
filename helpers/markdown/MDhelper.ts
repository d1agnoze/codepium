import { SUPABASE_REF_ID } from "@/defaults/site";

export class MDHelper {
  static ref_id: string = SUPABASE_REF_ID;
  /**
   * Extract all supabase-hosted image url
   * @param {string} markdownText text need to parse
   * @returns {string[]} array of extracted url
   */
  static extractImageLinks(markdownText: string): string[] {
    const imageLinks: string[] = [];
    const markdownRegex = /!\[.*?\]\((.*?)\)/g;
    const imgTagRegex = /<img.*?src=["'](.*?)["']/g;

    let match;

    // Extract image links from Markdown syntax
    while ((match = markdownRegex.exec(markdownText)) !== null) {
      const imageUrl = match[1];
      if (imageUrl.includes(this.ref_id)) {
        imageLinks.push(imageUrl);
      }
    }

    // Extract image links from <img> tags
    while ((match = imgTagRegex.exec(markdownText)) !== null) {
      const imageUrl = match[1];
      if (imageUrl.includes(this.ref_id)) {
        imageLinks.push(imageUrl);
      }
    }
    return imageLinks;
  }
}
