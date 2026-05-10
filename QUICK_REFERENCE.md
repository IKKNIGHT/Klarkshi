# Klarkshi Quick Reference

## Available Commands

```bash
npm run dev       # Start development server (http://localhost:5173)
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

## File Organization

```
src/
├── components/           # React components (6 total)
│   ├── Auth.tsx         # Login/signup UI
│   ├── Dashboard.tsx    # Main app shell
│   ├── EventCard.tsx    # Event display card
│   ├── BettingModal.tsx # Betting interface
│   ├── Leaderboard.tsx  # Rankings
│   └── AdminPanel.tsx   # Admin controls
├── context/
│   └── AuthContext.tsx  # Global auth state
├── lib/
│   └── supabase.ts      # Supabase client & types
├── App.tsx              # Root component
├── main.tsx             # Entry point
└── index.css            # Global styles
```

## Environment Variables

```
VITE_SUPABASE_URL=https://gwfznodqwmqlczykibmz.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_MUhmjQkFAlteMNcbTsa6eg_vyFIAQaD
```

## Database Tables

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| profiles | User accounts | id, username, cp_balance, is_main_admin |
| events | School events | id, title, type, status, created_by |
| bets | User predictions | id, user_id, event_id, amount, prediction |

## Component Props

### BettingModal
- `event: Event` - Event to bet on
- `onClose: () => void` - Close callback
- `onBetPlaced: () => void` - Success callback

### EventCard
- `event: Event` - Event data
- `onClick: () => void` - Selection callback

### AdminPanel
- No props (uses auth context)

## Key Hooks

```tsx
// Get auth state
const { user, profile, loading, signOut } = useAuth()

// User data
profile.id              // UUID
profile.username        // string
profile.cp_balance      // number
profile.is_main_admin   // boolean
```

## Styling Classes

```css
.btn-primary       /* Blue button */
.btn-secondary     /* Gray button */
.card              /* Slate card with border */
.input-field       /* Form input */
```

## Color Palette

- **Background:** `bg-slate-950` (dark)
- **Cards:** `bg-slate-900`
- **Borders:** `border-slate-800`
- **Text:** `text-slate-100`
- **Accent:** `bg-indigo-600`
- **Success:** `text-emerald-400`
- **Muted:** `text-slate-400`

## Common Tasks

### Add a New Component
1. Create file in `src/components/ComponentName.tsx`
2. Import in parent component
3. Use as JSX element

### Connect to Supabase Table
```tsx
import { supabase } from '../lib/supabase'

// Read
const { data, error } = await supabase
  .from('table_name')
  .select('*')

// Insert
await supabase.from('table_name').insert({ field: value })

// Update
await supabase.from('table_name').update({ field: value }).eq('id', id)
```

### Add Toast Notification
```tsx
import toast from 'react-hot-toast'

toast.success('Success message')
toast.error('Error message')
toast.loading('Loading...')
```

### Use Framer Motion
```tsx
import { motion } from 'framer-motion'

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
>
  Content
</motion.div>
```

## Debugging

### Check Supabase Connection
1. Open DevTools > Network
2. Look for `supabase.co` requests
3. Check response status

### Check Auth State
```tsx
const { user, profile } = useAuth()
console.log('User:', user)
console.log('Profile:', profile)
```

### Check Database
Visit Supabase dashboard > SQL Editor to inspect data

## Deployment Checklist

- [ ] Environment variables set in Netlify
- [ ] Database schema created in Supabase
- [ ] Admin user created (is_main_admin = true)
- [ ] Build succeeds locally (`npm run build`)
- [ ] No TypeScript errors
- [ ] No console errors in DevTools
- [ ] Test auth flow in production
- [ ] Test placing a bet

## Performance Tips

- Use `useCallback` for event handlers
- Use `useMemo` for expensive computations
- Leverage Tailwind's responsive utilities
- Use Vite's code splitting automatically

## Common Errors & Solutions

| Error | Solution |
|-------|----------|
| "Cannot find module '@supabase/supabase-js'" | Run `npm install` |
| "VITE_SUPABASE_URL is undefined" | Check `.env.local` file |
| "Auth user is null" | User not authenticated, show Auth component |
| "Cannot insert into bets" | Check RLS policies in Supabase |
| "Bet amount exceeds balance" | Add client-side validation |

## API Endpoints (via Supabase)

All API calls go through Supabase REST API:
- Base: `https://gwfznodqwmqlczykibmz.supabase.co/rest/v1/`
- Auth: `https://gwfznodqwmqlczykibmz.supabase.co/auth/v1/`

The Supabase JS client handles all requests.

## TypeScript Types

See `src/lib/supabase.ts` for:
- `Profile`
- `Event`
- `Bet`

All types are exported for use in components.

## Git Workflow

```bash
# Create a branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "Add new feature"

# Push to GitHub
git push origin feature/new-feature

# Create Pull Request in GitHub
```

## Resources

- [Vite Docs](https://vitejs.dev)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Supabase Docs](https://supabase.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [React Hot Toast](https://react-hot-toast.com/)
