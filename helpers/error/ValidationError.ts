export class ValidationError extends Error {
  private _details: string[] = [];
  constructor(msg: string, details?: string[]) {
    super(msg);
    Object.setPrototypeOf(this, ValidationError.prototype);
    if (details) this._details = details;
  }
  getDetails() {
    return this._details;
  }

  getMessage() {
    return "ValidationError error: " + this.message;
  }
}
