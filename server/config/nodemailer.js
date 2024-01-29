const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
      clientId: process.env.OAUTH_CLIENTID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN
    }
  });

let mailOptions = {
    from: "ducanhmc24@gmail.com",
    to: "ddanh2611@gmail.com",
    subject: 'Nodemailer Project',
    text: 'Hi from your nodemailer project'
};
const sendM = () => {
    transporter.sendMail(mailOptions, function(err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log("Email sent successfully");
        }
    });
}

module.exports = sendM;