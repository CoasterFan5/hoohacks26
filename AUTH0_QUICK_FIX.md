# Auth0 "Unauthorized" Error - Quick Fix

## The Problem
Getting `Error handling redirect callback: Error: Unauthorized` after login.

## The Solution (5 Minutes)

### 1. Fix Your Auth0 Settings

Go to: https://manage.auth0.com/

1. Click **Applications** → **Applications**
2. Click your application name
3. Scroll to **Application URIs**
4. Update these fields:

```
Allowed Callback URLs:
http://localhost:5173/

Allowed Logout URLs:
http://localhost:5173/

Allowed Web Origins:
http://localhost:5173

Allowed Origins (CORS):
http://localhost:5173
```

**CRITICAL:** 
- The callback and logout URLs MUST have a trailing slash `/`
- No extra paths, just the origin + slash
- Click **Save Changes** button at bottom!

### 2. Verify Application Type

At the top of the same page:
- **Application Type** must be: **Single Page Application**
- If it says anything else, you need to create a new application

### 3. Check Your .env File

```bash
cat .env
```

Should contain:
```env
VITE_AUTH0_DOMAIN=dev-xxxxx.us.auth0.com
VITE_AUTH0_CLIENT_ID=your_client_id_here
```

Replace with YOUR actual values from Auth0 dashboard (Basic Information section).

### 4. Clear Browser Cache

1. Open DevTools (F12)
2. Go to **Application** tab
3. Click **Local Storage** → `http://localhost:5173`
4. Right-click → **Clear**
5. Close browser completely and reopen

### 5. Restart Dev Server

```bash
# Press Ctrl+C to stop
pnpm dev
```

### 6. Test Again

1. Go to http://localhost:5173/
2. Click "Log In"
3. Should work now! ✅

## Still Not Working?

### Double-Check These:

- [ ] Callback URL has trailing slash: `http://localhost:5173/` ✓
- [ ] Application Type is "Single Page Application" ✓
- [ ] Clicked "Save Changes" in Auth0 dashboard ✓
- [ ] Restarted dev server after changing .env ✓
- [ ] Cleared browser local storage ✓
- [ ] No typos in domain or client ID ✓
- [ ] Using correct port (5173 for dev, 4173 for preview) ✓

### Common Mistakes:

❌ `http://localhost:5173` (missing trailing slash)
✅ `http://localhost:5173/` (correct!)

❌ `http://localhost:5173/callback` (no path allowed)
✅ `http://localhost:5173/` (correct!)

❌ Application Type: "Regular Web Application"
✅ Application Type: "Single Page Application"

❌ Using Client Secret in frontend
✅ Only use Domain and Client ID

### Debug Checklist:

```javascript
// Add this temporarily to src/lib/stores/auth.ts after line 30
console.log('Auth0 Config:', {
  domain: import.meta.env.VITE_AUTH0_DOMAIN,
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
  redirectUri: window.location.origin + '/'
});
```

Expected output:
```
Auth0 Config: {
  domain: "dev-xxxxx.us.auth0.com",
  clientId: "abc123...",
  redirectUri: "http://localhost:5173/"
}
```

### Check Auth0 Logs:

1. Go to https://manage.auth0.com/
2. Click **Monitoring** → **Logs**
3. Look for failed authentication attempts
4. Check error messages

### If Domain is Wrong:

Make sure it matches your Auth0 tenant region:
- US: `dev-xxxxx.us.auth0.com`
- EU: `dev-xxxxx.eu.auth0.com`
- AU: `dev-xxxxx.au.auth0.com`

## Need More Help?

Read the full guide: `AUTH0_SETUP.md`

The app will now show detailed error messages telling you exactly what's wrong!