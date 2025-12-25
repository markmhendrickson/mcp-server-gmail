# Gmail MCP Server - Quick Start

## ✅ Installation Complete

The Gmail MCP server has been installed and configured in Cursor.

## What's Done

1. ✅ Server installed and secured (0 vulnerabilities)
2. ✅ MCP configuration added to `~/.cursor/mcp.json`
3. ✅ Gmail MCP directory created at `~/.gmail-mcp/`

## What You Need to Do

### 1. Get Google OAuth Credentials (5 minutes)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create/select a project
3. Enable **Gmail API**
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Choose **"Desktop app"**
6. Download the JSON file

### 2. Place Credentials

```bash
# Copy downloaded file to Gmail MCP directory
cp ~/Downloads/client_secret_*.json ~/.gmail-mcp/gcp-oauth.keys.json
```

### 3. Authenticate

```bash
cd mcp-servers/gmail
node dist/index.js auth
```

This opens your browser for Google sign-in.

### 4. Restart Cursor

Close and reopen Cursor to load the Gmail MCP server.

### 5. Test

Ask Cursor: "List my Gmail labels" or "Search for emails from last week"

## Configuration Files

- **MCP Config:** `~/.cursor/mcp.json` (already configured)
- **OAuth Keys:** `~/.gmail-mcp/gcp-oauth.keys.json` (you need to add this)
- **Tokens:** `~/.gmail-mcp/credentials.json` (created during auth)

## Need Help?

See `INSTALLATION_STEPS.md` for detailed instructions and troubleshooting.

