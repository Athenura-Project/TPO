export const otpTemplate = (otp) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>OTP Verification</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700&family=JetBrains+Mono:wght@400;700&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      background-color: #f0f4ff;
      font-family: 'Sora', sans-serif;
      padding: 40px 16px;
    }

    .wrapper {
      max-width: 540px;
      margin: 0 auto;
    }

    /* ── Header ── */
    .header {
      background: linear-gradient(135deg, #1e40af 0%, #1d4ed8 50%, #2563eb 100%);
      border-radius: 20px 20px 0 0;
      padding: 40px 48px 36px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }

    .header::before {
      content: '';
      position: absolute;
      top: -40px; right: -40px;
      width: 160px; height: 160px;
      background: rgba(255,255,255,0.06);
      border-radius: 50%;
    }

    .header::after {
      content: '';
      position: absolute;
      bottom: -30px; left: -20px;
      width: 120px; height: 120px;
      background: rgba(255,255,255,0.04);
      border-radius: 50%;
    }

    .logo-mark {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 20px;
    }

    .logo-icon {
      width: 42px; height: 42px;
      background: rgba(255,255,255,0.15);
      border: 1px solid rgba(255,255,255,0.25);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    }

    .logo-text {
      font-size: 18px;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: -0.3px;
    }

    .header h1 {
      font-size: 26px;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: -0.5px;
      line-height: 1.2;
    }

    .header p {
      margin-top: 8px;
      font-size: 14px;
      color: rgba(255,255,255,0.75);
      font-weight: 300;
    }

    /* ── Body ── */
    .body {
      background: #ffffff;
      padding: 44px 48px;
    }

    .greeting {
      font-size: 15px;
      color: #374151;
      line-height: 1.6;
    }

    .greeting strong {
      color: #1e40af;
    }

    /* ── OTP Box ── */
    .otp-container {
      margin: 32px 0;
      text-align: center;
    }

    .otp-label {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: #9ca3af;
      margin-bottom: 16px;
    }

    .otp-box {
      display: inline-block;
      background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
      border: 2px solid #bfdbfe;
      border-radius: 16px;
      padding: 24px 48px;
    }

    .otp-code {
      font-family: 'JetBrains Mono', monospace;
      font-size: 44px;
      font-weight: 700;
      color: #1e40af;
      letter-spacing: 12px;
      line-height: 1;
    }

    /* ── Timer ── */
    .timer-bar {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-top: 16px;
    }

    .timer-dot {
      width: 8px; height: 8px;
      background: #f59e0b;
      border-radius: 50%;
    }

    .timer-text {
      font-size: 13px;
      color: #6b7280;
    }

    .timer-text strong {
      color: #d97706;
    }

    /* ── Info Cards ── */
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin: 28px 0;
    }

    .info-card {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 16px;
      text-align: center;
    }

    .info-card .icon {
      font-size: 22px;
      margin-bottom: 6px;
    }

    .info-card .label {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 1px;
      text-transform: uppercase;
      color: #9ca3af;
      margin-bottom: 2px;
    }

    .info-card .value {
      font-size: 13px;
      font-weight: 600;
      color: #374151;
    }

    /* ── Warning ── */
    .warning {
      background: #fffbeb;
      border: 1px solid #fde68a;
      border-left: 4px solid #f59e0b;
      border-radius: 10px;
      padding: 14px 18px;
      margin: 24px 0;
      font-size: 13px;
      color: #92400e;
      line-height: 1.5;
    }

    /* ── Divider ── */
    .divider {
      border: none;
      border-top: 1px solid #f3f4f6;
      margin: 28px 0;
    }

    .closing {
      font-size: 14px;
      color: #6b7280;
      line-height: 1.7;
    }

    .closing strong {
      color: #374151;
    }

    /* ── Footer ── */
    .footer {
      background: #1e293b;
      border-radius: 0 0 20px 20px;
      padding: 28px 48px;
      text-align: center;
    }

    .footer-brand {
      font-size: 15px;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: -0.3px;
      margin-bottom: 6px;
    }

    .footer-tagline {
      font-size: 12px;
      color: #64748b;
      margin-bottom: 20px;
    }

    .footer-links {
      margin-bottom: 16px;
    }

    .footer-links a {
      font-size: 12px;
      color: #94a3b8;
      text-decoration: none;
      margin: 0 10px;
    }

    .footer-copy {
      font-size: 11px;
      color: #475569;
    }

    /* ── Responsive ── */
    @media (max-width: 480px) {
      .header, .body { padding: 32px 24px; }
      .footer { padding: 24px; }
      .otp-code { font-size: 36px; letter-spacing: 8px; }
      .otp-box { padding: 20px 32px; }
      .info-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <div class="wrapper">

    <!-- Header -->
    <div class="header">
      <div class="logo-mark">
        <div class="logo-icon">🎓</div>
        <span class="logo-text">Athenura TPO</span>
      </div>
      <h1>Verify Your Identity</h1>
      <p>Admin Account Registration</p>
    </div>

    <!-- Body -->
    <div class="body">
      <p class="greeting">
        Hello there 👋<br/><br/>
        You're one step away from accessing the <strong>TPO Management Platform</strong>.
        Use the one-time password below to complete your admin account registration.
      </p>

      <!-- OTP -->
      <div class="otp-container">
        <div class="otp-label">Your One-Time Password</div>
        <div class="otp-box">
          <div class="otp-code">${otp}</div>
        </div>
        <div class="timer-bar">
          <div class="timer-dot"></div>
          <span class="timer-text">Expires in <strong>10 minutes</strong></span>
        </div>
      </div>

      <!-- Info Cards -->
      <div class="info-grid">
        <div class="info-card">
          <div class="icon">🔒</div>
          <div class="label">One-Time Use</div>
          <div class="value">Single use only</div>
        </div>
        <div class="info-card">
          <div class="icon">⏱️</div>
          <div class="label">Valid For</div>
          <div class="value">10 Minutes</div>
        </div>
      </div>

      <!-- Warning -->
      <div class="warning">
        ⚠️ <strong>Never share this OTP</strong> with anyone. Athenura will never ask for your OTP via phone, email, or chat. If you didn't request this, please ignore this email.
      </div>

      <hr class="divider" />

      <p class="closing">
        If you have any trouble, reach out to our support team.<br/><br/>
        Best regards,<br/>
        <strong>The Athenura Team</strong>
      </p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div class="footer-brand">Athenura TPO Platform</div>
      <div class="footer-tagline">Training & Placement Opportunity Management</div>
      <div class="footer-links">
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
        <a href="#">Support</a>
      </div>
      <div class="footer-copy">© ${new Date().getFullYear()} Athenura. All rights reserved.</div>
    </div>

  </div>
</body>
</html>
  `;
};
