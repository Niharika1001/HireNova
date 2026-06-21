# HireNova – Talent Platform & Recruiter ATS

HireNova is a full-stack Talent Platform and Recruiter ATS built using React, Node.js, Express.js, MongoDB, JWT Authentication, OTP Verification, Email Notifications, Application Tracking, Interview Scheduling, Recruiter Notes, Analytics Dashboards, and Role-Based Access Control.

Designed to replicate high-end recruitment SaaS platforms like Linear and Stripe, HireNova bridges the gap between hiring managers and applicants by replacing typical form-based systems with a comprehensive, data-dense workspace, live recruitment analytics, a modern dark/light glassmorphic visual experience, and a structured hiring workflow.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Hiring Pipeline & Job Lifecycle](#hiring-pipeline--job-lifecycle)
- [Tech Stack](#tech-stack)
- [Database Documentation](#database-documentation)
- [API Documentation](#api-documentation)
- [Installation & Setup](#installation--setup)
- [Authorization Route Access Matrix](#authorization-route-access-matrix)

---

## Project Overview

HireNova transforms traditional candidate applications into an interactive, automated Applicant Tracking System (ATS). Recruiters can manage job lifecycles, monitor applications via advanced multi-variable search and filters, write confidential notes, schedule multi-mode interviews, track recruiter logs in a recent activity feed, bulk transition candidates, and export reports to CSV. Candidates can search and apply to jobs, track their submission timelines, and save jobs to their dashboard.

---

## Key Features

### 🔐 Authentication & Security
* **Dual Role Onboarding**: Dedicated signup and role-specific workspace flows for Recruiters and Candidates.
* **JWT Session Persistence**: Secure, token-based session management stored locally.
* **OTP Verification**: Multi-step registration and login verification using one-time password security tokens.
* **Role-Based Route Guards**: Enforced permissions at both the React frontend routing and backend middleware layers.
* **Cryptographic Hashing**: Secure password encryption utilizing `bcryptjs` hashing.

### 💼 Recruiter ATS Workflows
* **Advanced Applicant Management**: View Candidate Name, Email, Phone, Resume, Applied Date, and Pipeline Status for every job posting. Multi-variable search (case-insensitive name/email search) and status filters.
* **Recruiter Notes**: Write, edit, and delete confidential candidate evaluations visible only to recruiting staff.
* **Interview Scheduling**: Schedule, update, and cancel Online (adds video link) or Offline interviews. Sends customized email notifications to candidates.
* **Recent Activity Feed**: Tracks recruiter dashboard logs (Create Job, Archive Job, Reopen Job, Status Updated, Interview Scheduled, Interview Cancelled, Candidate Hired, Candidate Rejected) showing the latest 10 events.
* **Bulk Candidate Actions**: Select multiple applicants and transition their statuses simultaneously.
* **CSV Applicant Export**: Export candidate databases (Name, Email, Phone, Status, Applied Date) as CSV reports.

### 🧑‍💻 Candidate Workspace Workflows
* **Adaptive Search**: Query job listings by keyword, location, and employment type concurrently.
* **Interactive Job Details**: Detail views with floating action panels and instant apply modal options.
* **Application History**: Track submission timelines and current statuses in real-time.
* **Saved Jobs**: Bookmark job listings to a personal saved jobs checklist.
* **Profile Settings**: Maintain personal details, skills, and links with Base64 profile picture uploads.

### 📊 Recruiting Analytics & Visualizations
* **Recruiter Analytics Dashboard**: Tracks metrics (Total, Active, and Closed Job counts) along with Candidate pipelines (Shortlisted, Hired, and Rejected counts).
* **Top Performing Job Metric**: Identifies and highlights the job posting with the highest applicant traffic.
* **Hiring Conversion Funnel**: Fully integrated Recharts vertical bar chart displaying conversion throughput across applicant pipeline stages.

### ✉️ Email Notifications System
* **Nodemailer Integrations**: Automated dispatch of Interview Scheduled, Interview Updated, Interview Cancelled, and Hiring Decision (Hired/Rejected) notifications.

### 🎨 Premium UI/UX Styling
* **Theme Customization**: Responsive toggling between Dark Glassmorphic (glow states, translucent borders) and Light (high-contrast elevation) themes.
* **Compact Density Layout**: Professional 13px base styling layout.
* **Loading Skeletons**: Fluid placeholder animations replacing traditional spinners during async network operations.
* **Collapsible Navigation**: Collapsible sidebar navigation for desktops and bottom-tab navigation for mobile screens.

---

## Hiring Pipeline & Job Lifecycle

### Candidate Pipeline
Candidates progress linearly through a MongoDB status enum state machine:
```text
Applied ➔ Under Review ➔ Shortlisted ➔ Interview Scheduled ➔ Hired OR Rejected
```

### Job Status Workflow
Jobs are soft-deleted to preserve historical tracking metrics and dashboard records:
```text
Open ➔ Closed ➔ Reopen ➔ Open (Soft-Archived = Deleted)
```

---

## Tech Stack

* **Frontend**: React (v19), React Router DOM (v7), Axios, Context API, Vanilla CSS (Glassmorphism), Recharts (data visualization).
* **Backend**: Node.js, Express.js, MongoDB (NoSQL), Mongoose (ODM), Nodemailer (email services), JWT, bcryptjs.

---

## Database Documentation

### 1. User
Represents users, credentials, and access roles:
* `name` (String, Required): Full display name.
* `email` (String, Required, Unique): Primary authentication identifier.
* `password` (String, Required): bcrypt hashed secret.
* `role` (String, Required, Enum): Options: `['Recruiter', 'Candidate']`.
* `createdAt` (Date): Account creation timestamp.

### 2. Job
Represents postings created by Recruiters:
* `title` (String, Required): Title of position.
* `company` (String, Required): Target company.
* `location` (String, Required): Geographic location or remote.
* `salary` (Number, Required): USD annual salary.
* `jobType` (String, Required, Enum): Options: `['Full-Time', 'Part-Time', 'Contract', 'Internship', 'Remote']`.
* `skills` (Array of Strings): Required skills.
* `description` (String, Required): Job description.
* `status` (String, Required, Enum): Options: `['Open', 'Closed', 'Reopen', 'Deleted']`.
* `recruiterId` (ObjectId, ref: 'User'): Creator reference.

### 3. Application
Represents candidate applications submitted for job postings:
* `fullName` / `email` / `phone` (String, Required): Contact parameters.
* `resumeLink` (String, Required): Resume URL.
* `coverLetter` (String): Additional context.
* `status` (String, Required, Enum): Options: `['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Rejected', 'Hired']`.
* `jobId` (ObjectId, ref: 'Job'): Reference to associated job.
* `candidateId` (ObjectId, ref: 'User'): Applicant reference.

### 4. SavedJob
Candidate bookmarks mapping:
* `candidateId` (ObjectId, ref: 'User'): Bookmark owner.
* `jobId` (ObjectId, ref: 'Job'): Bookmarked position.

### 5. Interview
Represents candidate interview details scheduled by recruiters:
* `applicationId` (ObjectId, ref: 'Application'): Reference to application.
* `date` (String, Required): Date of interview (e.g. `2026-06-25`).
* `time` (String, Required): Time of interview (e.g. `14:00`).
* `mode` (String, Required, Enum): Options: `['Online', 'Offline']`.
* `meetingLink` (String): Virtual video meeting link.
* `remarks` (String): Interview preparation notes or agenda.
* `createdAt` (Date): Creation timestamp.

### 6. RecruiterNote
Confidential recruiting feedback tags linked to applications:
* `applicationId` (ObjectId, ref: 'Application'): Reference to application.
* `recruiterId` (ObjectId, ref: 'User'): Note creator reference.
* `note` (String, Required): Notes content.
* `createdAt` / `updatedAt` (Date): Timestamps.

### 7. ActivityLog
Recruiting events displayed on the dashboard feed:
* `recruiterId` (ObjectId, ref: 'User'): Event initiator reference.
* `message` (String, Required): Event description (e.g. `Created Frontend Developer Job`).
* `timestamp` (Date): Creation timestamp.

### 8. OTP
Temporary OTP tokens used for email verification:
* `email` (String, Required): Recipient email.
* `otp` (String, Required): Cryptographic security token.
* `createdAt` (Date): Creation timestamp (exipres after 5 minutes).

---

## API Documentation

### Authentication
* `POST /api/auth/register` - Register a new account.
* `POST /api/auth/login` - Authenticate credentials and send OTP.
* `POST /api/auth/verify-otp` - Verify OTP token and return JWT.

### Jobs
* `GET /api/jobs` - Query postings (supports keyword search, filters, location).
* `GET /api/jobs/:id` - Retrieve details of a job.
* `POST /api/jobs` - Post a new job (Recruiter only).
* `PUT /api/jobs/:id` - Edit a job (Recruiter only).
* `DELETE /api/jobs/:id` - Archive (soft-delete) a job (Recruiter only).

### Applications
* `GET /api/applications` - Get applications (Recruiter: filters by Job, status, search. Candidate: view personal history).
* `POST /api/applications` - Submit job application (Candidate only).
* `PUT /api/applications/:id/status` - Transition applicant status (Recruiter only).
* `DELETE /api/applications/:id` - Delete application (Recruiter only).

### Saved Jobs
* `GET /api/saved-jobs` - View bookmarks (Candidate only).
* `POST /api/saved-jobs` - Bookmark a job (Candidate only).
* `DELETE /api/saved-jobs/:jobId` - Remove bookmark (Candidate only).

### Profile
* `GET /api/profile` - Retrieve current profile configurations.
* `PUT /api/profile` - Update settings.

### Notes APIs (Recruiter only)
* `POST /api/notes` - Create note. Body: `{ applicationId, note }`.
* `GET /api/notes/:applicationId` - Fetch notes for a candidate.
* `PUT /api/notes/:id` - Edit note. Body: `{ note }`.
* `DELETE /api/notes/:id` - Delete note.

### Interview APIs (Recruiter only)
* `POST /api/interviews` - Schedule an interview. Body: `{ applicationId, date, time, mode, meetingLink, remarks }`.
* `GET /api/interviews/:applicationId` - Fetch candidate's interview record.
* `PUT /api/interviews/:id` - Reschedule/edit interview. Body: `{ date, time, mode, meetingLink, remarks }`.
* `DELETE /api/interviews/cancel/:id` - Cancel and delete interview.

### Activity APIs (Recruiter only)
* `GET /api/activities` - Fetch latest 10 recruiter activity logs.

### Export APIs (Recruiter only)
* `GET /api/applications/export` - Export applicant CSV report. Query parameter: `?jobId=...`.

### Bulk Action APIs (Recruiter only)
* `POST /api/applications/bulk-status` - Bulk transition multiple applications. Body: `{ ids: [...], status: '...' }`.

---

## Installation & Setup

### 1. Setup Server
```bash
cd server
npm install
npm run dev
```

### 2. Setup Client
```bash
cd client
npm install
npm run dev
```

---

## Authorization Route Access Matrix

| User Role | Guest | Candidate | Recruiter |
| :--- | :---: | :---: | :---: |
| **Landing (`/`)** | View | View | View |
| **Login / Signup** | Access | Redirect | Redirect |
| **Job Search Board** | View | View | View |
| **Job Details** | View | View | View |
| **Apply to Job** | Redirect | Apply | Forbidden |
| **Bookmarks / Saved** | Redirect | Full Access | Forbidden |
| **Applications Grid** | Redirect | View Status | Full ATS Access |
| **Recruiter Dashboard** | Redirect | Forbidden | Full Access |
| **Recruiter Analytics** | Redirect | Forbidden | Full Access |
| **Candidate Notes** | Redirect | Forbidden | Read/Write |
| **Candidate Interviews**| Redirect | Forbidden | Read/Write |
| **Activity Feed** | Redirect | Forbidden | View |
| **CSV Export** | Redirect | Forbidden | Export |
| **Bulk Actions** | Redirect | Forbidden | Execute |
