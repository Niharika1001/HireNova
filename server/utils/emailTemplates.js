/**
 * HireNova Email Templates
 * Premium light-mode HTML templates for transactional emails.
 */

const getCommonLayout = (title, contentHtml, ctaText = '', ctaLink = '', accentColor = '#8B5CF6') => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #F8FAFC;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #0F172A;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    .wrapper {
      width: 100%;
      background-color: #F8FAFC;
      padding: 40px 0;
    }
    .container {
      max-width: 580px;
      margin: 0 auto;
      padding: 0 20px;
    }
    .header-bar {
      height: 6px;
      background: linear-gradient(90deg, #00D4FF 0%, ${accentColor} 100%);
      border-top-left-radius: 12px;
      border-top-right-radius: 12px;
    }
    .card {
      background-color: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-top: none;
      border-bottom-left-radius: 12px;
      border-bottom-right-radius: 12px;
      padding: 40px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
    }
    .logo-container {
      margin-bottom: 30px;
    }
    .logo-badge {
      background: linear-gradient(135deg, #00D4FF 0%, #8B5CF6 100%);
      width: 28px;
      height: 28px;
      border-radius: 6px;
      display: inline-block;
      text-align: center;
      line-height: 28px;
      color: #FFFFFF;
      font-weight: 800;
      font-size: 16px;
      margin-right: 8px;
    }
    .logo-text {
      font-size: 18px;
      font-weight: 800;
      color: #0F172A;
      display: inline-block;
      vertical-align: middle;
    }
    .logo-highlight {
      color: #00D4FF;
    }
    .h1 {
      font-size: 22px;
      font-weight: 800;
      line-height: 1.3;
      margin-top: 0;
      margin-bottom: 20px;
      color: #0F172A;
    }
    .paragraph {
      font-size: 15px;
      line-height: 1.6;
      margin-top: 0;
      margin-bottom: 20px;
      color: #64748B;
    }
    .btn-container {
      margin-top: 30px;
      margin-bottom: 10px;
    }
    .btn {
      display: inline-block;
      background-color: ${accentColor};
      color: #FFFFFF !important;
      font-weight: 600;
      font-size: 14px;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 8px;
      text-align: center;
      box-shadow: 0 4px 12px rgba(139, 92, 246, 0.15);
    }
    .footer {
      margin-top: 30px;
      text-align: center;
      font-size: 12px;
      color: #64748B;
      line-height: 1.5;
    }
    .footer a {
      color: #8B5CF6;
      text-decoration: none;
    }
    .table-container {
      background-color: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 8px;
      padding: 16px;
      margin: 24px 0;
    }
    .info-table {
      width: 100%;
      border-collapse: collapse;
    }
    .info-table td {
      padding: 6px 0;
      font-size: 14px;
      vertical-align: top;
    }
    .info-label {
      color: #64748B;
      font-weight: 600;
      width: 35%;
    }
    .info-value {
      color: #0F172A;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header-bar"></div>
      <div class="card">
        <div class="logo-container">
          <div class="logo-badge">H</div>
          <span class="logo-text">Hire<span class="logo-highlight">Nova</span></span>
        </div>
        ${contentHtml}
        ${ctaText && ctaLink ? `
        <div class="btn-container">
          <!--[if mso]>
          <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${ctaLink}" style="height:44px;v-text-anchor:middle;width:200px;" arcsize="18%" stroke="f" fillcolor="${accentColor}">
            <w:anchorlock/>
            <center style="color:#ffffff;font-family:sans-serif;font-size:14px;font-weight:bold;">${ctaText}</center>
          </v:roundrect>
          <![endif]-->
          <a href="${ctaLink}" class="btn" target="_blank" style="background-color: ${accentColor}; color: #ffffff;">${ctaText}</a>
        </div>` : ''}
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} HireNova. All rights reserved.<br>
        This is an automated notification. Please do not reply directly to this email.<br>
        Explore careers on <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}" target="_blank">HireNova</a>.
      </div>
    </div>
  </div>
</body>
</html>
  `;
};

const getWelcomeEmail = (name) => {
  const content = `
    <h1 class="h1">Welcome to HireNova</h1>
    <p class="paragraph">Hello <strong>${name}</strong>,</p>
    <p class="paragraph">Thank you for joining HireNova.</p>
    <p class="paragraph">Your account has been successfully created.</p>
    <p class="paragraph">You can now explore opportunities, apply for jobs, and manage your career journey through HireNova.</p>
  `;
  const loginLink = `${process.env.CLIENT_URL || 'http://localhost:5173'}/login`;
  return getCommonLayout('Welcome to HireNova', content, 'Sign In', loginLink, '#00D4FF'); // Primary Accent
};

const getOTPEmail = (otp) => {
  const content = `
    <h1 class="h1">Your HireNova Verification Code</h1>
    <p class="paragraph">Your verification code is:</p>
    <div style="background-color: #FFFFFF; border: 1.5px solid #8B5CF6; border-radius: 12px; padding: 24px; text-align: center; margin: 25px 0; box-shadow: 0 4px 12px rgba(139, 92, 246, 0.05);">
      <span style="font-family: -apple-system, BlinkMacSystemFont, monospace; font-size: 38px; font-weight: 800; letter-spacing: 8px; color: #8B5CF6; display: block; margin: 0 auto; user-select: all;">${otp}</span>
    </div>
    <p class="paragraph">This code expires in 5 minutes.</p>
    <p class="paragraph" style="font-size: 13px; color: #64748B; margin-top: 24px;">If you did not request this login, ignore this email.</p>
  `;
  return getCommonLayout('Your HireNova Verification Code', content, '', '', '#8B5CF6'); // Purple Accent
};

const getRecruiterNotificationEmail = (recruiterName, candidateName, candidateEmail, jobTitle, date) => {
  const content = `
    <h1 class="h1">New Application Received</h1>
    <p class="paragraph">Hello <strong>${recruiterName}</strong>,</p>
    <p class="paragraph">A candidate has submitted a new application for your posting.</p>
    <div class="table-container">
      <table class="info-table">
        <tr>
          <td class="info-label">Candidate Name</td>
          <td class="info-value">${candidateName}</td>
        </tr>
        <tr>
          <td class="info-label">Candidate Email</td>
          <td class="info-value"><a href="mailto:${candidateEmail}" style="color: #8B5CF6; text-decoration: none;">${candidateEmail}</a></td>
        </tr>
        <tr>
          <td class="info-label">Job Title</td>
          <td class="info-value">${jobTitle}</td>
        </tr>
        <tr>
          <td class="info-label">Application Date</td>
          <td class="info-value">${date}</td>
        </tr>
      </table>
    </div>
  `;
  const viewLink = `${process.env.CLIENT_URL || 'http://localhost:5173'}/applications`;
  return getCommonLayout('New Application Received', content, 'View Applications', viewLink, '#8B5CF6');
};

const getCandidateConfirmationEmail = (candidateName, jobTitle, company, date) => {
  const content = `
    <h1 class="h1">Application Submitted Successfully</h1>
    <p class="paragraph">Hello <strong>${candidateName}</strong>,</p>
    <p class="paragraph">Thank you for applying. Your application was successfully submitted.</p>
    <div class="table-container">
      <table class="info-table">
        <tr>
          <td class="info-label">Job Title</td>
          <td class="info-value"><strong>${jobTitle}</strong></td>
        </tr>
        <tr>
          <td class="info-label">Company</td>
          <td class="info-value">${company}</td>
        </tr>
        <tr>
          <td class="info-label">Application Date</td>
          <td class="info-value">${date}</td>
        </tr>
        <tr>
          <td class="info-label">Current Status</td>
          <td class="info-value"><span style="color: #00D4FF; font-weight: 700;">Applied</span></td>
        </tr>
      </table>
    </div>
  `;
  const viewLink = `${process.env.CLIENT_URL || 'http://localhost:5173'}/my-applications`;
  return getCommonLayout('Application Submitted Successfully', content, 'View My Applications', viewLink, '#00D4FF');
};

const getStatusUpdateEmail = (candidateName, jobTitle, company, previousStatus, newStatus, date) => {
  let accentColor = '#8B5CF6'; // Default Purple Accent
  let bannerHtml = '';
  let messageHtml = '';
  let ctaText = 'View Application';
  let ctaLink = `${process.env.CLIENT_URL || 'http://localhost:5173'}/my-applications`;

  // Determine styles and messages based on newStatus
  if (newStatus === 'Under Review' || newStatus === 'Reviewed') {
    accentColor = '#8B5CF6'; // Purple Accent
    messageHtml = `<p class="paragraph">Your application is currently being reviewed by the hiring team.</p>`;
  } else if (newStatus === 'Interview Scheduled') {
    accentColor = '#F59E0B'; // Orange Accent (Warning)
    messageHtml = `<p class="paragraph">Great news! An interview has been scheduled for your application. The hiring team will be in touch with you shortly.</p>`;
  } else if (newStatus === 'Selected') {
    accentColor = '#22C55E'; // Green Accent (Success)
    bannerHtml = `
      <div style="background-color: rgba(34, 197, 94, 0.08); border: 1px solid rgba(34, 197, 94, 0.2); border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 24px;">
        <h2 style="margin: 0; color: #22C55E; font-size: 20px; font-weight: 800;">🎉 Congratulations!</h2>
      </div>
    `;
    messageHtml = `
      <p class="paragraph"><strong>Congratulations!</strong></p>
      <p class="paragraph">You have successfully progressed to the next stage of the hiring process.</p>
    `;
  } else if (newStatus === 'Rejected') {
    accentColor = '#64748B'; // Neutral Accent (Secondary Text)
    messageHtml = `
      <p class="paragraph">Thank you for your interest in this opportunity.</p>
      <p class="paragraph">Although this application was not selected, we encourage you to continue exploring opportunities on HireNova.</p>
    `;
    ctaText = 'Browse Jobs';
    ctaLink = `${process.env.CLIENT_URL || 'http://localhost:5173'}/jobs`;
  } else {
    // General Status
    accentColor = '#00D4FF';
    messageHtml = `<p class="paragraph">The status of your application has been updated to <strong>${newStatus}</strong>.</p>`;
  }

  // Handle standardizing display label of "Reviewed" -> "Under Review"
  const formattedPrevStatus = previousStatus === 'Reviewed' ? 'Under Review' : previousStatus;
  const formattedNewStatus = newStatus === 'Reviewed' ? 'Under Review' : newStatus;

  const content = `
    <h1 class="h1">Application Status Updated</h1>
    <p class="paragraph">Hello <strong>${candidateName}</strong>,</p>
    ${bannerHtml}
    ${messageHtml}
    <div class="table-container">
      <table class="info-table">
        <tr>
          <td class="info-label">Job Title</td>
          <td class="info-value"><strong>${jobTitle}</strong></td>
        </tr>
        <tr>
          <td class="info-label">Company</td>
          <td class="info-value">${company}</td>
        </tr>
        <tr>
          <td class="info-label">Previous Status</td>
          <td class="info-value" style="text-decoration: line-through; color: #64748B;">${formattedPrevStatus}</td>
        </tr>
        <tr>
          <td class="info-label">New Status</td>
          <td class="info-value"><span style="color: ${accentColor}; font-weight: 700;">${formattedNewStatus}</span></td>
        </tr>
        <tr>
          <td class="info-label">Updated Date</td>
          <td class="info-value">${date}</td>
        </tr>
      </table>
    </div>
  `;

  return getCommonLayout('Application Status Updated', content, ctaText, ctaLink, accentColor);
};

const getInterviewScheduledEmail = (candidateName, jobTitle, company, date, time, mode, meetingLink, remarks) => {
  const content = `
    <h1 class="h1">Interview Scheduled</h1>
    <p class="paragraph">Hello <strong>${candidateName}</strong>,</p>
    <p class="paragraph">An interview has been scheduled for your application for the <strong>${jobTitle}</strong> position at <strong>${company}</strong>.</p>
    <div class="table-container">
      <table class="info-table">
        <tr>
          <td class="info-label">Date</td>
          <td class="info-value"><strong>${date}</strong></td>
        </tr>
        <tr>
          <td class="info-label">Time</td>
          <td class="info-value">${time}</td>
        </tr>
        <tr>
          <td class="info-label">Mode</td>
          <td class="info-value"><span style="color: #F59E0B; font-weight: 700;">${mode}</span></td>
        </tr>
        ${meetingLink ? `
        <tr>
          <td class="info-label">Meeting Link</td>
          <td class="info-value"><a href="${meetingLink}" style="color: #8B5CF6; text-decoration: none;">${meetingLink}</a></td>
        </tr>` : ''}
        ${remarks ? `
        <tr>
          <td class="info-label">Remarks</td>
          <td class="info-value">${remarks}</td>
        </tr>` : ''}
      </table>
    </div>
  `;
  return getCommonLayout('Interview Scheduled', content, meetingLink ? 'Join Meeting' : 'View Application', meetingLink || `${process.env.CLIENT_URL || 'http://localhost:5173'}/my-applications`, '#F59E0B');
};

const getInterviewUpdatedEmail = (candidateName, jobTitle, company, date, time, mode, meetingLink, remarks) => {
  const content = `
    <h1 class="h1">Interview Schedule Updated</h1>
    <p class="paragraph">Hello <strong>${candidateName}</strong>,</p>
    <p class="paragraph">The schedule details for your <strong>${jobTitle}</strong> interview at <strong>${company}</strong> have been updated.</p>
    <div class="table-container">
      <table class="info-table">
        <tr>
          <td class="info-label">Date</td>
          <td class="info-value"><strong>${date}</strong></td>
        </tr>
        <tr>
          <td class="info-label">Time</td>
          <td class="info-value">${time}</td>
        </tr>
        <tr>
          <td class="info-label">Mode</td>
          <td class="info-value"><span style="color: #F59E0B; font-weight: 700;">${mode}</span></td>
        </tr>
        ${meetingLink ? `
        <tr>
          <td class="info-label">Meeting Link</td>
          <td class="info-value"><a href="${meetingLink}" style="color: #8B5CF6; text-decoration: none;">${meetingLink}</a></td>
        </tr>` : ''}
        ${remarks ? `
        <tr>
          <td class="info-label">Remarks</td>
          <td class="info-value">${remarks}</td>
        </tr>` : ''}
      </table>
    </div>
  `;
  return getCommonLayout('Interview Schedule Updated', content, meetingLink ? 'Join Meeting' : 'View Application', meetingLink || `${process.env.CLIENT_URL || 'http://localhost:5173'}/my-applications`, '#F59E0B');
};

const getInterviewCancelledEmail = (candidateName, jobTitle, company) => {
  const content = `
    <h1 class="h1" style="color: #EF4444;">Interview Cancelled</h1>
    <p class="paragraph">Hello <strong>${candidateName}</strong>,</p>
    <p class="paragraph">Please note that the interview scheduled for your application for the <strong>${jobTitle}</strong> position at <strong>${company}</strong> has been cancelled.</p>
    <p class="paragraph">The hiring team will contact you if they decide to reschedule or need further details.</p>
  `;
  return getCommonLayout('Interview Cancelled', content, 'Browse Jobs', `${process.env.CLIENT_URL || 'http://localhost:5173'}/jobs`, '#EF4444');
};

const getHiringDecisionEmail = (candidateName, jobTitle, company, decision) => {
  const isHired = decision.toLowerCase() === 'hired';
  const accentColor = isHired ? '#22C55E' : '#64748B';
  const title = isHired ? 'Congratulations! Job Offer' : 'Application Update';
  
  const content = isHired ? `
    <h1 class="h1" style="color: #22C55E;">🎉 Congratulations!</h1>
    <p class="paragraph">Hello <strong>${candidateName}</strong>,</p>
    <p class="paragraph">We are thrilled to inform you that you have been selected for the <strong>${jobTitle}</strong> position at <strong>${company}</strong>!</p>
    <p class="paragraph">The recruitment team will reach out to you shortly with the job offer details, contract documentation, and onboarding steps.</p>
  ` : `
    <h1 class="h1">Application Status Update</h1>
    <p class="paragraph">Hello <strong>${candidateName}</strong>,</p>
    <p class="paragraph">Thank you for taking the time to apply and interview for the <strong>${jobTitle}</strong> position at <strong>${company}</strong>.</p>
    <p class="paragraph">Unfortunately, after careful review, the hiring team has decided to proceed with other candidates at this time.</p>
    <p class="paragraph">We were impressed with your skills and will keep your profile in our database for future opportunities that match your background.</p>
  `;
  
  return getCommonLayout(title, content, isHired ? 'View Offer Details' : 'Browse Other Jobs', isHired ? `${process.env.CLIENT_URL || 'http://localhost:5173'}/my-applications` : `${process.env.CLIENT_URL || 'http://localhost:5173'}/jobs`, accentColor);
};

module.exports = {
  getWelcomeEmail,
  getOTPEmail,
  getRecruiterNotificationEmail,
  getCandidateConfirmationEmail,
  getStatusUpdateEmail,
  getInterviewScheduledEmail,
  getInterviewUpdatedEmail,
  getInterviewCancelledEmail,
  getHiringDecisionEmail
};
