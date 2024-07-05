const { sgMail} = require('../instance');


module.exports = (params) => {
  const {
    toEmail,
    fromEmail,
    fromName,
    emailSubject,
    emailContent,
  } = params;

  return sgMail.send({
    to: toEmail,
    from: {
      email: fromEmail,
      name: fromName,
    },
    subject: emailSubject,
    html: emailContent,
  })
}
