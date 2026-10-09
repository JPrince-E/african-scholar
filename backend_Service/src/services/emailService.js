const nodemailer = require('nodemailer');

// Initialize transporter using SMTP environment variables
const createTransporter = () => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  // Strip any accidental spaces from Google App Password
  const pass = process.env.SMTP_PASS ? process.env.SMTP_PASS.replace(/\s+/g, '') : '';

  if (!user || !pass) {
    console.warn('[EmailService] SMTP credentials not fully configured. Email sending will be simulated.');
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for 587
    auth: {
      user,
      pass
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

const sendMail = async ({ to, subject, html }) => {
  try {
    const transporter = createTransporter();
    if (!transporter) {
      console.log(`[EmailService Simulated] To: ${to} | Subject: ${subject}`);
      return { success: true, simulated: true };
    }

    const info = await transporter.sendMail({
      from: `"African Scholar Awards" <${process.env.SMTP_USER || 'no-reply@africanscholar.org'}>`,
      to,
      subject,
      html
    });

    console.log(`[EmailService] Message sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[EmailService Error] Failed sending email to ${to}:`, error.message);
    // Non-blocking: don't crash caller
    return { success: false, error: error.message };
  }
};

const emailHeader = (title) => `
  <div style="background: linear-gradient(135deg, #091e3a 0%, #1e3a8a 100%); padding: 36px 28px; border-radius: 16px 16px 0 0; text-align: center;">
    <div style="display: inline-block; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); padding: 8px 18px; border-radius: 999px; margin-bottom: 14px;">
      <span style="color: #fbbf24; font-size: 11px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase;">African Scholar Initiative</span>
    </div>
    <h1 style="color: #ffffff; font-size: 24px; font-weight: 900; margin: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      ${title}
    </h1>
  </div>
`;

const emailFooter = () => `
  <div style="background: #f8fafc; padding: 24px; border-radius: 0 0 16px 16px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #64748b; font-family: sans-serif;">
    <p style="margin: 0 0 8px;">African Scholar — Celebrating & Elevating Academic Excellence Across Africa</p>
    <p style="margin: 0;">This official communication was issued by the African Scholar Academic Directorate.</p>
  </div>
`;

exports.sendWelcomeEmail = async ({ email, name, title }) => {
  const greeting = title && name ? `${title} ${name}` : (name || 'Esteemed Scholar');
  const html = `
    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; box-shadow: 0 10px 25px rgba(0,0,0,0.05); overflow: hidden;">
      ${emailHeader('Welcome to African Scholar')}
      <div style="padding: 32px 28px; color: #1e293b; line-height: 1.6;">
        <h2 style="font-size: 18px; font-weight: 800; color: #0f172a; margin-top: 0;">Welcome, ${greeting}!</h2>
        <p style="font-size: 14px; color: #475569;">
          Your academic registration on the <strong>African Scholar Pan-African Registry</strong> has been successfully created.
        </p>
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 16px 20px; margin: 24px 0;">
          <h4 style="margin: 0 0 6px; color: #166534; font-size: 13px; font-weight: 700;">✓ Verified Academic Profile Active</h4>
          <p style="margin: 0; font-size: 12px; color: #15803d;">
            You can now showcase research publications, index metrics, and submit nominations for official African Scholar Awards.
          </p>
        </div>
        <p style="font-size: 13px; color: #475569;">
          Visit your dashboard to complete all sections of your academic metrics and review active award tiers:
        </p>
        <div style="text-align: center; margin: 28px 0;">
          <a href="${process.env.USER_CLIENT_URL || 'http://localhost:3000'}/dashboard" style="background: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-size: 13px; font-weight: 700; display: inline-block;">
            Access Scholar Dashboard →
          </a>
        </div>
      </div>
      ${emailFooter()}
    </div>
  `;

  return sendMail({
    to: email,
    subject: 'Welcome to African Scholar — Academic Excellence Registry',
    html
  });
};

exports.sendApplicationSubmittedEmail = async ({ email, name, awardTitle, tier, applicationId }) => {
  const html = `
    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; box-shadow: 0 10px 25px rgba(0,0,0,0.05); overflow: hidden;">
      ${emailHeader('Nomination Dossier Received')}
      <div style="padding: 32px 28px; color: #1e293b; line-height: 1.6;">
        <h2 style="font-size: 18px; font-weight: 800; color: #0f172a; margin-top: 0;">Nomination Dossier Logged</h2>
        <p style="font-size: 14px; color: #475569;">
          Dear ${name || 'Esteemed Colleague'}, your official nomination application for <strong>${awardTitle} (${tier} Tier)</strong> has been safely recorded.
        </p>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px 20px; margin: 20px 0;">
          <div style="font-size: 12px; margin-bottom: 8px;"><span style="color: #64748b;">Dossier Reference ID:</span> <strong style="color: #0f172a;">AS-NOM-${applicationId}</strong></div>
          <div style="font-size: 12px; margin-bottom: 8px;"><span style="color: #64748b;">Award Tier:</span> <strong style="color: #2563eb;">${tier}</strong></div>
          <div style="font-size: 12px;"><span style="color: #64748b;">Current Status:</span> <span style="background: #dbeafe; color: #1e40af; font-weight: 700; padding: 2px 8px; border-radius: 6px; font-size: 11px;">SUBMITTED</span></div>
        </div>
        <p style="font-size: 13px; color: #475569;">
          Your submitted publications, citation spread, and doctoral supervisions are currently queued for evaluation by the African Scholar Academic Benchmark Committee.
        </p>
        <div style="text-align: center; margin: 28px 0;">
          <a href="${process.env.USER_CLIENT_URL || 'http://localhost:3000'}/dashboard" style="background: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-size: 13px; font-weight: 700; display: inline-block;">
            Track Status on Dashboard →
          </a>
        </div>
      </div>
      ${emailFooter()}
    </div>
  `;

  return sendMail({
    to: email,
    subject: `[African Scholar] Nomination Received: ${awardTitle}`,
    html
  });
};

exports.sendApplicationVerdictEmail = async ({ email, name, awardTitle, tier, status, adminComments, scoreDetails }) => {
  let statusBadge = '';
  let statusTitle = '';
  let statusBg = '';

  if (status === 'APPROVED') {
    statusTitle = 'Nomination Verified & Approved';
    statusBg = '#f0fdf4';
    statusBadge = '<span style="background: #dcfce7; color: #166534; font-weight: 800; padding: 4px 12px; border-radius: 8px; font-size: 12px;">VERIFIED / APPROVED</span>';
  } else if (status === 'UNDER_REVIEW') {
    statusTitle = 'Nomination Under Committee Review';
    statusBg = '#fffbeb';
    statusBadge = '<span style="background: #fef3c7; color: #92400e; font-weight: 800; padding: 4px 12px; border-radius: 8px; font-size: 12px;">UNDER REVIEW</span>';
  } else {
    statusTitle = 'Nomination Review Update';
    statusBg = '#fff1f2';
    statusBadge = `<span style="background: #ffe4e6; color: #9f1239; font-weight: 800; padding: 4px 12px; border-radius: 8px; font-size: 12px;">${status}</span>`;
  }

  const html = `
    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; box-shadow: 0 10px 25px rgba(0,0,0,0.05); overflow: hidden;">
      ${emailHeader(statusTitle)}
      <div style="padding: 32px 28px; color: #1e293b; line-height: 1.6;">
        <h2 style="font-size: 18px; font-weight: 800; color: #0f172a; margin-top: 0;">Dear ${name || 'Colleague'},</h2>
        <p style="font-size: 14px; color: #475569;">
          The African Scholar Review Committee has reviewed your application for <strong>${awardTitle}</strong>.
        </p>

        <div style="background: ${statusBg}; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center;">
          <div style="margin-bottom: 10px;">${statusBadge}</div>
          <div style="font-size: 12px; color: #64748b;">Award Tier: <strong>${tier}</strong></div>
        </div>

        ${adminComments ? `
          <div style="background: #f8fafc; border-left: 4px solid #3b82f6; padding: 14px 18px; border-radius: 0 8px 8px 0; margin: 20px 0;">
            <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 4px;">Review Committee Remarks:</div>
            <div style="font-size: 13px; color: #1e293b; font-style: italic;">"${adminComments}"</div>
          </div>
        ` : ''}

        ${scoreDetails && scoreDetails.total_score ? `
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 18px; margin: 20px 0;">
            <div style="font-size: 12px; font-weight: 700; color: #0f172a;">Jury Evaluation Score: <strong>${scoreDetails.total_score} / 100 pts</strong></div>
          </div>
        ` : ''}

        <div style="text-align: center; margin: 28px 0;">
          <a href="${process.env.USER_CLIENT_URL || 'http://localhost:3000'}/dashboard" style="background: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-size: 13px; font-weight: 700; display: inline-block;">
            View Detailed Evaluation →
          </a>
        </div>
      </div>
      ${emailFooter()}
    </div>
  `;

  return sendMail({
    to: email,
    subject: `[African Scholar Review Verdict] ${awardTitle}: ${status}`,
    html
  });
};

exports.sendLaureateAwardEmail = async ({ email, name, awardTitle, tier, prizeAmount, citation, certificateCode }) => {
  const html = `
    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 2px solid #fbbf24; border-radius: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; box-shadow: 0 15px 35px rgba(245, 158, 11, 0.15); overflow: hidden;">
      <div style="background: linear-gradient(135deg, #78350f 0%, #b45309 50%, #d97706 100%); padding: 40px 28px; text-align: center; color: #ffffff;">
        <div style="display: inline-block; background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.3); padding: 6px 18px; border-radius: 999px; margin-bottom: 12px;">
          <span style="color: #fef3c7; font-size: 11px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase;">★ OFFICIAL LAUREATE DECLARATION ★</span>
        </div>
        <h1 style="font-size: 26px; font-weight: 900; margin: 0; letter-spacing: -0.5px;">Congratulations, Laureate!</h1>
        <p style="font-size: 14px; color: #fef3c7; margin: 8px 0 0;">Official Laureate of the Year 2026</p>
      </div>

      <div style="padding: 32px 28px; color: #1e293b; line-height: 1.6;">
        <h2 style="font-size: 20px; font-weight: 900; color: #0f172a; margin-top: 0; text-align: center;">${name}</h2>
        <p style="font-size: 14px; text-align: center; color: #475569; margin-bottom: 24px;">
          The Board of Trustees and Academic Review Directorate of <strong>African Scholar</strong> are profoundly honored to declare you as the Winner of:
        </p>

        <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 14px; padding: 22px; margin: 20px 0; text-align: center;">
          <div style="font-size: 11px; font-weight: 800; color: #b45309; text-transform: uppercase; letter-spacing: 1px;">Conferred Award</div>
          <div style="font-size: 19px; font-weight: 900; color: #78350f; margin: 6px 0;">${awardTitle}</div>
          <div style="display: inline-block; background: #fef3c7; color: #92400e; font-weight: 800; padding: 3px 10px; border-radius: 6px; font-size: 11px; margin-top: 4px;">
            ${tier} Tier Laureate
          </div>
          ${prizeAmount ? `
            <div style="margin-top: 14px; font-size: 22px; font-weight: 900; color: #d97706;">
              ${prizeAmount} <span style="font-size: 12px; color: #166534; font-weight: 700;">Prize Conferred</span>
            </div>
          ` : ''}
        </div>

        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin: 24px 0;">
          <div style="font-size: 11px; font-weight: 700; color: #b45309; text-transform: uppercase; margin-bottom: 6px;">Executive Conferred Citation:</div>
          <p style="font-size: 13px; color: #334155; font-style: italic; margin: 0; line-height: 1.6;">
            "${citation || 'Selected in recognition of pioneering academic contributions, continental research leadership, and profound human capacity building across Africa.'}"
          </p>
        </div>

        <div style="border-top: 1px dashed #cbd5e1; padding-top: 16px; margin-top: 24px; text-align: center; font-size: 12px; color: #64748b;">
          Certificate Verification Code: <strong style="color: #0f172a; font-family: monospace; font-size: 13px;">${certificateCode || 'AS-2026-LAUR'}</strong>
        </div>

        <div style="text-align: center; margin: 28px 0;">
          <a href="${process.env.USER_CLIENT_URL || 'http://localhost:3000'}/awards/winners" style="background: linear-gradient(to right, #d97706, #b45309); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-size: 13px; font-weight: 800; display: inline-block; box-shadow: 0 4px 12px rgba(180, 83, 9, 0.3);">
            View Laureate Registry & Download Certificate →
          </a>
        </div>
      </div>
      ${emailFooter()}
    </div>
  `;

  return sendMail({
    to: email,
    subject: `★ Official Laureate Announcement ★: ${awardTitle} — African Scholar 2026`,
    html
  });
};

exports.sendRefereeInvitationEmail = async ({
  refereeEmail,
  refereeName,
  candidateName,
  candidateInstitution,
  awardTitle,
  endorsementUrl
}) => {
  const html = `
    <div style="max-width: 600px; margin: 0 auto; font-family: 'Segoe UI', Arial, sans-serif; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
      ${emailHeader('Confidential Peer Endorsement Request')}
      <div style="padding: 32px 28px; color: #1e293b;">
        <p style="font-size: 15px; line-height: 1.6; margin-top: 0;">
          Dear <strong>${refereeName || 'Distinguished Scholar'}</strong>,
        </p>
        <p style="font-size: 14px; line-height: 1.6; color: #475569;">
          You have been nominated by <strong>${candidateName}</strong> as a confidential academic referee for the <strong>${awardTitle || 'African Scholar Continental Honors'}</strong>.
        </p>

        <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 12px; padding: 20px; margin: 24px 0;">
          <div style="font-size: 11px; font-weight: 800; color: #1e3a8a; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Candidate Nomination Dossier:</div>
          <div style="font-size: 15px; font-weight: 700; color: #0f172a;">${candidateName}</div>
          <div style="font-size: 13px; color: #64748b; margin-top: 4px;">${candidateInstitution || 'African Academic Institution'}</div>
          <div style="font-size: 13px; color: #2563eb; font-weight: 600; margin-top: 8px;">Award: ${awardTitle}</div>
        </div>

        <p style="font-size: 13px; color: #64748b; line-height: 1.6;">
          Your expert evaluation provides the Continental Academic Jury with vital insight regarding the candidate's scientific rigor, originality, and leadership impact across Africa. All submissions are treated in strict confidence.
        </p>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${endorsementUrl}" style="background: #1e3a8a; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-size: 14px; font-weight: 700; display: inline-block; box-shadow: 0 4px 14px rgba(30, 58, 138, 0.3);">
            Access Confidential Endorsement Portal →
          </a>
        </div>

        <p style="font-size: 12px; color: #94a3b8; text-align: center; margin-bottom: 0;">
          No account registration is required. You may directly complete the evaluation or upload a letterhead recommendation.
        </p>
      </div>
      ${emailFooter()}
    </div>
  `;

  return sendMail({
    to: refereeEmail,
    subject: `Confidential Academic Endorsement Request: ${candidateName} — African Scholar 2026`,
    html
  });
};

