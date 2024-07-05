const { MARKETPLACE_URL, MARKETPLACE_NAME } = require('./config');

const { denormalisedResponseEntities } = require('../../../../utils/data/data');
const { getIntegrationSdk } = require('../../../../api-util/sdk');
const { httpCodes } = require('../../../common/response/types');

module.exports.generateAdminApprovedEmail = (i18next, params) => {
  const { author, marketplace } = params || {};

  const { t } = i18next;

  return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html lang="en">
      <head>
        <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
      </head>
      <table style="background-color:#ffffff;margin:0 auto;padding:24px 12px 0;font-family:-apple-system, BlinkMacSystemFont, &#x27;Segoe UI&#x27;, &#x27;Roboto&#x27;, &#x27;Oxygen&#x27;, &#x27;Ubuntu&#x27;, &#x27;Cantarell&#x27;, &#x27;Fira Sans&#x27;, &#x27;Droid Sans&#x27;, &#x27;Helvetica Neue&#x27;, sans-serif" align="center" role="presentation" cellSpacing="0" cellPadding="0" border="0" width="100%">
        <tbody>
          <tr>
            <td>
              <table align="center" role="presentation" cellSpacing="0" cellPadding="0" border="0" width="100%" style="max-width:600px;margin:0 auto">
                <tr style="width:100%">
                  <td>
                    <h1 style="font-size:26px;line-height:1.3;font-weight:700;color:#484848">${t('ItemPublished.Greeting', { firstName: author.firstName, marketplaceName: marketplace.name })}</h1>
                    <p style="font-size:16px;line-height:1.4;margin:16px 0;color:#484848">${t('ItemPublished.Announce')}</p>
                    <p style="font-size:16px;line-height:1.4;margin:16px 0;color:#484848">${t('UserJoined.ContactUsParagraph', "If you have any questions or if there's anything we can help you with, don't hesitate to let us know.")}</p>
                    <table style="padding:16px 0 0" align="center" role="presentation" cellSpacing="0" cellPadding="0" border="0" width="100%">
                      <tbody>
                        <tr>
                          <td><a href="${marketplace.url}" target="_blank" style="background-color:#007DF2;border-radius:4px;color:#fff;font-size:15px;text-decoration:none;text-align:center;display:inline-block;min-width:210px;padding:0px 0px;line-height:100%;max-width:100%"><span><!--[if mso]><i style="letter-spacing: undefinedpx;mso-font-width:-100%;mso-text-raise:0" hidden>&nbsp;</i><![endif]--></span><span style="background-color:#007DF2;border-radius:4px;color:#fff;font-size:15px;text-decoration:none;text-align:center;display:inline-block;min-width:210px;padding:16px 32px;max-width:100%;line-height:120%;text-transform:none;mso-padding-alt:0px;mso-text-raise:0">${t('UserJoined.GoToMarketplaceLink', { marketplaceName: marketplace.name }, 'Go to {marketplaceName}')}</span><span><!--[if mso]><i style="letter-spacing: undefinedpx;mso-font-width:-100%" hidden>&nbsp;</i><![endif]--></span></a>
                            <div>
                              <p style="font-size:14px;line-height:1.5;margin:16px 0;color:#484848">${t('TransactionEmails.AccessibleLinkText', { marketplaceName: marketplace.url }, "Can't click the button? Here's the link for your convenience:")} <a target="_blank" style="color:#067df7;text-decoration:none" href="${marketplace.url}">${marketplace.url}</a></p>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <div>
                      <p style="font-size:16px;line-height:1.4;margin:16px 0;color:#484848">${t('UserJoined.SignatureLine1', { marketplaceName: marketplace.name }, 'Have a great day! 👋')}<br />${t('UserJoined.SignatureLine2', { marketplaceName: marketplace.name }, 'The {marketplaceName} team')}</p>
                      <hr style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#E1E1E1;margin:20px 0" />
                      <p style="font-size:12px;line-height:15px;margin:0 auto;color:#b7b7b7;text-align:left;margin-bottom:50px">${t('TransactionEmails.MembershipParagraph', { marketplaceName: marketplace.name }, 'You have received this email notification because you are a member of {marketplaceName}. If you no longer wish to receive these emails, please contact {marketplaceName} team.')}</p>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </html>
  `;
};

module.exports.prepareAdminApproveMailContent = async (listingUuid, i18next) => {
  const integrationSdk = getIntegrationSdk();

  const listing = await integrationSdk.listings
    .show({
      id: listingUuid,
      include: ['author'],
    })
    .then((res) => denormalisedResponseEntities(res)[0]);

  const { author } = listing || {};

  if (!author) {
    console.error('Listing data is undefined ', listingUuid);

    response = {
      status: httpCodes.BAD_REQUEST,
      data: {
        data: {
          message: 'Invalid listing data',
        },
      },
    };
  }

  const {
    email: authorEmail,
    profile: { displayName: authorFirstName },
  } = author.attributes || {};

  const content = this.generateAdminApprovedEmail(i18next, {
    author: {
      firstName: authorFirstName,
    },
    marketplace: {
      name: MARKETPLACE_NAME,
      url: MARKETPLACE_URL,
    },
  });

  return {
    content,
    authorEmail,
  };
};

module.exports.initI18Next = async (i18next, { resources }) => {
  await i18next.init({
    interpolation: {
      prefix: '{',
      suffix: '}',
    },
    lng: 'en',
    resources,
  });
};

module.exports.fetchCdnAsset = async (sdk, path) => {
  try {
    const response = await sdk.assetByAlias({ path: '/content/email-texts.json', alias: 'latest' });
    return response.data.data;
  } catch (error) {
    console.error('Fail to fetch email texts from sharetribe');
  }
};
