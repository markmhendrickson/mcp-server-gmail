# Installing Gmail MCP Server in Repo

The Gmail MCP server is installed in the repo's `mcp/gmail/` directory as a git submodule.

## Installation Steps

1. **Initialize the submodule:**
   ```bash
   cd /Users/markmhendrickson/repos/personal
   git submodule update --init mcp/gmail
   ```

   Or if the submodule isn't configured yet, clone directly:
   ```bash
   cd /Users/markmhendrickson/repos/personal/mcp/gmail
   git clone https://github.com/markmhendrickson/mcp-server-gmail.git .
   ```

2. **Install dependencies and build:**
   
   This is a Node.js/TypeScript project:
   ```bash
   cd /Users/markmhendrickson/repos/personal/mcp/gmail
   npm install
   npm run build
   ```

3. **Verify installation:**
   ```bash
   test -f dist/index.js && echo "✓ Server built successfully"
   ```

## Configuration

The wrapper script (`run-gmail-mcp.sh`) automatically:
- Loads environment variables from `.env` file
- Sets `GMAIL_OAUTH_PATH` to `.creds/gcp-oauth.keys.json` (repo)
- Sets `GMAIL_CREDENTIALS_PATH` to `.creds/gmail-credentials.json` (repo)
- Uses Node.js to run the server

All credentials and tokens are stored in the repo's `.creds/` directory, never in `~/.local/`.
