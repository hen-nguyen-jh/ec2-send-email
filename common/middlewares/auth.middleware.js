const { getSdk } = require('../../../api-util/sdk');
const { errors } = require('../../../utils/response');
const { denormalisedResponseEntities } = require('../../../utils/data/data');

const checkAuthentication = async (req, res, next) => {
  try {
    const sdk = getSdk(req, res);

    const response = await sdk.currentUser.show();
    const [currentUser] = denormalisedResponseEntities(response);

    if (!currentUser.id) throw new errors.UNAUTHORIZED();

    res.locals.currentUser = currentUser;
    res.locals.sdk = sdk;
    next();
  } catch (e) {
    next(e);
  }
};

module.exports = {
  checkAuthentication,
};
