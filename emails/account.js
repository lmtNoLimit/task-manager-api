const sgMail = require('@sendgrid/mail');
// const apiKey = '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';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports.sendWelcomeMessage = (email, name) => {
  sgMail.send({
    to: email,
    from: 'lmt151099@gmail.com',
    subject: 'Thanks for using our application',
    text: `Welcome to the app, ${name}. Enjoy our application!`,
  });
}

module.exports.sendCancelationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'lmt151099@gmail.com',
    subject: 'Unsubscribe email',
    text: `${name}, please tell us know why you stop using our application`
  });
}