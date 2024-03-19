/**
 * @type Vote dto type for vote table
 * @property id auto increment number
 * @property thread_id thread id of a answer (NULLABLE)
 * @property sender user_id of the voter
 * @property direction boolean, up or down, doesnt reflect vote number
 */
export type Vote = {
  id: number;
  thread_id: string | null;
  source_id: string;
  sender: string;
  direction: boolean;
};
