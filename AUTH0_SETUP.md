# Auth0 Setup Guide - Fix for "Unauthorized" Error

This guide will help you set up Auth0 authentication and fix the "Unauthorized" error during redirect callback.

## Quick Fix for "Unauthorized" Error

If you're seeing `Error handling redirect callback: Error: Unauthorized`, follow these steps:

### Step 1: Check Your Allowed Callback URLs in Auth0

1. Go to [Auth0 Dashboard](https://manage.auth0.com/)
2. Navigate to **Applications** → **Applications**
3. Click on your application
4. Scroll to **Application URIs** section
5. In **Allowed Callback URLs**, add EXACTLY:
   ```
   http://localhost:5173/
   ```
   **IMPORTANT**: Note the trailing slash `/` - it MUST be included!

6. Click **Save Changes** at the bottom

### Step 2: Verify Application Type

In the same Auth0 application settings page:

1. Scroll to the top and check **Application Type**
2. It MUST be set to **Single Page Application**
3. If it's not, you need to create a new application as this cannot be changed

### Step 3: Configure All Required URLs

In your Auth0 application settings, add the following (with trailing slashes):

#### Allowed Callback URLs
```
http://localhost:5173/
```

For production, also add:
```
https://yourdomain.com/
```

#### Allowed Logout URLs
```
http://localhost:5173/
```

For production:
```
https://yourdomain.com/
```

#### Allowed Web Origins
```
http://localhost:5173
```

For production:
```
https://yourdomain.com
```

#### Allowed Origins (CORS)
```
http://localhost:5173
```

For production:
```
https://yourdomain.com
```

**Click "Save Changes" after updating these fields!**

### Step 4: Clear Browser Storage

1. Open your browser DevTools (F12 or Cmd+Option+I)
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Expand **Local Storage** in the left sidebar
4. Right-click on your app's origin and select **Clear**
5. Close and reopen your browser

### Step 5: Restart Development Server

```bash
# Stop the server (Ctrl+C)
# Start it again
pnpm dev
```

## Complete Setup from Scratch

### Prerequisites

- Node.js installed (v18 or higher recommended)
- An Auth0 account (sign up for free at https://auth0.com)

### Step 1: Create an Auth0 Application

1. Go to the [Auth0 Dashboard](https://manage.auth0.com/)
2. Navigate to **Applications** → **Applications** in the sidebar
3. Click **Create Application**
4. Give your application a name (e.g., "HooHacks26 App")
5. Select **Single Page Web Applications** as the application type
6. Click **Create**

### Step 2: Configure Application Settings

In your Auth0 application settings page, configure the following:

#### Application URIs Section

**Allowed Callback URLs:**
```
http://localhost:5173/
http://localhost:4173/
```

**Allowed Logout URLs:**
```
http://localhost:5173/
http://localhost:4173/
```

**Allowed Web Origins:**
```
http://localhost:5173
http://localhost:4173
```

**Allowed Origins (CORS):**
```
http://localhost:5173
http://localhost:4173
```

#### Advanced Settings (Optional but Recommended)

1. Scroll down and click **Advanced Settings**
2. Go to **OAuth** tab
3. Ensure **JsonWebToken Signature Algorithm** is set to `RS256`
4. Ensure **OIDC Conformant** is enabled

Click **Save Changes** at the bottom of the page.

### Step 3: Get Your Auth0 Credentials

On the same settings page, find these values in the **Basic Information** section:

- **Domain** (e.g., `dev-abc123.us.auth0.com`)
- **Client ID** (e.g., `abc123xyz456`)

**DO NOT use the Client Secret** - Single Page Applications don't need it.

### Step 4: Configure Environment Variables

1. Copy the `.env.example` file:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and add your Auth0 credentials:
   ```env
   VITE_AUTH0_DOMAIN=dev-abc123.us.auth0.com
   VITE_AUTH0_CLIENT_ID=your_client_id_here
   ```

   Replace with your actual values from Step 3.

**Important:** 
- Never commit your `.env` file to version control
- The file should already be in `.gitignore`
- Make sure variable names start with `VITE_`

### Step 5: Install Dependencies and Run

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Start the development server:
   ```bash
   pnpm dev
   ```

3. Open your browser to `http://localhost:5173/`

### Step 6: Test Authentication

1. Click the **Log In** button on the homepage
2. You'll be redirected to Auth0's Universal Login page
3. Sign up with an email/password or use a social provider (if configured)
4. After successful authentication, you'll be redirected back to your app at `http://localhost:5173/`
5. You should see your profile information displayed
6. Click **Log Out** to test the logout flow

## Troubleshooting

### "Unauthorized" Error

**Symptoms:** Error during redirect callback after login

**Solutions:**

1. **Check the callback URL format:**
   - Must include trailing slash: `http://localhost:5173/`
   - Must match EXACTLY (case-sensitive)
   - No extra paths or query parameters

2. **Verify application type:**
   - Must be "Single Page Application"
   - Cannot be "Regular Web Application" or "Native"

3. **Check CORS settings:**
   - Add your origin to "Allowed Web Origins"
   - Add your origin to "Allowed Origins (CORS)"

4. **Clear browser storage:**
   - Open DevTools → Application → Local Storage → Clear All
   - Close and reopen browser

5. **Check Auth0 tenant region:**
   - Make sure you're using the correct domain
   - US: `*.us.auth0.com`
   - EU: `*.eu.auth0.com`
   - AU: `*.au.auth0.com`

6. **Verify you clicked "Save Changes":**
   - Auth0 won't apply changes until you save
   - Look for the green success message

### "Configuration missing" Error

**Symptoms:** App shows error about missing configuration

**Solutions:**

1. **Check `.env` file exists:**
   ```bash
   ls -la .env
   ```

2. **Verify environment variables:**
   ```bash
   cat .env
   ```
   Should show:
   ```env
   VITE_AUTH0_DOMAIN=your-domain.auth0.com
   VITE_AUTH0_CLIENT_ID=your_client_id
   ```

3. **Restart dev server:**
   - Stop server (Ctrl+C)
   - Start again: `pnpm dev`

4. **Check variable names:**
   - Must start with `VITE_`
   - Case-sensitive

### "Invalid state" Error

**Symptoms:** State validation fails during callback

**Solutions:**

1. Clear browser's local storage
2. Don't open multiple tabs during login
3. Don't use the back button during auth flow
4. Check if another instance of the app is running on the same port

### Redirect URI Mismatch Error

**Symptoms:** Auth0 shows "The redirect URI is not in the list of allowed URIs"

**Solutions:**

1. **Double-check the URL format:**
   - With trailing slash: `http://localhost:5173/`
   - Without path: Don't use `http://localhost:5173/callback`

2. **Check the port number:**
   - Vite dev server: port `5173`
   - Vite preview: port `4173`
   - Add both if needed

3. **Check for typos:**
   - `http` not `https` for localhost
   - Correct port number
   - No extra spaces

### Logout Not Working

**Symptoms:** User stays logged in after clicking logout

**Solutions:**

1. Verify "Allowed Logout URLs" in Auth0
2. Check browser console for errors
3. Clear browser local storage manually
4. Make sure logout URL has trailing slash

### Token/Session Issues

**Symptoms:** User gets logged out randomly or tokens don't refresh

**Solutions:**

1. Clear browser's local storage
2. Check token expiration settings in Auth0
3. Verify `useRefreshTokens: true` is set (already configured)
4. Check Auth0 logs for failed token refresh attempts

### Browser Console Showing Errors

**Check the specific error message:**

1. **Network errors (CORS):**
   - Add origins to "Allowed Origins (CORS)" in Auth0
   - Check if a proxy or VPN is interfering

2. **403 Forbidden:**
   - Application might be disabled in Auth0
   - Check application status in dashboard

3. **Failed to fetch:**
   - Check internet connection
   - Verify Auth0 domain is correct
   - Check if firewall is blocking Auth0

## Advanced Configuration

### Adding Social Connections

1. In Auth0 Dashboard, go to **Authentication** → **Social**
2. Click on the social provider (Google, GitHub, Facebook, etc.)
3. Follow the provider-specific setup instructions
4. Toggle the switch to enable the connection
5. Go to your Application settings
6. Click the **Connections** tab
7. Enable the social connection for your application

### Customizing the Login Page

1. Go to **Branding** → **Universal Login** in Auth0 Dashboard
2. Choose between **New**, **Classic**, or **Custom** experience
3. Customize:
   - Logo
   - Primary color
   - Background color
   - Text content
4. Click **Save Changes**

### Adding User Roles and Permissions

1. Go to **User Management** → **Roles**
2. Click **Create Role**
3. Add a name and description
4. Add permissions to the role
5. Go to **User Management** → **Users**
6. Select a user
7. Click **Roles** tab
8. Assign roles to the user

### Protecting API Endpoints

If you need to call protected APIs:

1. **Create an API in Auth0:**
   - Go to **Applications** → **APIs**
   - Click **Create API**
   - Set name and identifier (audience)

2. **Add audience to environment variables:**
   ```env
   VITE_AUTH0_AUDIENCE=https://your-api-identifier
   ```

3. **Update auth configuration:**
   Edit `src/lib/stores/auth.ts`:
   ```typescript
   const client = await createAuth0Client({
     domain,
     clientId,
     authorizationParams: {
       redirect_uri: `${window.location.origin}/`,
       audience: import.meta.env.VITE_AUTH0_AUDIENCE // Add this line
     },
     useRefreshTokens: true,
     cacheLocation: 'localstorage',
     cacheMode: 'on'
   });
   ```

### Enable Multifactor Authentication (MFA)

1. Go to **Security** → **Multi-factor Auth**
2. Enable desired MFA factors (SMS, Email, Authenticator app)
3. Configure when to require MFA:
   - Always
   - Adaptive (based on risk)
   - Never (optional)

## Security Best Practices

1. **Never expose sensitive credentials:**
   - Don't commit `.env` to version control
   - Don't use Client Secret in frontend code
   - Don't log tokens to console in production

2. **Use HTTPS in production:**
   - Auth0 requires HTTPS for production
   - Update callback URLs to use `https://`

3. **Keep dependencies updated:**
   ```bash
   pnpm update @auth0/auth0-spa-js
   ```

4. **Validate tokens on the backend:**
   - Never trust frontend-only validation
   - Always verify tokens server-side for protected resources

5. **Use appropriate token expiration:**
   - Go to **Applications** → **APIs** in Auth0
   - Set appropriate token lifetime
   - Use refresh tokens for long sessions (already enabled)

6. **Monitor authentication logs:**
   - Go to **Monitoring** → **Logs** in Auth0
   - Review failed login attempts
   - Set up log streaming for production

7. **Enable anomaly detection:**
   - Go to **Security** → **Attack Protection**
   - Enable brute force protection
   - Enable suspicious IP throttling

## Production Deployment Checklist

Before deploying to production:

- [ ] Change Auth0 callback URLs to production domain
- [ ] Use HTTPS for all URLs
- [ ] Update environment variables for production
- [ ] Remove or secure any debug logging
- [ ] Test authentication flow on production domain
- [ ] Enable MFA if required
- [ ] Set up Auth0 log streaming
- [ ] Configure custom domain (optional)
- [ ] Review security settings
- [ ] Test logout flow
- [ ] Test token refresh

## Resources

- [Auth0 Documentation](https://auth0.com/docs)
- [Auth0 SPA JS SDK Documentation](https://auth0.com/docs/libraries/auth0-spa-js)
- [Auth0 SPA Quickstart](https://auth0.com/docs/quickstart/spa)
- [SvelteKit Documentation](https://kit.svelte.dev/docs)
- [Auth0 Community](https://community.auth0.com/)
- [Auth0 Support](https://support.auth0.com/)

## Getting Help

If you continue to have issues:

1. **Check the browser console:**
   - Open DevTools (F12)
   - Look for red error messages
   - Check Network tab for failed requests

2. **Check Auth0 logs:**
   - Go to **Monitoring** → **Logs** in Auth0 Dashboard
   - Look for failed authentication attempts
   - Note the error codes

3. **Verify configuration:**
   - Print your config in console (don't share publicly):
     ```javascript
     console.log('Domain:', import.meta.env.VITE_AUTH0_DOMAIN);
     console.log('Client ID:', import.meta.env.VITE_AUTH0_CLIENT_ID);
     console.log('Redirect URI:', window.location.origin + '/');
     ```

4. **Common Auth0 error codes:**
   - `access_denied`: User cancelled or permissions issue
   - `unauthorized`: Callback URL mismatch or wrong app type
   - `invalid_state`: State parameter mismatch (clear cache)
   - `login_required`: Session expired (automatic retry enabled)

5. **Ask for help:**
   - Check existing issues on GitHub
   - Post on Auth0 Community forums
   - Contact Auth0 support (paid plans)

## Testing Checklist

To verify your Auth0 setup is working correctly:

- [ ] Environment variables are set correctly
- [ ] Can see login button on homepage
- [ ] Clicking login redirects to Auth0
- [ ] Can sign up with new account
- [ ] After signup, redirected back to app
- [ ] Profile information displays correctly
- [ ] No console errors
- [ ] Logout button works
- [ ] After logout, profile is hidden
- [ ] Can log back in with same account
- [ ] Token refresh works (wait 10+ minutes while logged in)