import nodemailer from 'nodemailer';

// 🔹 Configure Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAILER_SENDER, // Your Gmail email
    pass: process.env.MY_PASSWORD, // Your Gmail app password
  },
});

export default transporter;
