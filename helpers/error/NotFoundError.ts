export class NotFoundError extends Error {
  constructor(msg: string) {
    super(msg);
    Object.setPrototypeOf(this,NotFoundError.prototype);
  }

  getMessage() {
    return "Error fetching resource: " + this.message;
  }
}
