import nodemailer from "nodemailer";

// ─── Transporter (created once, reused) ──────────────────
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // true for 465, false for 587 (STARTTLS)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// ─── Professional Password-Reset Email ───────────────────
export async function sendPasswordResetEmail(to: string, resetLink: string) {
  const clinicName = "Elite Dental Centre";
  const year = new Date().getFullYear();

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reset Your Password</title>
</head>
<body style="margin:0; padding:0; background-color:#f1f5f9; font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">

  <!-- Wrapper -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9; padding:40px 0;">
    <tr>
      <td align="center">

        <!-- Card -->
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:16px; box-shadow:0 4px 24px rgba(0,0,0,0.06); overflow:hidden; max-width:560px; width:100%;">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%); padding:36px 40px; text-align:center;">
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  <td style="background-color:rgba(255,255,255,0.2); border-radius:50%; width:56px; height:56px; text-align:center; vertical-align:middle;">
                    <span style="font-size:28px; line-height:56px;">🦷</span>
                  </td>
                </tr>
              </table>
              <h1 style="color:#ffffff; font-size:22px; font-weight:700; margin:16px 0 4px 0; letter-spacing:-0.3px;">
                ${clinicName}
              </h1>
              <p style="color:rgba(255,255,255,0.85); font-size:13px; margin:0; font-weight:400;">
                Secure Account Recovery
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px 20px 40px;">
              <h2 style="color:#1e293b; font-size:20px; font-weight:700; margin:0 0 8px 0;">
                Reset Your Password
              </h2>
              <p style="color:#64748b; font-size:15px; line-height:24px; margin:0 0 24px 0;">
                We received a request to reset the password for your account. Click the button below to choose a new password.
              </p>

              <!-- CTA Button -->
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="padding:8px 0 24px 0;">
                    <a href="${resetLink}"
                       target="_blank"
                       style="display:inline-block; background:linear-gradient(135deg,#059669,#10b981); color:#ffffff; text-decoration:none; font-size:15px; font-weight:600; padding:14px 40px; border-radius:10px; letter-spacing:0.3px; box-shadow:0 4px 14px rgba(5,150,105,0.35);">
                      Reset My Password
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Alternate link -->
              <p style="color:#94a3b8; font-size:12px; line-height:18px; margin:0 0 24px 0; word-break:break-all;">
                If the button doesn't work, copy and paste this link into your browser:<br/>
                <a href="${resetLink}" style="color:#059669; text-decoration:underline;">${resetLink}</a>
              </p>

              <!-- Security Info Box -->
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f0fdf4; border:1px solid #bbf7d0; border-radius:10px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="vertical-align:top; padding-right:12px;">
                          <span style="font-size:18px;">🔒</span>
                        </td>
                        <td>
                          <p style="color:#166534; font-size:13px; font-weight:600; margin:0 0 4px 0;">Security Notice</p>
                          <p style="color:#15803d; font-size:12px; line-height:18px; margin:0;">
                            This link will expire in <strong>1 hour</strong> for your security. If you didn't request a password reset, you can safely ignore this email — your password will remain unchanged.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <hr style="border:none; border-top:1px solid #e2e8f0; margin:16px 0;" />
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:12px 40px 32px 40px; text-align:center;">
              <p style="color:#94a3b8; font-size:12px; line-height:18px; margin:0 0 4px 0;">
                &copy; ${year} ${clinicName}. All rights reserved.
              </p>
              <p style="color:#cbd5e1; font-size:11px; line-height:16px; margin:0;">
                This is an automated email. Please do not reply directly to this message.
              </p>
            </td>
          </tr>

        </table>
        <!-- /Card -->

      </td>
    </tr>
  </table>
  <!-- /Wrapper -->

</body>
</html>`;

  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM || `"${clinicName}" <${process.env.SMTP_USER}>`,
    to,
    subject: `Reset Your Password – ${clinicName}`,
    text: `You requested a password reset. Visit this link to set a new password: ${resetLink}\n\nThis link expires in 1 hour. If you didn't request this, ignore this email.`,
    html,
  });

  console.log("[EMAIL] Password reset email sent:", info.messageId);
  return info;
}

// ─── Professional Account Setup Email ───────────────────
export async function sendAccountSetupEmail(to: string, name: string, setupLink: string) {
  const clinicName = "Elite Dental Centre";
  const year = new Date().getFullYear();

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Complete Your Registration</title>
</head>
<body style="margin:0; padding:0; background-color:#f1f5f9; font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9; padding:40px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:16px; box-shadow:0 4px 24px rgba(0,0,0,0.06); overflow:hidden; max-width:560px; width:100%;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%); padding:36px 40px; text-align:center;">
              <h1 style="color:#ffffff; font-size:24px; font-weight:700; margin:0;">
                Welcome to ${clinicName}
              </h1>
              <p style="color:rgba(255,255,255,0.85); font-size:14px; margin:8px 0 0 0;">
                Complete your profile to manage your dental care
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 20px 40px;">
              <h2 style="color:#1e293b; font-size:20px; font-weight:700; margin:0 0 12px 0;">
                Hello ${name},
              </h2>
              <p style="color:#64748b; font-size:15px; line-height:24px; margin:0 0 24px 0;">
                Thank you for choosing Elite Dental Centre. To complete your account registration and set your password, please click the button below.
              </p>

              <!-- CTA Button -->
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="padding:8px 0 24px 0;">
                    <a href="${setupLink}"
                       target="_blank"
                       style="display:inline-block; background:linear-gradient(135deg,#0d9488,#0f766e); color:#ffffff; text-decoration:none; font-size:15px; font-weight:600; padding:14px 40px; border-radius:10px; letter-spacing:0.3px; box-shadow:0 4px 14px rgba(13,148,136,0.35);">
                      Setup My Account
                    </a>
                  </td>
                </tr>
              </table>

              <p style="color:#94a3b8; font-size:12px; line-height:18px; margin:0 0 24px 0; word-break:break-all;">
                If the button doesn't work, copy and paste this link into your browser:<br/>
                <a href="${setupLink}" style="color:#0d9488; text-decoration:underline;">${setupLink}</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:12px 40px 32px 40px; text-align:center; border-top:1px solid #e2e8f0;">
              <p style="color:#94a3b8; font-size:12px; line-height:18px; margin:16px 0 4px 0;">
                &copy; ${year} ${clinicName}. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM || `"${clinicName}" <${process.env.SMTP_USER}>`,
    to,
    subject: `Complete Your Registration – ${clinicName}`,
    text: `Welcome ${name}! Complete your account setup by visiting this link: ${setupLink}`,
    html,
  });

  console.log("[EMAIL] Account setup email sent:", info.messageId);
  return info;
}

// ─── Professional Appointment Confirmation Email ───────────────────
export async function sendAppointmentConfirmationEmail(
  to: string,
  patientName: string,
  treatmentName: string,
  date: string,
  time: string
) {
  const clinicName = "Elite Dental Centre";
  const year = new Date().getFullYear();

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Appointment Confirmation</title>
</head>
<body style="margin:0; padding:0; background-color:#f1f5f9; font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9; padding:40px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:16px; box-shadow:0 4px 24px rgba(0,0,0,0.06); overflow:hidden; max-width:560px; width:100%;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%); padding:36px 40px; text-align:center;">
              <h1 style="color:#ffffff; font-size:24px; font-weight:700; margin:0;">
                Appointment Confirmed
              </h1>
              <p style="color:rgba(255,255,255,0.85); font-size:14px; margin:8px 0 0 0;">
                ${clinicName}
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 20px 40px;">
              <h2 style="color:#1e293b; font-size:20px; font-weight:700; margin:0 0 12px 0;">
                Hello ${patientName},
              </h2>
              <p style="color:#64748b; font-size:15px; line-height:24px; margin:0 0 24px 0;">
                Your appointment has been successfully booked. We look forward to seeing you.
              </p>

              <!-- Details Box -->
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; margin-bottom:24px;">
                <tr>
                  <td style="padding:20px;">
                    <p style="margin:0 0 8px 0; font-size:14px; color:#64748b;"><strong>Treatment:</strong> <span style="color:#1e293b;">${treatmentName}</span></p>
                    <p style="margin:0 0 8px 0; font-size:14px; color:#64748b;"><strong>Date:</strong> <span style="color:#1e293b;">${date}</span></p>
                    <p style="margin:0; font-size:14px; color:#64748b;"><strong>Time:</strong> <span style="color:#1e293b;">${time}</span></p>
                  </td>
                </tr>
              </table>

              <!-- Notice -->
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#fffbeb; border:1px solid #fde68a; border-radius:10px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="color:#92400e; font-size:13px; margin:0;">
                      <strong>Important:</strong> Please arrive 15 minutes before your scheduled appointment time.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:12px 40px 32px 40px; text-align:center; border-top:1px solid #e2e8f0;">
              <p style="color:#94a3b8; font-size:12px; line-height:18px; margin:16px 0 4px 0;">
                &copy; ${year} ${clinicName}. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM || `"${clinicName}" <${process.env.SMTP_USER}>`,
    to,
    subject: `Appointment Confirmed - ${clinicName}`,
    text: `Hello ${patientName},\n\nYour appointment for ${treatmentName} has been booked on ${date} at ${time}.\n\nPlease arrive 15 minutes before your appointment.`,
    html,
  });

  console.log("[EMAIL] Appointment confirmation email sent:", info.messageId);
  return info;
}

// ─── Professional Appointment Reschedule Email ───────────────────
export async function sendAppointmentRescheduleEmail(
  to: string,
  patientName: string,
  treatmentName: string,
  newDate: string,
  newTime: string
) {
  const clinicName = "Elite Dental Centre";
  const year = new Date().getFullYear();

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Appointment Rescheduled</title>
</head>
<body style="margin:0; padding:0; background-color:#f1f5f9; font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9; padding:40px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:16px; box-shadow:0 4px 24px rgba(0,0,0,0.06); overflow:hidden; max-width:560px; width:100%;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); padding:36px 40px; text-align:center;">
              <h1 style="color:#ffffff; font-size:24px; font-weight:700; margin:0;">
                Appointment Rescheduled
              </h1>
              <p style="color:rgba(255,255,255,0.85); font-size:14px; margin:8px 0 0 0;">
                ${clinicName}
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 20px 40px;">
              <h2 style="color:#1e293b; font-size:20px; font-weight:700; margin:0 0 12px 0;">
                Hello ${patientName},
              </h2>
              <p style="color:#64748b; font-size:15px; line-height:24px; margin:0 0 24px 0;">
                Your appointment has been successfully rescheduled. Please review your new appointment details below.
              </p>

              <!-- Details Box -->
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f0f9ff; border:1px solid #bae6fd; border-radius:10px; margin-bottom:24px;">
                <tr>
                  <td style="padding:20px;">
                    <p style="margin:0 0 8px 0; font-size:14px; color:#0369a1;"><strong>Treatment:</strong> <span style="color:#0f172a;">${treatmentName}</span></p>
                    <p style="margin:0 0 8px 0; font-size:14px; color:#0369a1;"><strong>New Date:</strong> <span style="color:#0f172a;">${newDate}</span></p>
                    <p style="margin:0; font-size:14px; color:#0369a1;"><strong>New Time:</strong> <span style="color:#0f172a;">${newTime}</span></p>
                  </td>
                </tr>
              </table>

              <!-- Notice -->
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#fffbeb; border:1px solid #fde68a; border-radius:10px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="color:#92400e; font-size:13px; margin:0;">
                      <strong>Important:</strong> Please arrive 15 minutes before your scheduled appointment time.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:12px 40px 32px 40px; text-align:center; border-top:1px solid #e2e8f0;">
              <p style="color:#94a3b8; font-size:12px; line-height:18px; margin:16px 0 4px 0;">
                &copy; ${year} ${clinicName}. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM || `"${clinicName}" <${process.env.SMTP_USER}>`,
    to,
    subject: `Appointment Rescheduled - ${clinicName}`,
    text: `Hello ${patientName},\n\nYour appointment for ${treatmentName} has been rescheduled to ${newDate} at ${newTime}.\n\nPlease arrive 15 minutes before your appointment.`,
    html,
  });

  console.log("[EMAIL] Appointment reschedule email sent:", info.messageId);
  return info;
}
