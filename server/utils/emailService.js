const nodemailer = require('nodemailer');
const {
  getWelcomeEmail,
  getOTPEmail,
  getRecruiterNotificationEmail,
  getCandidateConfirmationEmail,
  getStatusUpdateEmail,
  getInterviewScheduledEmail,
  getInterviewUpdatedEmail,
  getInterviewCancelledEmail,
  getHiringDecisionEmail
} = require('./emailTemplates');

// Lazy initialize transporter to prevent crashes if credentials are temporarily missing during app boot
let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('WARNING: EMAIL_USER or EMAIL_PASS environment variables are missing. Outgoing emails will fail.');
      return null;
    }
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }
  return transporter;
};

/**
 * Generic email delivery helper
 */
const deliverMail = async (to, subject, htmlContent) => {
  try {
    const client = getTransporter();
    if (!client) {
      console.warn(`Email skipped (unconfigured SMTP credentials) to: ${to}`);
      return false;
    }

    const mailOptions = {
      from: `"HireNova" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlContent
    };

    const info = await client.sendMail(mailOptions);
    console.log(`Email delivered to ${to}. Message ID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`Email delivery failure to ${to} (Subject: "${subject}"):`, error);
    return false; // Suppress error to avoid breaking application workflow
  }
};

/**
 * Welcome Email Trigger
 */
const sendWelcomeEmail = async (toEmail, userName) => {
  const html = getWelcomeEmail(userName);
  return await deliverMail(toEmail, 'Welcome to HireNova', html);
};

/**
 * OTP Verification Code Trigger
 */
const sendOTPEmail = async (toEmail, otp) => {
  const html = getOTPEmail(otp);
  return await deliverMail(toEmail, 'Your HireNova Verification Code', html);
};

/**
 * Recruiter Application Notification Trigger
 */
const sendRecruiterNotification = async (recruiterEmail, recruiterName, candidateName, candidateEmail, jobTitle, date) => {
  const html = getRecruiterNotificationEmail(recruiterName, candidateName, candidateEmail, jobTitle, date);
  return await deliverMail(recruiterEmail, 'New Application Received', html);
};

/**
 * Candidate Application Confirmation Trigger
 */
const sendCandidateConfirmation = async (candidateEmail, candidateName, jobTitle, company, date) => {
  const html = getCandidateConfirmationEmail(candidateName, jobTitle, company, date);
  return await deliverMail(candidateEmail, 'Application Submitted Successfully', html);
};

/**
 * Candidate Status Update Email Trigger
 */
const sendStatusUpdateEmail = async (candidateEmail, candidateName, jobTitle, company, previousStatus, newStatus, date) => {
  const html = getStatusUpdateEmail(candidateName, jobTitle, company, previousStatus, newStatus, date);
  return await deliverMail(candidateEmail, 'Application Status Updated', html);
};

/**
 * Interview Scheduled Email Trigger
 */
const sendInterviewScheduledEmail = async (toEmail, candidateName, jobTitle, company, date, time, mode, meetingLink, remarks) => {
  const html = getInterviewScheduledEmail(candidateName, jobTitle, company, date, time, mode, meetingLink, remarks);
  return await deliverMail(toEmail, 'Interview Scheduled - HireNova', html);
};

/**
 * Interview Updated Email Trigger
 */
const sendInterviewUpdatedEmail = async (toEmail, candidateName, jobTitle, company, date, time, mode, meetingLink, remarks) => {
  const html = getInterviewUpdatedEmail(candidateName, jobTitle, company, date, time, mode, meetingLink, remarks);
  return await deliverMail(toEmail, 'Interview Schedule Updated - HireNova', html);
};

/**
 * Interview Cancelled Email Trigger
 */
const sendInterviewCancelledEmail = async (toEmail, candidateName, jobTitle, company) => {
  const html = getInterviewCancelledEmail(candidateName, jobTitle, company);
  return await deliverMail(toEmail, 'Interview Cancelled - HireNova', html);
};

/**
 * Hiring Decision Email Trigger
 */
const sendHiringDecisionEmail = async (toEmail, candidateName, jobTitle, company, decision) => {
  const html = getHiringDecisionEmail(candidateName, jobTitle, company, decision);
  const subject = decision.toLowerCase() === 'hired' ? 'Job Offer - HireNova' : 'Application Update - HireNova';
  return await deliverMail(toEmail, subject, html);
};

module.exports = {
  sendWelcomeEmail,
  sendOTPEmail,
  sendRecruiterNotification,
  sendCandidateConfirmation,
  sendStatusUpdateEmail,
  sendInterviewScheduledEmail,
  sendInterviewUpdatedEmail,
  sendInterviewCancelledEmail,
  sendHiringDecisionEmail
};
