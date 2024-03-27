export class FetchError extends Error {
  constructor(msg: string) {
    super(msg);
    Object.setPrototypeOf(this, FetchError.prototype);
  }

  getMessage() {
    return "Error fetching resource: " + this.message;
  }
}
