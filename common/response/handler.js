const { httpCodes } = require("./types");

exports.handleError = (res, error) => {
  console.error('local-api-request-failed', error);
  const { status, statusText, data } = error;

  if (status && statusText && data) {
    const { status, statusText, data } = error;

    // JS SDK error
    res
      .status(error.status)
      .json({
        name: 'Local API request failed',
        status,
        statusText,
        data,
      })
      .end();
  } else {
    res
      .status(httpCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message })
      .end();
  }
};

exports.handleSuccess = (res, response) => {
  const { status, statusText, data } = response;
  if (status && statusText && data) {
    return res
      .status(status)
      .set('Content-Type', 'application/transit+json;charset=UTF-8')
      .send({
        status,
        statusText,
        data,
      })
      .end();
  }
  return res
    .status(httpCodes.OK)
    .send(response)
    .end();
};
