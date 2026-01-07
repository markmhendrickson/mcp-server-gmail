#!/bin/bash
# Wrapper script for Gmail MCP server that ensures node is available
# This script sources nvm to make node available even when PATH doesn't include it

# Source nvm if it exists
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Run the MCP server
exec node "$SCRIPT_DIR/dist/index.js" "$@"

