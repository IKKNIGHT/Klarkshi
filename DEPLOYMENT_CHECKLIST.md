# Klarkshi Deployment Checklist

## Pre-Deployment Verification ✅

### Code Quality
- [x] TypeScript compilation passes (`npm run build` succeeds)
- [x] No console errors or warnings
- [x] All imports are resolved correctly
- [x] Code follows project conventions
- [x] Environment variables configured

### Testing
- [ ] Test sign-up flow
- [ ] Test sign-in flow
- [ ] Test placing a bet
- [ ] Test event creation (admin)
- [ ] Test balance updates
- [ ] Test leaderboard display
- [ ] Test all UI responsiveness on mobile
- [ ] Test toast notifications
- [ ] Test modal interactions

### Database
- [ ] Supabase project created
- [ ] Schema SQL executed (`supabase_schema.sql`)
- [ ] RLS policies enabled
- [ ] Tables have data (test events/users created)
- [ ] Indexes created for performance
- [ ] Auth provider (Email) enabled

## Netlify Deployment Steps

### 1. Prepare Repository
```bash
git add .
git commit -m "Initial Klarkshi MVP deployment"
git push origin main
```

### 2. Connect to Netlify
1. Go to [netlify.com](https://netlify.com)
2. Click "New site from Git"
3. Select GitHub and authorize
4. Choose your repository
5. Select branch: `main`

### 3. Configure Build Settings
- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Node version:** `18` (or higher)

### 4. Add Environment Variables
In Netlify dashboard, go to **Site settings** > **Build & deploy** > **Environment**:

```
VITE_SUPABASE_URL = https://gwfznodqwmqlczykibmz.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY = sb_publishable_MUhmjQkFAlteMNcbTsa6eg_vyFIAQaD
```

### 5. Configure Domain (Optional)
- Set custom domain in Netlify settings
- Update DNS if needed
- Configure SSL (automatic with Netlify)

### 6. Deploy
1. Click "Deploy site"
2. Wait for build to complete (usually 2-3 minutes)
3. View deployment logs if there are issues
4. Check live site at provided URL

## Post-Deployment Verification

### Site Loading
- [ ] Site loads without 404 errors
- [ ] CSS is applied (dark theme visible)
- [ ] No mixed content warnings
- [ ] All images load correctly

### Authentication
- [ ] Can create new account
- [ ] Verification email sent (check spam)
- [ ] Can sign in with credentials
- [ ] Session persists on refresh
- [ ] Sign out works correctly

### Core Features
- [ ] Dashboard displays correctly
- [ ] Open events load from database
- [ ] Can place a bet
- [ ] Balance updates after bet
- [ ] Leaderboard displays users
- [ ] Admin can create events

### Performance
- [ ] Page loads in < 3 seconds
- [ ] No console errors
- [ ] Network requests complete successfully
- [ ] Images are optimized

### Browser Compatibility
- [ ] Works on Chrome/Chromium
- [ ] Works on Firefox
- [ ] Works on Safari
- [ ] Works on mobile browsers
- [ ] Responsive design works

## Rollback Plan

If deployment has critical issues:

```bash
# Option 1: Redeploy previous version
# In Netlify UI: Deployments > Previous deploy > Deploy

# Option 2: Rebuild from source
git checkout previous-commit-hash
git push origin main
# Netlify auto-redeploys
```

## Monitoring

### Set Up Alerts
1. Enable deploy notifications in Netlify
2. Add error tracking (Sentry, LogRocket, etc.)
3. Monitor Supabase for database errors

### Check Logs
- Netlify build logs
- Supabase function logs
- Browser console errors
- Network requests

### Performance Monitoring
- Core Web Vitals
- Page load time
- Interaction to Next Paint (INP)
- Cumulative Layout Shift (CLS)

## Common Deployment Issues & Solutions

| Issue | Solution |
|-------|----------|
| Build fails with "Module not found" | Ensure all dependencies in `package.json` |
| Environment variables undefined | Verify variables in Netlify dashboard |
| Database connection fails | Check Supabase URL and key are correct |
| Auth not working | Verify Email provider enabled in Supabase |
| Styles missing | Check `tailwind.config.js` is correct |
| Large bundle size | Can optimize later with code splitting |

## Post-Launch Tasks

### Week 1
- [ ] Monitor error logs
- [ ] Gather user feedback
- [ ] Test all user flows
- [ ] Performance optimization if needed

### Week 2
- [ ] Plan next features (Event Admin, CP grants)
- [ ] Set up analytics
- [ ] Create user documentation
- [ ] Plan marketing/announcement

### Ongoing
- [ ] Monitor database usage
- [ ] Backup database regularly
- [ ] Update dependencies monthly
- [ ] Review user feedback
- [ ] Plan feature releases

## Feature Parity Checklist

### Implemented (MVP)
- [x] User authentication (sign up/sign in)
- [x] Balance tracking
- [x] Event creation (admins only)
- [x] Betting system
- [x] Leaderboard
- [x] Dark UI theme
- [x] Responsive design
- [x] Toast notifications

### TODO (Phase 2)
- [ ] Event Admin role (200+ CP)
- [ ] CP license fee for events (50 CP)
- [ ] Admin CP granting interface
- [ ] Bankruptcy protection (daily 50 CP reset)
- [ ] Event resolution with backdate
- [ ] Late bet nullification
- [ ] Event comments/discussion
- [ ] Bet history view
- [ ] User statistics
- [ ] Real-time updates via Supabase subscriptions

## Success Metrics

Track these after launch:
- User sign-ups (target: 10+ per day)
- Active daily users
- Bets placed per day
- Average balance growth
- User retention (7-day, 30-day)
- Page load time (target: < 2s)
- Zero-error deployment rate
- User support tickets (target: < 5)

## Contact & Support

- **Supabase Issues:** Supabase dashboard > Support
- **Netlify Issues:** Netlify dashboard > Support
- **Code Issues:** Check GitHub issues
- **Questions:** Review SETUP_GUIDE.md and QUICK_REFERENCE.md

## Sign-Off

- [ ] Lead developer verified all tests pass
- [ ] All environment variables configured
- [ ] Database schema confirmed in Supabase
- [ ] Admin user created and verified
- [ ] Deployment to Netlify successful
- [ ] Post-deployment verification complete
- [ ] Team notified of live deployment
- [ ] Documentation complete and accessible
