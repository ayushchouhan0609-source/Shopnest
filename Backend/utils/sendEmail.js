const nodemailer = require('nodemailer');

// Build transporter based on available env vars.
// Prefer explicit MAIL_PROVIDER, fall back to SendGrid if API key present, else Gmail.
function createTransporter() {
  const provider = (process.env.MAIL_PROVIDER || '').toLowerCase();

  if (provider === 'sendgrid' || process.env.SENDGRID_API_KEY) {
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
      console.warn('SENDGRID_API_KEY not set, skipping SendGrid transport');
    } else {
      return nodemailer.createTransport({
        host: 'smtp.sendgrid.net',
        port: 587,
        secure: false,
        auth: {
          user: 'apikey',
          pass: apiKey,
        },
      });
    }
  }

  // Fallback to Gmail if EMAIL_USER and EMAIL_PASS provided
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    return nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  // No transport configured — return a stub that throws when used.
  return null;
}

let transporter = createTransporter();

if (transporter) {
  transporter.verify()
    .then(() => console.info('Mail transporter verified'))
    .catch((err) => console.warn('Mail transporter verify failed:', err && err.message));
} else {
  console.warn('No mail transporter configured. Set SENDGRID_API_KEY or EMAIL_USER/EMAIL_PASS.');

  // In development, if no real transporter configured, create an Ethereal test account
  // so developers can preview emails without real credentials.
  if (process.env.NODE_ENV !== 'production') {
    nodemailer.createTestAccount()
      .then((testAccount) => {
        transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });

        transporter.verify()
          .then(() => console.info('Ethereal transporter ready. Preview emails with nodemailer.getTestMessageUrl(info)'))
          .catch((err) => console.warn('Ethereal transporter verify failed:', err && err.message));

        console.info('Ethereal test account created. user:', testAccount.user);
      })
      .catch((err) => console.warn('Failed to create Ethereal test account:', err && err.message));
  }
}

/**
 * sendEmail({ to, subject, text, html })
 * Tries configured transporter; if failure and SendGrid available, attempts SendGrid fallback.
 */
const sendEmail = async ({ to, subject, text, html } = {}) => {
  if (!to) throw new Error('Missing `to` for sendEmail');

  const mailOptions = {
    from: process.env.EMAIL_USER || (process.env.SENDGRID_FROM || undefined),
    to,
    subject,
    text,
    html,
  };

  if (!transporter) {
    const msg = 'No mail transporter configured (EMAIL_USER/EMAIL_PASS or SENDGRID_API_KEY)';
    console.error(msg);
    throw new Error(msg);
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    // Attach preview URL for Ethereal (dev) to help debugging
    try {
      const preview = nodemailer.getTestMessageUrl(info);
      if (preview) {
        info.previewUrl = preview;
        console.info('Email preview URL:', preview);
      }
    } catch (e) {
      // ignore if not applicable
    }

    console.info('Email sent:', info && (info.response || info.messageId));
    return info;
  } catch (err) {
    console.error('Primary transporter failed:', err && err.message);

    // If primary wasn't SendGrid and SendGrid key exists, try SendGrid as fallback
    if (process.env.SENDGRID_API_KEY && (!process.env.MAIL_PROVIDER || process.env.MAIL_PROVIDER !== 'sendgrid')) {
      try {
        const sendgridTransport = nodemailer.createTransport({
          host: 'smtp.sendgrid.net',
          port: 587,
          secure: false,
          auth: { user: 'apikey', pass: process.env.SENDGRID_API_KEY },
        });

        const info2 = await sendgridTransport.sendMail(mailOptions);
        console.info('Email sent via SendGrid fallback:', info2 && (info2.response || info2.messageId));
        return info2;
      } catch (err2) {
        console.error('SendGrid fallback failed:', err2 && err2.message);
        throw err2;
      }
    }

    throw err;
  }
};

module.exports = { sendEmail };