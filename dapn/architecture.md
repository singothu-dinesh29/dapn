# Dapnix.creators: System Architecture & Implementation Plan

## 1. System Architecture Overview

The Dapnix.creators platform is designed as a full-stack web application with a decoupled architecture. 

### Frontend: Next.js (App Router)
- **Framework**: Next.js 14+ for Server-Side Rendering (SSR) and Static Site Generation (SSG).
- **Styling**: Tailwind CSS for a premium, utility-first design.
- **Animations**: Framer Motion for high-end transitions, specifically for the "Envelope" UI system.
- **State Management**: React Context API for global states like Auth and Theme.
- **Auth**: Custom JWT integration and NextAuth.js for Google OAuth.

### Backend: Node.js + Express
- **Runtime**: Node.js with Express for scalable REST APIs.
- **ORM/ODM**: Mongoose for MongoDB interaction.
- **Security**: JWT-based stateless authentication, CORS, Helmet, and Rate Limiting.
- **Validation**: Zod or Joi for request body validation.

### Database: MongoDB
- A document-oriented database to store flexible data structures like projects and complex booking slots.

---

## 2. API Flow & Communication

1. **Authentication Flow**:
   - User signs in via Google OAuth or Email/Password.
   - Backend validates and issues a JWT.
   - Frontend stores JWT in a secure HTTP-only cookie.
   - All subsequent requests include this JWT for authorization.

2. **Booking Flow**:
   - Creator sets availability slots in the dashboard.
   - Clients view available slots on the creator's portfolio.
   - Client books a slot -> Backend creates a Booking record -> Notifies Creator.

3. **Portfolio Management**:
   - Creator uploads project details (images, description).
   - Images are stored in a CDN (e.g., Cloudinary).
   - Metadata is stored in MongoDB.

---

## 3. Database Schema Relationships

### User Model
- `_id`: ObjectId
- `name`: String
- `email`: String (Unique)
- `avatar`: String
- `role`: Enum ['creator', 'admin', 'client']
- `googleId`: String (Optional)
- `bio`: String

### Project Model (Portfolio)
- `_id`: ObjectId
- `creatorId`: Reference -> User
- `title`: String
- `description`: String
- `images`: Array [String]
- `links`: Object { live, github, etc }
- `tags`: Array [String]
- `createdAt`: Date

### BookingSlot Model
- `_id`: ObjectId
- `creatorId`: Reference -> User
- `startTime`: Date
- `endTime`: Date
- `status`: Enum ['available', 'booked', 'blocked']
- `bookedBy`: Reference -> User (Optional)
- `meetingLink`: String

---

## 4. Folder Structure

```text
dapn/
├── client/                 # Next.js Application
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── app/            # App Router (Pages, Layouts)
│   │   ├── components/     # UI, Shared, and Animated (Envelope)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utilities (axios, auth config)
│   │   ├── services/       # API call definitions
│   │   └── types/          # TypeScript interfaces (if TS used)
│   ├── tailwind.config.js
│   └── package.json
└── server/                 # Express API
    ├── src/
    │   ├── config/         # DB, Passport, Env setup
    │   ├── controllers/    # Request handlers
    │   ├── middleware/     # Auth, Logging, Error handling
    │   ├── models/         # Mongoose schemas
    │   ├── routes/         # API endpoints
    │   └── utils/          # Helpers
    ├── package.json
    └── .env
```

## 5. UI System (Envelope + Transitions)

The "Envelope" UI system will be a centerpiece of the platform, symbolizing "delivering value."
- **Home**: A sealed envelope that opens on hover/click to reveal the portfolio introduction.
- **Transitions**: Slide-in and fade animations between pages to maintain a premium feel.
- **Glassmorphism**: High-quality frosted glass effects for overlays.
