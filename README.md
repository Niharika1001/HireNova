# HireNova – Talent Platform

HireNova is a production-grade Full Stack Job Portal and Talent Acquisition Platform. Built on a modern SaaS architecture, it connects Candidates and Recruiters through secure, role-based workflows, dynamic application pipelines, real-time recruiting analytics, and a premium visual experience featuring responsive Dark Glassmorphism and Light themes.

This repository is structured for portfolio evaluation, internship submissions, and recruiters.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
  - [Authentication & Security](#authentication--security)
  - [Recruiter Workflows](#recruiter-workflows)
  - [Candidate Workflows](#candidate-workflows)
- [Job Lifecycle & Soft Delete](#job-lifecycle--soft-delete)
- [Application Tracking Pipeline](#application-tracking-pipeline)
- [UI/UX System & Styling](#uiux-system--styling)
- [Tech Stack](#tech-stack)
- [Project Architecture](#project-architecture)
- [Database Models & Schemas](#database-models--schemas)
- [API Documentation](#api-documentation)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Authorization & Route Access Matrix](#authorization--route-access-matrix)
- [Screenshots & Placeholders](#screenshots--placeholders)
- [Learning Outcomes](#learning-outcomes)
- [Future Enhancements](#future-enhancements)
- [Conclusion](#conclusion)

---

## Project Overview

HireNova is designed to replicate high-end SaaS platforms such as Linear, Stripe, and Vercel. It bridges the gap between hiring managers and applicants by replacing typical form-based systems with:
* An interactive, dual-layout workspace dashboard.
* Fast, client-side state management for filters and pipeline tracking.
* Dynamic SVG metrics charts rendering real-time recruiting throughput.
* Clean, non-intrusive modal overlays for applications.
* Secure token-based session persistence.

---

## Features

### Authentication & Security
* **Dual Role Onboarding**: Separate signup pipelines for Recruiters and Candidates.
* **Token Auth**: Secure JWT (JsonWebToken) session management stored locally.
* **Cryptographic Hashing**: Secure password storage utilizing bcrypt hashing with salt rounds.
* **Protected Routes**: Client and server-side route guards enforcing role permissions.

### Recruiter Workflows
* **Metrics Dashboard**: At-a-glance view of open positions, closed status, applicant volume, and pipeline yields.
* **Job Board Operations**: Complete CRUD capabilities (Create, Read, Update, Soft-Archive) for job postings.
* **Applicant Pipeline Management**: Review candidate details, download resume links, and progress applications through status filters.
* **Analytics Engine**: SVG-generated charts tracking monthly application trends and hiring success metrics.
* **Recruiter Profile**: Maintain company name, website links, descriptions, and custom profile pictures.

### Candidate Workflows
* **Adaptive Search**: Query listings by keyword, location, and employment type concurrently.
* **Interactive Job Details**: Two-column layouts with floating details panels and instant apply modal options.
* **Application History**: Track submission statuses (Applied, Under Review, Interviewing, Selected, Rejected).
* **Saved Jobs**: Bookmark listings to a personal checklist, stored directly in MongoDB.
* **Candidate Profile**: Edit personal details, upload custom profile pictures (Base64), manage skills, and save resume links.

---

## Job Lifecycle & Soft Delete

To maintain system history and analytics, jobs are never permanently deleted from the database. Instead, HireNova implements a soft-delete protocol.

### Job Statuses
* `Open`: Listing is active and accepting candidate applications.
* `Closed`: Listing is suspended by the recruiter; no new applications are allowed.
* `Draft`: Job details are saved but not yet visible on public listing pages.
* `Deleted` (Archived): Job is hidden from search pages. All associated applicant histories are preserved for historical reporting.

---

## Application Tracking Pipeline

Applications move through a strict state machine on the backend:

1. `Applied` (Default) - Candidate submitted the application form.
2. `Reviewed` - Recruiter viewed details.
3. `Interview Scheduled` - Interview invitations dispatched.
4. `Selected` - Offer extended/hired.
5. `Rejected` - Application closed.

---

## UI/UX System & Styling

HireNova features a modern design language that toggles between two aesthetic palettes:

* **Dark Glassmorphism**: Translucent cards, subtle gradient borders (`rgba(0,212,255,0.08)`), glow active states, and custom dark-glass scrollbars.
* **Light Theme**: Clean, high-contrast white cards, soft slate typography (`#64748B`), and subtle elevation shadows.
* **Responsive Sidebar & Bottom Nav**: A collapsible desktop sidebar that transforms into a bottom tab-bar on mobile viewports.
* **Compact SaaS Density**: 13px baseline layout sizing providing data-dense, professional visual spaces.
* **Loading Skeletons**: Fluid animations replacing traditional spinners during async network operations.

---

## Tech Stack

### Frontend
* **React (v18)**: Component-driven UI.
* **React Router DOM**: Layout route matching.
* **Axios**: Promised-based API requests.
* **Context API**: Global state for Auth, Theme toggles, and Toast banners.
* **Vanilla CSS**: Premium dark-theme variables and layout grids.

### Backend
* **Node.js**: Asynchronous event-driven runtime.
* **Express.js**: Router server framework.
* **MongoDB**: Document-based NoSQL database.
* **Mongoose**: Object modeling schemas.
* **JWT & bcrypt**: Cryptographic security services.
* **cors & dotenv**: Environment configurations.

---

## Project Architecture

```text
HireNova/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/         # SVG icons & branding resources
│   │   ├── components/     # Reusable components (Sidebar, Navbar, Loader)
│   │   ├── context/        # State Providers (Auth, Theme, Toast)
│   │   ├── pages/          # Layout page views (Home, Profile, Analytics)
│   │   ├── services/       # Axios client-server networking (api.js)
│   │   ├── styles/         # Global stylesheets (index.css)
│   │   ├── App.jsx         # Layout wrappers & routing
│   │   └── main.jsx        # App mounting point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── server/
    ├── config/             # DB connection hooks (db.js)
    ├── controllers/        # Business logic controllers (jobController.js)
    ├── middleware/         # Security guards & global error handlers
    ├── models/             # Mongoose MongoDB models (Job.js, Profile.js)
    ├── routes/             # Express route mappings (authRoutes.js)
    ├── server.js           # Server initializer
    ├── package.json
    └── .env
```

---

## Database Models & Schemas

### 1. User
Represents authentication and credential mappings:
* `name` (String, Required): Full display name.
* `email` (String, Required, Unique): Email credentials.
* `password` (String, Required): bcrypt hashed passwords.
* `role` (String, Required, Enum): Options: `['Candidate', 'Recruiter']`.

### 2. Job
Represents postings created by Recruiters:
* `title` (String, Required): Position title.
* `company` (String, Required): Hiring company.
* `location` (String, Required): City, State, or remote status.
* `salary` (Number, Required): Annual USD compensation.
* `jobType` (String, Required, Enum): Options: `['Full-Time', 'Part-Time', 'Contract', 'Internship']`.
* `skills` (Array of Strings): Skill keywords.
* `description` (String, Required): Detailed job specification.
* `status` (String, Required, Enum): Options: `['Open', 'Closed', 'Draft', 'Deleted']`.
* `recruiterId` (ObjectId, ref: 'User'): Creator reference.

### 3. Application
Represents job applications submitted by Candidates:
* `fullName` / `email` / `phone` (String, Required): Contact parameters.
* `resumeLink` (String, Required): Clean URL (query parameters stripped).
* `coverLetter` (String): Candidate text block.
* `status` (String, Required, Enum): Options: `['Applied', 'Reviewed', 'Interview Scheduled', 'Selected', 'Rejected']`.
* `jobId` (ObjectId, ref: 'Job'): Reference to the listing.
* `candidateId` (ObjectId, ref: 'User'): Reference to the applicant.

### 4. SavedJob
Checklist mapping for candidates bookmarking jobs:
* `candidateId` (ObjectId, ref: 'User'): Candidate reference.
* `jobId` (ObjectId, ref: 'Job'): Job reference.
* `savedAt` (Date): Timestamp.

### 5. Profile
Extended profile metrics linked to User:
* `userId` (ObjectId, ref: 'User', Unique): Account owner.
* `phone` / `resumeLink` / `profilePicture` (String): Base64 profile images and candidate credentials.
* `skills` (Array of Strings): Skills tag collection.
* `companyName` / `companyWebsite` / `companyDescription` (String): Recruiter details.

---

## API Documentation

### Authentication
* `POST /api/auth/register` - Create new user account.
* `POST /api/auth/login` - Authenticate credentials, returns JWT.

### Jobs
* `GET /api/jobs` - Fetch visible listings (Open/Closed filter).
* `GET /api/jobs/:id` - Fetch details for a specific listing.
* `POST /api/jobs` - Create new job posting (Recruiter only).
* `PUT /api/jobs/:id` - Edit posting details (Recruiter only).
* `PATCH /api/jobs/:id/status` - Modify status (Recruiter only).

### Applications
* `GET /api/applications` - Fetch applicant history (Candidates see personal history, Recruiters see applicants for their jobs).
* `POST /api/applications` - Submit a job application (Candidate only).
* `PATCH /api/applications/:id/status` - Progress candidate pipeline (Recruiter only).

### Saved Jobs
* `GET /api/saved-jobs` - Retrieve candidate's bookmarked jobs (Candidate only).
* `POST /api/saved-jobs` - Save listing (Candidate only).
* `DELETE /api/saved-jobs/:jobId` - Remove bookmark (Candidate only).

### Profile
* `GET /api/profile` - Retrieve current profile configurations.
* `PUT /api/profile` - Update profile details and Base64 images.

---

## Installation & Setup

### Prerequisites
* [Node.js](https://nodejs.org/) (v16 or higher)
* [MongoDB Atlas Account](https://www.mongodb.com/cloud/atlas) or local MongoDB installation

### 1. Setup Server (Backend)
Navigate to the server workspace:
```bash
cd server
npm install
```
Configure your `.env` variables (see section below). Then start the backend server:
```bash
npm run dev
```

### 2. Setup Client (Frontend)
Navigate to the client workspace:
```bash
cd ../client
npm install
```
Start the development server:
```bash
npm run dev
```
Open your browser at [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

Create a file named `.env` inside the `server/` root directory and populate it with:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/hirenova
JWT_SECRET=your_jwt_super_secret_signing_key_string
```

---

## Authorization & Route Access Matrix

Permissions are protected at both frontend React level and backend router middleware.

| User Role | Guest (Anonymous) | Candidate | Recruiter |
| :--- | :---: | :---: | :---: |
| **Landing (`/`)** | View | View | View |
| **Login / Signup** | Accessible | Redirect | Redirect |
| **Job Search Listing** | View | View | View |
| **Job Details (`/jobs/:id`)** | View | View | View |
| **Apply to Job** | Redirect | Apply | Forbidden |
| **Bookmarks / Saved Jobs** | Redirect | Read/Write | Forbidden |
| **My Applications** | Redirect | View Status | Forbidden |
| **Recruiter Dashboard** | Redirect | Forbidden | Access |
| **Job Creator / Archive** | Redirect | Forbidden | Full Access |
| **Pipeline Status Controller**| Redirect | Forbidden | Full Access |
| **Workspace Profile** | Redirect | Manage Profile | Manage Profile |

---

## Screenshots & Placeholders

### Home Page
*Landing Hero & Statistics counters*
`[insert Home Page screenshot here]`

### Login
*Modern Split-pane glass theme form*
`[insert Login Page screenshot here]`

### Dashboard
*Metric indicators: jobs posted, statuses, selected pipeline counts*
`[insert Dashboard screenshot here]`

### Manage Jobs
*Table tracking Title, Company, Status, and Archive actions*
`[insert Manage Jobs screenshot here]`

### Applications
*Pipeline status updater panels*
`[insert Applications screenshot here]`

### Analytics
*SVG Monthly Applications Trend line & Success Circle meter*
`[insert Analytics screenshot here]`

### Saved Jobs
*Checklist containing bookmarked positions*
`[insert Saved Jobs screenshot here]`

### Profile Settings
*Profile picture base64 uploader & details form*
`[insert Profile Settings screenshot here]`

---

## Learning Outcomes

Building HireNova provided experience with:
* **State Synchronization**: Sharing authentication and visual theme flags cleanly using React Context API.
* **Secure Session Mappings**: Implementing JWT validations, cookie header bindings, and password hashing logic.
* **Role Restricting Router Rules**: Guarding routes dynamically on both frontend React trees and backend Express router pipelines.
* **Soft-Archive Databases**: Enforcing logical soft deletes instead of document drops to keep reporting tables aligned.
* **Clean Data Input Operations**: Sanitizing candidate inputs (e.g. query string stripping) to resolve mongoose validation patterns.
* **UX Performance Practices**: Utilizing lazy loaders and skeletons to keep rendering cycles high-performing.

---

## Future Enhancements

* **Direct Resume Document Upload**: Store PDF/Word resumes inside secure cloud buckets (such as AWS S3 or Cloudinary) rather than hosting URLs.
* **Email Dispatch Notifications**: Trigger automatic notifications (via SendGrid or Nodemailer) during pipeline transitions.
* **Detailed Company Pages**: Allow recruiters to customize corporate sub-pages for open positions.
* **System-wide Admin Panel**: Provide platform moderators with content controls and user activity metrics.
* **AI-Assisted Candidate Screening**: Match resume profiles to job requirements automatically.
* **Real-time Pipeline Messaging**: Real-time notifications and message integrations.

---

## Conclusion

HireNova demonstrates modern full-stack development, database schema design, and premium UI/UX design patterns. By integrating JWT security, logical data retention policies, and responsive styling systems, the platform serves as a modern SaaS recruitment solution ready for production workflows.
