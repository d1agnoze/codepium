export class ResourceDeletedError extends Error {
  constructor(msg: string) {
    super(msg);
    Object.setPrototypeOf(this, ResourceDeletedError.prototype);
  }

  getMessage() {
    return this.message;
  }
}
