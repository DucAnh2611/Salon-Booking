require("dotenv").config();
const nodemailer = require('nodemailer');

// const transporter = nodemailer.createTransport({
//     host: process.env.NODEMAILERHOST,
//     port: process.env.NODEMAILERPORT,
//     auth: {
//         user: process.env.NODEMAILERUSER,
//         pass: process.env.NODEMAILERPASS
//     }
// });

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'ducanhmc24@gmail.com',
      pass: 'rcot mgeu ymgg urol'
    }
  });

const mailOptions = {
    from: 'Salong Booking App',
    to: ["ddanh2611@gmail.com", "ducanhmc24@gmail.com"],
    subject: 'My first Email!!!',
    text: "This is my first email. I am so excited!"
};

const sendM = () => {
    transporter.sendMail(mailOptions, (err, res) =>{
        if(err) {
            console.log(err);
            return;
        }

        console.log("sented");
    })
}

module.exports = sendM;