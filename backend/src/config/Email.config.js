import nodemailer from 'nodemailer';
import dns from 'dns';
import config from './index.js';

// Force Node.js to prioritize IPv4 over IPv6 to avoid SMTP connection issues
try {
  dns.setDefaultResultOrder('ipv4first');
} catch {
  // Ignore fallback failure
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.EMAIL_USER,
    pass: config.EMAIL_APP_PASS,
  },
  tls: {
    rejectUnauthorized: config.NODE_ENV === 'production',
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
