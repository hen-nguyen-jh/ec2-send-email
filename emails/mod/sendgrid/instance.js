const sgMail = require('@sendgrid/mail');
const sgClient = require('@sendgrid/client');

sgClient.setApiKey(process.env.SENDGRID_API_KEY);
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = {
  sgClient,
  sgMail,
};
