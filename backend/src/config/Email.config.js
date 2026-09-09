import nodemailer from 'nodemailer';
import config from './index.js';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.EMAIL_USER,
    pass: config.EMAIL_APP_PASS,
  },
});

// Verify connection configuration
transporter.verify((err) => {
  if (err) {
    console.error('❌ Mail Server Connection Error:', err.message);
  } else {
    console.log('✅ Mail Server Connected Successfully (Gmail SMTP)');
  }
});

export default transporter;
