import nodemailer from 'nodemailer';
import 'dotenv/config';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const mailOptions = {
  from: process.env.EMAIL_USER,
  to: process.env.EMAIL_USER,
  subject: 'Test Email from TaskMaster',
  text: 'If you are reading this, your email configuration works!'
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('Error sending email:');
    console.error(error.message);
    process.exit(1);
  } else {
    console.log('Email sent successfully: ' + info.response);
    process.exit(0);
  }
});
