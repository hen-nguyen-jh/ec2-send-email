const httpCodes = {
  OK: 200,
  INTERNAL_SERVER_ERROR: 500,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
};

const errorName = {
  UNAUTHORIZED: 'unauthorized',
  INTERNAL_SERVER_ERROR: 'internal-server-error',
  BAD_REQUEST: 'bad-request',
  FORBIDDEN: 'forbidden',
};

module.exports = {
  httpCodes,
  errorName,
}
