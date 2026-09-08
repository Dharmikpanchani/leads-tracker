import transporter from '../config/Email.config.js';
import config from '../config/index.js';

// Helper function to send email with automatic retries and exponential backoff
async function sendMailWithRetry(mailOptions, maxRetries = 3) {
  let lastError = null;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(`✉️ [EMAIL SENT] OTP successfully emailed to ${mailOptions.to} (Attempt ${attempt}, MessageID: ${info?.messageId})`);
      return { success: true, messageId: info?.messageId };
    } catch (error) {
      lastError = error;
      console.warn(`⚠️ [EMAIL RETRY] Attempt ${attempt} failed for ${mailOptions.to}: ${error.message}`);
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
      }
    }
  }
  console.error(`❌ [EMAIL FAILED] All ${maxRetries} email attempts failed for ${mailOptions.to}: ${lastError?.message}`);
  return { success: false, error: lastError?.message };
}

// Send Forgot Password OTP Email with setImmediate (Non-blocking background dispatch)
export function sendForgotPasswordOtpEmail(email, otp) {
  return new Promise((resolve) => {
    setImmediate(async () => {
      try {
        const htmlTemplate = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #1e293b; }
              .container { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0, 33, 71, 0.08); border: 1px solid #e2e8f0; }
              .header { background: linear-gradient(135deg, #002147 0%, #00509d 100%); padding: 30px 20px; text-align: center; color: #ffffff; }
              .header h1 { margin: 0; font-size: 22px; font-weight: 700; letter-spacing: 0.5px; }
              .content { padding: 30px; }
              .otp-box { background: #f1f5f9; border: 2px dashed #00509d; border-radius: 8px; padding: 18px; text-align: center; margin: 25px 0; }
              .otp-code { font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #002147; font-family: monospace; }
              .note { font-size: 13px; color: #64748b; line-height: 1.6; margin-top: 20px; }
              .footer { background: #f8fafc; padding: 15px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Leads Tracker Portal</h1>
              </div>
              <div class="content">
                <h2 style="font-size: 18px; margin-top: 0; color: #0f172a;">Password Reset Request</h2>
                <p style="font-size: 14px; line-height: 1.6; color: #334155;">
                  We received a request to reset your Leads Tracker account password. Use the following One-Time Password (OTP) to proceed:
                </p>
                <div class="otp-box">
                  <div class="otp-code">${otp}</div>
                </div>
                <p style="font-size: 14px; color: #475569;">
                  ⏱️ This code is valid for <strong>5 minutes</strong>. Please do not share it with anyone.
                </p>
                <div class="note">
                  If you didn't request a password reset, you can safely ignore this email.
                </div>
              </div>
              <div class="footer">
                &copy; ${new Date().getFullYear()} Leads Tracker • Enterprise CRM
              </div>
            </div>
          </body>
          </html>
        `;

        const mailOptions = {
          from: `"Leads Tracker" <${config.EMAIL_FROM}>`,
          to: email,
          subject: '🔑 Your Leads Tracker Password Reset OTP',
          html: htmlTemplate,
        };

        const res = await sendMailWithRetry(mailOptions, 3);
        resolve(res);
      } catch (error) {
        console.error(`❌ [EMAIL ERROR] Error in sendForgotPasswordOtpEmail: ${error.message}`);
        resolve({ success: false, error: error.message });
      }
    });
  });
}

export default {
  sendForgotPasswordOtpEmail,
};
