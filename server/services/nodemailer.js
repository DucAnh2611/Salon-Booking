require("dotenv").config();
const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.NODEMAILERUSER,
      pass: process.env.NODEMAILERPASS
    }
  });

const mailOptions = (to, ...props) => ({
    from: 'Salong Booking App',
    to: to,
    ...props
});

const sendEmail = (emails, ...props) => {

    return transporter.sendMail({
        ...mailOptions(emails, ...props),
    });

}

const generateOTP = () => {
    const otp = Math.ceil(Math.random()*99999) + 100000;
    return otp;
}

module.exports = {
    sendEmail, generateOTP
}