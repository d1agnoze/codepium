import { POINT_SYS } from "@/defaults/points.system";

export class ReputationError extends Error {
  private _action: keyof typeof POINT_SYS | undefined;
  private _user_id: string | undefined;

  constructor(msg: string, action?: keyof typeof POINT_SYS, user_id?: string) {
    super(msg);
    this._action = action;
    this._user_id = user_id;
    Object.setPrototypeOf(this, ReputationError.prototype);
  }

  /**
   * @method getMessage
   * @public
   * @returns string simple message from error
   * */
  getMessage() {
    return "Reputation error : " + this.message;
  }

  /**
   * @method getDetails
   * @public
   * @returns string detailed message from error
   * */
  getDetails() {
    if (!this._action || !this._user_id) return "No trace found";
    const trace = `Action: ${this._action}
      , User_ID: ${this._user_id},
      , Points_sys: ${POINT_SYS[this._action]}`;
    return trace;
  }
}
