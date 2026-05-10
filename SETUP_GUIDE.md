# Klarkshi Setup Guide

## Step 1: Supabase Database Setup

### 1.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note your project URL and anon key

### 1.2 Configure Database Schema
1. In your Supabase dashboard, go to **SQL Editor**
2. Create a new query and paste the contents of `supabase_schema.sql`
3. Execute the query to set up all tables, policies, and functions

### 1.3 Enable Authentication
1. Go to **Authentication** > **Providers** in Supabase
2. Make sure **Email** provider is enabled
3. Go to **Email Templates** and customize if needed

### 1.4 Set Up Initial Admin User
1. In Supabase Dashboard, go to **Authentication** > **Users**
2. Create a new user with your email
3. Go to **SQL Editor** and run:
```sql
UPDATE profiles SET is_main_admin = true WHERE id = 'USER_UUID_HERE';
```

## Step 2: Environment Configuration

The `.env.local` file is already configured with the Supabase credentials:

```
VITE_SUPABASE_URL=https://gwfznodqwmqlczykibmz.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_MUhmjQkFAlteMNcbTsa6eg_vyFIAQaD
```

**Important for Netlify Deployment:**
1. Go to your Netlify site settings
2. Navigate to **Build & Deploy** > **Environment**
3. Add these variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`

## Step 3: Local Development

```bash
# Install dependencies (if not already done)
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`

## Step 4: Build & Deployment

### Local Build
```bash
npm run build
npm run preview  # Preview the production build locally
```

### Deploy to Netlify

#### Option A: GitHub Integration (Recommended)
1. Push your code to GitHub
2. Connect your GitHub repo to Netlify
3. Set build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Add environment variables in Netlify dashboard
5. Deploy!

#### Option B: Manual Deploy
```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

## Step 5: User Roles & Permissions

### Main Admin Capabilities
- Create any event
- Resolve events with optional backdate
- Grant CP to users (future feature)
- View all user data

### Event Admin (200+ CP Users)
- Create their own events (50 CP "license fee")
- Resolve only their own events
- Cannot create other events

### Regular Users
- Place bets on open events
- View leaderboard
- Automatic 50 CP daily allowance if balance = 0

## Step 6: Core Features

### Betting System
1. **Place a Bet:**
   - Select an open event
   - Choose your prediction (Yes/No or Higher/Lower)
   - Enter CP amount
   - Click "Place Bet"

2. **Payout System:**
   - Win: Bet amount × 2 returned
   - Loss: Bet amount forfeited
   - Tied bets: Return bet amount (handled manually by admin)

### Event Resolution
1. **Admin creates event** (requires admin privileges)
2. **Users place bets** during open period
3. **Admin closes event** (marks as closed)
4. **Admin resolves event:**
   - Specify the actual outcome
   - Optionally set `actual_end_date` to invalidate late bets
   - Late bets are automatically refunded

### Bankruptcy Protection
- **Trigger:** User's CP balance reaches 0
- **Action:** At midnight CST, user receives 50 CP
- **Reset:** Per-day, only once per user per day

### Leaderboard
- Real-time ranking by CP balance
- Shows top 50 users
- Admin badge for main admins

## Step 7: Testing

### Test User Flow
1. Sign up as a regular user
2. Verify 100 CP starting balance
3. Place bets on events
4. Check balance updates

### Test Admin Flow
1. Sign in as admin user
2. Access Admin Panel tab
3. Create a test event
4. Verify event appears in Open Events
5. Place test bets as another user
6. Resolve event and verify winners

### Test Bankruptcy
1. Create a user and set balance to 0
2. Verify they receive 50 CP at midnight CST
3. Test daily reset mechanism

## Troubleshooting

### "Failed to load events" Error
- Check Supabase connection in browser DevTools
- Verify `VITE_SUPABASE_*` environment variables
- Ensure Supabase project is active

### Cannot Create Events (Regular User)
- Regular users cannot create events
- They need 200+ CP to become Event Admin
- Event Admins pay 50 CP to create an event

### Bets Not Placing
- Verify user has sufficient CP balance
- Check network tab for API errors
- Ensure event status is "open"

### Deploy Issues on Netlify
- Ensure environment variables are set in Netlify dashboard
- Check build logs for TypeScript errors
- Verify all dependencies are in package.json

## Project Structure

```
klarkshi/
├── src/
│   ├── components/          # React components
│   │   ├── Auth.tsx
│   │   ├── Dashboard.tsx
│   │   ├── EventCard.tsx
│   │   ├── BettingModal.tsx
│   │   ├── Leaderboard.tsx
│   │   └── AdminPanel.tsx
│   ├── context/             # React context
│   │   └── AuthContext.tsx
│   ├── lib/                 # Utilities
│   │   └── supabase.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── package.json
├── index.html
├── supabase_schema.sql
└── README.md
```

## Database Schema Overview

### profiles
- `id` (UUID): User ID from auth
- `username`: Display name
- `cp_balance`: Clark Points (default: 100)
- `is_main_admin`: Admin flag
- `last_check_in`: For daily resets

### events
- `id` (UUID): Event ID
- `title`: Event name
- `description`: Details
- `type`: 'yes_no' or 'higher_lower'
- `created_by`: Admin ID
- `end_date`: Betting deadline
- `actual_end_date`: True deadline (for backdate)
- `status`: 'open', 'closed', 'resolved'
- `resolved_outcome`: Result

### bets
- `id` (UUID): Bet ID
- `user_id`: Better's ID
- `event_id`: Event ID
- `amount`: CP wagered
- `prediction`: User's guess
- `status`: 'pending', 'won', 'lost'

## Next Steps

1. **User Management:** Build admin CP granting interface
2. **Event Resolution:** Build resolved outcome modal with backdate support
3. **Analytics:** Track betting patterns and win rates
4. **Notifications:** Real-time updates on event resolution
5. **Mobile Optimization:** Ensure mobile-first responsive design

## Support

For issues with:
- **Supabase:** Check Supabase documentation
- **React/Vite:** Check React and Vite docs
- **Tailwind CSS:** Check Tailwind documentation
- **Netlify:** Check Netlify deployment docs
