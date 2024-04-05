import { POINT_SYS } from "@/defaults/points.system";
import { AuthError } from "@/helpers/error/AuthError";
import { ReputationError } from "@/helpers/error/ReputationError";
import { reputation } from "@/types/reputation.type";
import { SupabaseClient, User } from "@supabase/auth-helpers-nextjs";

export class ReputationService {
  private client: SupabaseClient<any, "public", any>;
  private user: User | null = null;

  constructor(
    supabaseClient: SupabaseClient<any, "public", any>,
    user?: User | null,
  ) {
    this.client = supabaseClient;
    if (user) this.user = user;
  }

  private async getUser(): Promise<User | null> {
    if (this.user) return this.user;
    try {
      const { data } = await this.client.auth.getUser();
      if (!data.user) throw new AuthError("REP_SERVICE: Unable to fetch user");
      this.user = data.user;
      return this.user;
    } catch (error: any) {
      throw new AuthError(error.message);
    }
  }

  private async setReputation(action: keyof typeof POINT_SYS): Promise<void> {
    try {
      if (!this.user) throw new AuthError("REP_SERVICE: Unable to fetch user");

      const curr_point = await this.getReputation();
      /* IMPORTANT: check if user reputation record is there */
      console.log(JSON.stringify(curr_point));
      if (curr_point == null || curr_point.id == null) {
        const { error } = await this.client
          .from("Reputation")
          .insert({ user_id: this.user.id, point: this.POINT_SYSTEM(action) });
        if (error)
          throw new ReputationError(error.message, action, this.user.id);
      } else {
        const point = this.POINT_SYSTEM(action) + curr_point.point;
        const { error } = await this.client
          .from("Reputation")
          .update({ point })
          .eq("id", curr_point.id);

        if (error)
          throw new ReputationError(error.message, action, this.user.id);
      }
    } catch (error: any) {
      console.log(error.message);
      throw error;
    }
  }

  async getReputation(): Promise<reputation | null> {
    try {
      if (!this.user) throw new AuthError("REP_SERVICE: Unable to fetch user");

      const { data, error } = await this.client
        .from("Reputation")
        .select()
        .eq("user_id", this.user.id)
        .returns<reputation[]>();
      if (error) throw new Error(error.message);
      if (data == null)
        throw new Error("REP_SERVICE: Unable to fetch reputation");
      if (data.length === 0) return null;

      return data[0];
    } catch (error: any) {
      if (error instanceof AuthError) throw new AuthError(error.message);
      else throw new ReputationError(error.message);
    }
  }

  /**
   * IMPORTANT:
   * this is the only function you should use do add reputation
   *
   * @public
   * @method Do action
   * @param action {keyof typeof POINT_SYS}
   * @returns void
   **/
  async doAction(
    action: keyof typeof POINT_SYS,
    callback: () => Promise<any>,
  ): Promise<any> {
    try {
      await this.getUser();
      const res = await callback();
      await this.setReputation(action);
      return res;
    } catch (error: any) {
      throw error;
    }
  }

  private POINT_SYSTEM(action: keyof typeof POINT_SYS): number {
    return POINT_SYS[action];
  }
}
