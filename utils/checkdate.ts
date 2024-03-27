import { DEFAULT_COMMENT_EDIT_WINDOW } from "@/defaults/parameter_configuration";
import moment from "moment";
/**
 * Check if date is after 5 minutes
 * @param date date string
 * @returns boolean
 */
export const isAfterEditWins = (date: string) => {
  return moment(new Date(date)).isAfter(
    moment().subtract(DEFAULT_COMMENT_EDIT_WINDOW, "minutes"),
  );
};
