const { getSdk } = require('api-util/sdk');
const i18next = require('i18next');

const { prepareAdminApproveMailContent, initI18Next, fetchCdnAsset } = require('./helper');
const { SENDER_EMAIL, SUBJECTS_EMAIL, cdnAssetPaths } = require('./config');

const send = require('../../../emails/mod/sendgrid/email/send');
const { handleSuccess, handleError } = require('../../../common/response/handler');
const { httpCodes } = require('../../../common/response/types');

module.exports = async (req, res) => {
  const sdk = getSdk(req, res);
  const mailTexts = await fetchCdnAsset(sdk, cdnAssetPaths.emails);

  await initI18Next(i18next, {
    resources: {
      en: {
        translation: mailTexts,
      },
    },
  });

  const { uuid: listingUuid } = req.body.listingId || {};

  if (!listingUuid || typeof listingUuid !== 'string') {
    return handleError(res, {
      status: httpCodes.BAD_REQUEST,
      data: {
        message: 'Invalid listing uuid',
      },
    });
  }

  try {
    let response;

    try {
      const { content: emailContent, authorEmail } = await prepareAdminApproveMailContent(
        listingUuid,
        i18next
      );

      await send({
        toEmail: authorEmail,
        fromEmail: SENDER_EMAIL,
        fromName: 'ALLSET PRODUCTIONS',
        emailSubject: SUBJECTS_EMAIL,
        emailContent: emailContent,
      });

      response = {
        status: httpCodes.OK,
        data: {
          data: {
            message: 'Email sent successfully',
          },
        },
      };
    } catch (error) {
      console.error(`Handle send email for approve listing (id: ${listingUuid}) error`, error);

      response = {
        status: httpCodes.INTERNAL_SERVER_ERROR,
        data: {
          data: {
            message: 'Internal Server Error',
          },
        },
      };
    }

    handleSuccess(res, response);
  } catch (error) {
    console.error('Handle event error', error);
    handleError(res, error);
  }
};
