# Google OAuth Credentials Setup Guide

## Quick Steps

1. **Sign in** to Google Cloud Console (browser should be open)
2. **Create/Select Project**
3. **Enable Gmail API**
4. **Create OAuth Credentials**
5. **Download JSON file**
6. **Place in `~/.gmail-mcp/`**

## Detailed Steps

### Step 1: Sign In
- Sign in with your Google account in the browser

### Step 2: Create or Select Project
- Click project dropdown at top
- Click "New Project" or select existing
- Name it (e.g., "Gmail MCP Server")
- Click "Create"

### Step 3: Enable Gmail API
- Go to "APIs & Services" > "Library"
- Search for "Gmail API"
- Click "Enable"

### Step 4: Create OAuth 2.0 Credentials
- Go to "APIs & Services" > "Credentials"
- Click "+ CREATE CREDENTIALS" > "OAuth client ID"
- If prompted, configure OAuth consent screen first:
  - Choose "External" (unless you have Google Workspace)
  - Fill required fields (App name, User support email, Developer contact)
  - Add scopes: `https://www.googleapis.com/auth/gmail.modify`
  - Add test users (your email)
  - Save
- Back to Credentials:
  - Application type: **"Desktop app"**
  - Name: "Gmail MCP Server" (or any name)
  - Click "Create"
  - **Download** the JSON file

### Step 5: Place Credentials
```bash
# Copy downloaded file to Gmail MCP directory
cp ~/Downloads/client_secret_*.json ~/.gmail-mcp/gcp-oauth.keys.json
```

### Step 6: Authenticate
```bash
cd mcp-servers/gmail
node dist/index.js auth
```

## Direct Links

- [Google Cloud Console](https://console.cloud.google.com/)
- [APIs & Services - Credentials](https://console.cloud.google.com/apis/credentials)
- [Gmail API Library](https://console.cloud.google.com/apis/library/gmail.googleapis.com)

