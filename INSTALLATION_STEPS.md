# Gmail MCP Server - Installation Steps

## ✅ Completed Steps

1. ✅ Server installed and built
2. ✅ Security vulnerabilities fixed (0 vulnerabilities)
3. ✅ Rate limiting added
4. ✅ MCP configuration file created

## Next Steps

### Step 1: Update Cursor MCP Configuration

Copy the configuration from `CURSOR_CONFIG.json` to `~/.cursor/mcp.json`:

```bash
cp /Users/markmhendrickson/Projects/personal/mcp-servers/gmail/CURSOR_CONFIG.json ~/.cursor/mcp.json
```

Or manually edit `~/.cursor/mcp.json` and add:

```json
{
  "mcpServers": {
    "parquet": {
      "command": "python3",
      "args": [
        "/Users/markmhendrickson/Projects/personal/mcp-servers/parquet/parquet_mcp_server.py"
      ],
      "env": {}
    },
    "gmail": {
      "command": "node",
      "args": [
        "/Users/markmhendrickson/Projects/personal/mcp-servers/gmail/dist/index.js"
      ]
    }
  }
}
```

### Step 2: Set Up Google OAuth Credentials

1. **Create Google Cloud Project:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable the **Gmail API** for your project

2. **Create OAuth 2.0 Credentials:**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose **"Desktop app"** as application type
   - Give it a name (e.g., "Gmail MCP Server")
   - Click "Create"
   - Download the JSON file

3. **Place Credentials:**
   ```bash
   # Copy the downloaded JSON file to the Gmail MCP directory
   cp ~/Downloads/client_secret_*.json ~/.gmail-mcp/gcp-oauth.keys.json
   ```
   
   Or if you downloaded it with a different name:
   ```bash
   # Find the downloaded file
   ls -la ~/Downloads/*.json
   
   # Copy it (replace with actual filename)
   cp ~/Downloads/your-credentials-file.json ~/.gmail-mcp/gcp-oauth.keys.json
   ```

### Step 3: Authenticate

Run the authentication command:

```bash
cd /Users/markmhendrickson/Projects/personal/mcp-servers/gmail
node dist/index.js auth
```

This will:
- Open your browser for Google authentication
- Ask for Gmail permissions
- Save credentials to `~/.gmail-mcp/credentials.json`

### Step 4: Restart Cursor

1. Close Cursor completely
2. Reopen Cursor
3. The Gmail MCP server should now be available

### Step 5: Verify Installation

Test the Gmail MCP server by asking Cursor:
- "List my Gmail labels"
- "Search for emails from last week"
- "Show me unread emails"

## Troubleshooting

### OAuth Keys Not Found
- Make sure `gcp-oauth.keys.json` is in `~/.gmail-mcp/`
- Check file permissions: `chmod 600 ~/.gmail-mcp/gcp-oauth.keys.json`

### Authentication Fails
- Make sure Gmail API is enabled in Google Cloud Console
- Check that you're using "Desktop app" credentials (not Web application)
- Verify the JSON file format is correct

### MCP Server Not Available
- Check Cursor logs for errors
- Verify Node.js path: `which node`
- Verify the server file exists: `ls -la /Users/markmhendrickson/Projects/personal/mcp-servers/gmail/dist/index.js`
- Try running manually: `node /Users/markmhendrickson/Projects/personal/mcp-servers/gmail/dist/index.js`

### Port 3000 Already in Use
- The OAuth callback uses port 3000
- If another service is using it, stop that service or modify the code to use a different port

## Files Created

- `~/.cursor/mcp.json` - Cursor MCP configuration
- `~/.gmail-mcp/gcp-oauth.keys.json` - OAuth client credentials (you need to add this)
- `~/.gmail-mcp/credentials.json` - OAuth tokens (created during authentication)

## Security Notes

- OAuth credentials are stored in `~/.gmail-mcp/` (not in git)
- Credentials have restricted permissions (Gmail modify and settings)
- Tokens are stored locally and encrypted by Google's auth library

