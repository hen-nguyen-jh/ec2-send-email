module.exports.SUBJECTS_EMAIL = 'ITEM PUBLISHED';
module.exports.MARKETPLACE_NAME = 'Allset';

module.exports.SENDER_EMAIL = process.env.SENDGRID_VERIFIED_SENDER;
module.exports.MARKETPLACE_URL = process.env.VITE_MARKETPLACE_ROOT_URL;

module.exports.cdnAssetPaths = {
  emails: '/content/email-texts.json',
};
