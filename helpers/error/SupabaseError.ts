export class SupabaseError extends Error {
  constructor(msg: string) {
    super(msg);
    Object.setPrototypeOf(this, SupabaseError.prototype);
  }

  getMessage() {
    return "Server error: " + this.message;
  }
}
