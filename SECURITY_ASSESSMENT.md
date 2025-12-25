# Gmail MCP Server - Security Assessment

**Date:** 2025-01-22  
**Repository:** https://github.com/GongRzhe/Gmail-MCP-Server  
**Version:** 1.1.11

## Executive Summary

The Gmail MCP Server is a reputable, well-maintained project (870 stars, 238 forks) that provides Gmail integration via Model Context Protocol. After installation and security review, several vulnerabilities were identified in dependencies, with some automatically fixed. The codebase shows good security practices overall, but has some areas for improvement.

## Dependency Vulnerabilities

### Fixed Automatically
- ✅ **body-parser 2.2.0** (moderate) - DoS vulnerability - FIXED
- ✅ **form-data 4.0.0-4.0.3** (critical) - Unsafe random function - FIXED  
- ✅ **jws 4.0.0** (high) - HMAC signature verification - FIXED
- ✅ **nodemailer <=7.0.10** (moderate) - Multiple DoS vulnerabilities - FIXED
- ✅ **@modelcontextprotocol/sdk <1.24.0** (high) - DNS rebinding protection - FIXED (upgraded to 1.25.1)

### Remaining Vulnerabilities

#### 1. ai <=5.0.51 (MODERATE)
- **Issue:** Filetype whitelist bypass when uploading files
- **Fix Available:** No
- **Risk:** Low - Only used by mcp-evals (dev dependency, not used in production)
- **Recommendation:** Monitor for updates, consider removing mcp-evals if not needed
- **Reference:** https://github.com/advisories/GHSA-rwvc-j5jr-mgvh

#### 2. jsondiffpatch <0.7.2 (MODERATE)
- **Issue:** Cross-site Scripting (XSS) via HtmlFormatter::nodeBegin
- **Fix Available:** No
- **Risk:** Low - Only used by ai package (dev dependency)
- **Recommendation:** Monitor for updates
- **Reference:** https://github.com/advisories/GHSA-33vc-wjfv

## Code Security Review

### ✅ Good Security Practices

1. **Credential Storage**
   - OAuth credentials stored in `~/.gmail-mcp/` (user home directory)
   - Credentials file excluded from git via `.gitignore`
   - Uses standard Google OAuth2 flow

2. **Input Validation**
   - Email addresses validated with regex before sending
   - Zod schemas used for input validation
   - File existence checks before processing attachments

3. **Error Handling**
   - Proper try-catch blocks
   - Error messages don't expose sensitive information

4. **OAuth Implementation**
   - Uses official `google-auth-library`
   - Proper OAuth2 scopes: `gmail.modify`, `gmail.settings.basic`
   - Offline access for token refresh

### ⚠️ Security Concerns

1. **Path Traversal Risk (FIXED)**
   - **Location:** `src/index.ts:1130-1165` (download_attachment), `src/utl.ts:117-128` (attachments)
   - **Issue:** File paths for attachments and downloads not fully validated
   - **Status:** ✅ **FIXED** - Added path normalization, validation, and sanitization
   - **Implementation:**
     - Path normalization using `path.normalize()` and `path.resolve()`
     - Validation that paths are within current working directory
     - Filename sanitization to prevent path traversal
     - Directory existence checks before file operations

2. **Random Boundary Generation (LOW)**
   - **Location:** `src/utl.ts:36`
   - **Issue:** Uses `Math.random()` for email boundary (not cryptographically secure)
   - **Risk:** Very low - email boundaries don't require cryptographic security
   - **Status:** Acceptable for this use case

3. **OAuth Callback Port (LOW)**
   - **Location:** `src/index.ts:128, 148`
   - **Issue:** Hardcoded port 3000 for OAuth callback
   - **Risk:** Port conflict if another service uses port 3000
   - **Recommendation:** Add port conflict detection or make configurable

4. **No Rate Limiting (MEDIUM)**
   - **Issue:** No rate limiting on Gmail API calls
   - **Risk:** Could hit Gmail API rate limits or abuse
   - **Recommendation:** Implement rate limiting for batch operations
   - **Note:** Gmail API has built-in rate limits, but client-side limiting is still recommended

5. **Email Content Sanitization (LOW)**
   - **Issue:** No sanitization of email body content
   - **Risk:** Low - Gmail API handles content safely
   - **Recommendation:** Consider HTML sanitization if allowing user-provided HTML

6. **Attachment Size Limits (FIXED)**
   - **Issue:** No explicit size limits on attachments
   - **Status:** ✅ **FIXED** - Added size validation:
     - 25MB limit per email (Gmail limit)
     - 50MB limit for individual attachment downloads
     - Maximum 5 attachments per email
     - File size checks before processing

## Recommendations

### Immediate Actions
1. ✅ **DONE:** Fixed auto-fixable vulnerabilities
2. ✅ **DONE:** Upgraded `@modelcontextprotocol/sdk` to 1.25.1 (fixed breaking change)
3. ✅ **DONE:** Added path validation for file operations
4. ✅ **DONE:** Added attachment size validation

### Medium Priority
1. ⚠️ **CONSIDER:** Add rate limiting for batch operations (Gmail API has built-in limits)
2. ✅ **DONE:** Attachment size validation implemented
3. ⚠️ **CONSIDER:** Make OAuth callback port configurable (low priority)

### Low Priority
1. Add HTML sanitization for user-provided content
2. Monitor dependency updates for ai and jsondiffpatch
3. Consider removing mcp-evals if not used

## Security Configuration

### Credential Storage
- **Location:** `~/.gmail-mcp/`
- **Files:**
  - `gcp-oauth.keys.json` - OAuth client credentials
  - `credentials.json` - OAuth tokens (auto-generated)
- **Permissions:** Should be 600 (owner read/write only)

### Environment Variables
- `GMAIL_OAUTH_PATH` - Override OAuth keys file path
- `GMAIL_CREDENTIALS_PATH` - Override credentials file path

## Conclusion

The Gmail MCP Server is **suitable for use** with the following considerations:

1. **Dependencies:** Most critical vulnerabilities fixed. Remaining issues are in dev dependencies or require breaking changes.
2. **Code Quality:** Good overall, with minor improvements recommended for path validation.
3. **OAuth Security:** Properly implemented using official Google libraries.
4. **Risk Level:** **LOW to MEDIUM** - Suitable for personal use and controlled environments.

### Usage Recommendations

1. Keep dependencies updated regularly
2. Review and test before upgrading `@modelcontextprotocol/sdk`
3. Monitor Gmail API usage to avoid rate limits
4. Store credentials securely (already handled by default)
5. Consider adding path validation if processing untrusted file paths

## References

- [npm audit report](./npm-audit-report.txt)
- [GitHub Security Advisories](https://github.com/advisories)
- [Gmail API Documentation](https://developers.google.com/gmail/api)
- [OAuth 2.0 Security Best Practices](https://oauth.net/2/oauth-security/)

