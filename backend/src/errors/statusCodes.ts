class StatusCodes {
  get BADREQUEST() {
    return 400;
  }
  get INTERNAL_SERVER_ERROR() {
    return 500;
  }
  get OK() {
    return 200;
  }

  get CREATED() {
    return 201;
  }
  get NO_CONTENT() {
    return 204;
  }
  get UNAUTHORIZED() {
    return 401;
  }
  get FORBIDDEN() {
    return 403;
  }
  get NOTFOUND() {
    return 404;
  }
  get TOO_LARGE_PAYLOAD() {
    return 413;
  }
  get TO_MANY_REQUEST() {
    return 429;
  }
}

export default new StatusCodes();
