export class AuthError extends Error {
  constructor(msg: string) {
    super(msg);
    Object.setPrototypeOf(this, AuthError.prototype);
  }

  getMessage() {
    return "Authentication error: " + this.message;
  }
}
