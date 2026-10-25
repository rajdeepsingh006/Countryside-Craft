# Baseline Security & Dependency Audit

**Date:** October 25, 2026  
**Repository:** Countryside Craft (`server/` and `client/`)  
**Commit Reference:** `7bca7e2` (HEAD) / `b871068`  

---

## 🚨 ROTATE THESE (Action Items)

The following credentials and secrets require immediate rotation or verification prior to production launch:

1. **Admin Master Password (`admin` account)**:
   - **Reason:** Hardcoded plain-text password (`Admin@123456`) was committed to `server/src/seed.js` (commit `3ebd876`).
   - **Action:** If `npm run seed` was ever executed against the live or staging MongoDB instance, rotate the password immediately via admin dashboard or MongoDB shell. Remove the hardcoded password from `seed.js`.
2. **JWT Secrets (`JWT_ACCESS_SECRET` & `JWT_REFRESH_SECRET`)**:
   - **Reason:** Stored in plaintext in local uncommitted `.env`. Both secrets should be unique, cryptographically random strings of at least 64 bytes (`crypto.randomBytes(64).toString('hex')`).
   - **Action:** Generate new distinct secrets for access and refresh tokens.
3. **Razorpay Key Secret (`RAZORPAY_KEY_SECRET`)**:
   - **Reason:** Found in root `.env` and `server/.env`. If root `.env` or development environments were ever shared or pushed, rotate the Razorpay API Key & Secret in the Razorpay Dashboard.
4. **Cloudinary API Secret (`CLOUDINARY_API_SECRET`)**:
   - **Reason:** High-privilege secret permitting full asset manipulation/deletion in Cloudinary. Rotate if developer machines or staging bundles were shared.
5. **MongoDB Atlas Connection URI (`MONGO_URI`)**:
   - **Reason:** Contains cluster credentials. Verify IP allowlist restricts access strictly to production API servers rather than `0.0.0.0/0`. Rotate database user credentials.
6. **Session Cookie Secret (`SESSION_COOKIE_SECRET`)**:
   - **Reason:** Needs regeneration with a fresh 64-character random string.

---

## 1. Secret Scanning Findings

### Gitleaks Scan
- **Command:** `gitleaks detect --source . --redact --verbose` (v8.18.4)
- **Git Commit Objects Scanned:** 16 commits (`3ebd876` through `7bca7e2`).
- **Commits Result:** 0 leaks detected in git commit history objects.
- **Git log analysis (`git log -p -S... --all`):**
  - No active `.env` file was ever committed to git history (`reference/.env.example` and `server/.env.example` were committed with dummy template values).
  - Plain-text credentials found in commit `3ebd876`: `server/src/seed.js` lines 29–33 (`passwordHash: 'Admin@123456'`), WhatsApp phone number (`917009361881`), and mock UPI ID (`yourstorename@oksbi`).
  - No real Razorpay live secrets or MongoDB connection strings were committed to git history.

### Working Tree (Uncommitted) Analysis
- **`server/.env`**: Contains production/staging environment variables (`MONGO_URI`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `SESSION_COOKIE_SECRET`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `ADMIN_WHATSAPP_NUMBER`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`).
- **`client/.env`**: Contains `VITE_RAZORPAY_KEY_ID`.
- **`.env` (Repository Root)**: Redundant uncommitted file containing `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`. Must be removed from root to prevent accidental inclusion.

---

## 2. Server Dependency Audit (`server/`)

### Audit Summary: 8 vulnerabilities (1 Critical, 4 High, 3 Moderate)

| Package | Current Version | Severity | Advisory / CVE | Fix Available? | Impacted Dependencies / Notes |
|---|---|---|---|---|---|
| `proxy-addr` | 2.0.7 | **Critical** | [GHSA-jqcg-44mw-7w3h](https://github.com/advisories/GHSA-jqcg-44mw-7w3h): IP spoofing via IPv4-mapped IPv6 trust subnet | Yes (`npm audit fix`) | Transitive dependency via `express` |
| `body-parser` | <= 1.20.8 | **High** | [GHSA-27r3-jxmh-p828](https://github.com/advisories/GHSA-27r3-jxmh-p828): DoS via trailing bytes after compressed request body | Yes (`npm audit fix`) | Transitive dependency via `express` |
| `brace-expansion` | 4.0.0 - 5.0.11 | **High** | [GHSA-q2hr-2g5m-vwhr](https://github.com/advisories/GHSA-q2hr-2g5m-vwhr), [GHSA-qhr7-859c-m2p7](https://github.com/advisories/GHSA-qhr7-859c-m2p7), [GHSA-6j4f-fj2g-mc7p](https://github.com/advisories/GHSA-6j4f-fj2g-mc7p): Quadratic CPU expansion & stack exhaustion DoS | Yes (`npm audit fix`) | Transitive dependency |
| `follow-redirects` | 1.16.0 | **High** | [GHSA-q3jh-wrc6-jgq8](https://github.com/advisories/GHSA-q3jh-wrc6-jgq8), [GHSA-8r9p-f939-6h3c](https://github.com/advisories/GHSA-8r9p-f939-6h3c): Header bypass / sensitiveHeaders regex leak | Yes (`npm audit fix`) | Transitive dependency |
| `joi` | 17.13.6 | **High** | [GHSA-wr44-6hxh-3jwq](https://github.com/advisories/GHSA-wr44-6hxh-3jwq): Prototype replacement via `__proto__`, [GHSA-6h2x-m376-mqjq](https://github.com/advisories/GHSA-6h2x-m376-mqjq): ReDoS in `isoDate` | Yes (bump to `>=17.13.8`) | Direct dependency |
| `qs` | 6.13.0 | **Moderate** | [GHSA-x5fp-wj9c-mxmx](https://github.com/advisories/GHSA-x5fp-wj9c-mxmx): Array-limit bypass, [GHSA-4mjr-xmp4-gh2g](https://github.com/advisories/GHSA-4mjr-xmp4-gh2g): DoS via controlled `isBuffer` | Yes (`npm audit fix`) | Transitive dependency via `express` / `body-parser` |
| `morgan` | 1.11.0 | **Moderate** | [GHSA-jxfw-x594-9x9m](https://github.com/advisories/GHSA-jxfw-x594-9x9m): Log forging via unescaped Unicode separators, [GHSA-9f6g-j8ch-79g4](https://github.com/advisories/GHSA-9f6g-j8ch-79g4): Log injection | Yes (bump to `1.12.1`) | Direct dependency |
| `multer` | 1.4.5-lts.2 | **Deprecation / Security** | Deprecated upstream: Multer 1.x is impacted by DoS vulnerabilities. Upgrade to 2.x recommended. | Yes (migration to 2.x required) | Direct dependency |
| `json2csv` | 6.0.0-alpha.2 | **Stability / Maintenance** | Alpha release with potential unpatched edge cases; superseded by `@json2csv/plainjs`. | Yes (replace with stable `@json2csv/plainjs`) | Direct dependency |

### Server Outdated Packages (`npm outdated`)

| Package | Current | Wanted | Latest | Type | Action Planned |
|---|---|---|---|---|---|
| `bcryptjs` | 2.4.3 | 2.4.3 | 3.0.3 | Direct | Test v3 in later phase |
| `cloudinary` | 2.10.1 | 2.11.0 | 2.11.0 | Direct | Safe minor bump |
| `dotenv` | 16.6.1 | 16.6.1 | 18.0.9 | Direct | Keep 16.x or upgrade with env tests |
| `express` | 4.22.2 | 4.22.3 | 5.3.0 | Direct | Bump to 4.22.3 (resolves qs/body-parser/proxy-addr) |
| `express-rate-limit` | 7.5.1 | 7.5.1 | 8.7.1 | Direct | Safe minor update |
| `joi` | 17.13.6 | 17.13.8 | 18.3.0 | Direct | Bump to 17.13.8 |
| `mongoose` | 8.24.4 | 8.24.7 | 9.11.4 | Direct | Bump to 8.24.7 (patch) |
| `morgan` | 1.11.0 | 1.12.1 | 1.12.1 | Direct | Bump to 1.12.1 |
| `multer` | 1.4.5-lts.2 | 1.4.5-lts.2 | 2.5.0 | Direct | Migrate to 2.x per dependency plan |
| `uuid` | 11.1.1 | 11.1.1 | 14.0.3 | Direct | Stable on v11 |

---

## 3. Client Dependency Audit (`client/`)

### Audit Summary: 4 vulnerabilities (4 High)

| Package | Current Version | Severity | Advisory / CVE | Fix Available? | Impacted Dependencies / Notes |
|---|---|---|---|---|---|
| `xlsx` | 0.18.5 | **High** | [GHSA-4r6h-8v6p-xvw6](https://github.com/advisories/GHSA-4r6h-8v6p-xvw6): Prototype Pollution in SheetJS, [GHSA-5pgg-2g8v-p4x9](https://github.com/advisories/GHSA-5pgg-2g8v-p4x9): ReDoS | **No fix on public npm** | Direct dependency (`xlsx` abandoned on npm). Replace with `exceljs` or SheetJS official CDN tarball. |
| `vite` | 6.4.3 | **High** | [GHSA-698v-4r3x-3vcv](https://github.com/advisories/GHSA-698v-4r3x-3vcv), [GHSA-r825-w8mm-5pxw](https://github.com/advisories/GHSA-r825-w8mm-5pxw), [GHSA-587h-7wmj-h5pm](https://github.com/advisories/GHSA-587h-7wmj-h5pm), [GHSA-9jrq-w75r-8gcw](https://github.com/advisories/GHSA-9jrq-w75r-8gcw), [GHSA-rq7h-c2jc-7f22](https://github.com/advisories/GHSA-rq7h-c2jc-7f22): Launch editor arbitrary command execution & path traversal | Yes (`npm audit fix` / bump to `^6.4.5`) | Direct dependency |
| `follow-redirects` | 1.16.0 | **High** | [GHSA-q3jh-wrc6-jgq8](https://github.com/advisories/GHSA-q3jh-wrc6-jgq8), [GHSA-8r9p-f939-6h3c](https://github.com/advisories/GHSA-8r9p-f939-6h3c): Header bypass / sensitiveHeaders leak | Yes (`npm audit fix`) | Transitive via `axios` |
| `source-map-js` | 1.2.1 | **High** | [GHSA-68fv-2mgg-jv7q](https://github.com/advisories/GHSA-68fv-2mgg-jv7q): Event loop DoS via indexed section offsets | Yes (`npm audit fix`) | Transitive via `tailwindcss` / `postcss` |

### Client Outdated Packages (`npm outdated`)

| Package | Current | Wanted | Latest | Type | Action Planned |
|---|---|---|---|---|---|
| `@vitejs/plugin-react` | 5.2.0 | 5.2.0 | 6.1.2 | Direct | Upgrade with Vite 6/7 review |
| `lucide-react` | 0.546.0 | 0.546.0 | 1.61.0 | Direct | Safe icon library update |
| `motion` | 12.43.0 | 12.43.0 | 14.6.0 | Direct | Retain current v12 or test animations |
| `react` | 19.2.8 | 19.3.1 | 19.3.1 | Direct | Patch bump |
| `react-dom` | 19.2.8 | 19.3.1 | 19.3.1 | Direct | Patch bump |
| `vite` | 6.4.3 | 6.4.5 | 8.3.5 | Direct | Bump to 6.4.5 (resolves advisories) |
