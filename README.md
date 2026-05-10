# Klarkshi - School Betting Platform

A modern, school-themed "fake betting" application where users bet "Clark Points" (CP) on school events.

## Tech Stack

- **Frontend:** Vite + React (TypeScript)
- **Styling:** Tailwind CSS (Dark Mode)
- **Animations:** Framer Motion
- **Backend:** Supabase (PostgreSQL, Auth, Edge Functions)
- **Deployment:** Netlify

## Features

### Core Betting
- Place bets on school events (Yes/No or Higher/Lower)
- Track your Clark Points balance
- Real-time leaderboard

### User Roles
- **Main Admin:** Can create any event, grant CP, and resolve events
- **Event Admin:** Users with >200 CP can create their own events (costs 50 CP)
- **Regular User:** Can bet on open events

### Special Features
- **Bankruptcy Protection:** Users with 0 CP get a daily 50 CP allowance at midnight CST
- **Backdate Resolution:** Admins can specify an actual_end_date when resolving; bets placed after that time are nullified and CP returned
- **Leaderboard:** Real-time rankings based on CP balance

## Setup Instructions

### Prerequisites
- Node.js 18+ (or use the provided mise configuration)
- npm or yarn

### Environment Variables

Create a `.env.local` file in the project root:

```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
```

These are already configured in the `.env.local` file.

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will start at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Database Schema (Supabase)

### Profiles Table
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT UNIQUE NOT NULL,
  cp_balance INTEGER DEFAULT 100,
  is_main_admin BOOLEAN DEFAULT FALSE,
  last_check_in TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Events Table
```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('yes_no', 'higher_lower')),
  created_by UUID NOT NULL REFERENCES profiles(id),
  end_date TIMESTAMP WITH TIME ZONE,
  actual_end_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed', 'resolved')),
  resolved_outcome TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Bets Table
```sql
CREATE TABLE bets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  event_id UUID NOT NULL REFERENCES events(id),
  amount INTEGER NOT NULL,
  prediction TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'won', 'lost'))
);
```

## Deployment on Netlify

1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`

## Project Structure

```
src/
├── components/        # React components
│   ├── Auth.tsx
│   ├── Dashboard.tsx
│   ├── EventCard.tsx
│   ├── BettingModal.tsx
│   └── Leaderboard.tsx
├── context/          # React context providers
│   └── AuthContext.tsx
├── lib/              # Utilities and helpers
│   └── supabase.ts
├── App.tsx
├── main.tsx
└── index.css
```

## Development Notes

- All timestamps use `timezone('CST', now())` for consistent timezone handling
- Daily reset at midnight CST for bankruptcy protection
- Event Admins pay 50 CP "license fee" to post an event
- Bets use 1:1 payout ratio for simplicity in school setting
