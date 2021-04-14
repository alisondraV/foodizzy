export class NotFoundError extends Error {
  constructor(item) {
    super(`${item} was not found`);
    this.name = 'Not Found Error';
  }
}

export class AuthorizationError extends Error {
  constructor() {
    super('Unauthorized');
    this.name = 'Authorization Error';
  }
}
