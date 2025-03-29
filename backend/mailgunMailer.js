const { exec } = require('child_process');

function sendEmailWithSwaks(to, subject, body) {
  // Construct the swaks command using Mailgun SMTP settings
  const swaksCmd = `./swaks --auth \
    --server ${process.env.SMTP_HOSTNAME || 'smtp.mailgun.org'} \
    --port ${process.env.SMTP_PORT || '587'} \
    --au ${process.env.SMTP_USERNAME || 'postmaster@sandbox4decfd0820d14a17a83f1c443d63c28a.mailgun.org'} \
    --ap ${process.env.MAILGUN_PASSWORD || '4ef1a82f4531acadbb2f31748a052458-f6202374-ff99d29f'} \
    --from "postmaster@sandbox4decfd0820d14a17a83f1c443d63c28a.mailgun.org" \
    --to ${to} \
    --h-Subject: "${subject}" \
    --body '${body}'`;

  exec(swaksCmd, (error, stdout, stderr) => {
    if (error) {
      console.error('Error sending email via swaks:', error);
      return;
    }
    if (stderr) {
      console.error('swaks stderr:', stderr);
    }
    console.log('swaks stdout:', stdout);
  });
}

module.exports = { sendEmailWithSwaks };
