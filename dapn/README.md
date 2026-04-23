# Dapnix.creators

A premium portfolio and service booking platform for creators.

## Modules
1. **Authentication System**: JWT + Google OAuth integration.
2. **Portfolio Management**: Showcase projects with images/videos.
3. **Booking Slot System**: Manage and book consultation slots.
4. **Contact & Founder Info**: Unified dashboard for communication.
5. **Animated UI System**: High-end transitions and the signature "Envelope" hero.

## Tech Stack
- **Frontend**: Next.js 14+, Tailwind CSS, Framer Motion.
- **Backend**: Node.js, Express, Mongoose.
- **Database**: MongoDB.
- **Auth**: JWT, Passport.js.

## Getting Started

### Prerequisites
- Node.js installed.
- MongoDB running locally or a cloud URI.

### Server Setup
1. `cd server`
2. `npm install`
3. Configure `.env` (copy from provided `.env` and fill variables).
4. `npm run dev` (Ensure you have a dev script or run `node src/index.js`).

### Client Setup
1. `cd client`
2. `npm install`
3. `npm run dev`

## Architecture
See [architecture.md](./architecture.md) for detailed system design.
