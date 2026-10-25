# Dependency Remediation Plan

**Date:** October 25, 2026  
**Status:** Planned (Do NOT apply yet — to be executed in subsequent phases)

This document outlines the step-by-step remediation plan for outdated, vulnerable, and alpha dependencies identified during the baseline audit across `server/` and `client/`.

---

## 1. `xlsx` (Client)

### Current State
- **File:** `client/package.json` (`"xlsx": "^0.18.5"`)
- **Usage:** `client/src/utils/exportUtils.js` (function `exportOrdersToExcel`)
- **Vulnerabilities:**
  - [GHSA-4r6h-8v6p-xvw6](https://github.com/advisories/GHSA-4r6h-8v6p-xvw6): Prototype Pollution in SheetJS
  - [GHSA-5pgg-2g8v-p4x9](https://github.com/advisories/GHSA-5pgg-2g8v-p4x9): Regular Expression Denial of Service (ReDoS)
- **Problem:** SheetJS stopped publishing updates to public npm after `0.18.5`.

### Remediation Options
#### Option A: Replace with `exceljs` (Recommended)
`exceljs` is actively maintained, fully supports browser/client environments, has no critical vulnerabilities, and avoids non-standard registry dependencies.

1. **Commands:**
   ```bash
   cd client
   npm uninstall xlsx
   npm install exceljs
   ```

2. **Code Migration (`client/src/utils/exportUtils.js`):**
   ```javascript
   // Replace:
   // import * as XLSX from 'xlsx';

   // With:
   import ExcelJS from 'exceljs';

   export const exportOrdersToExcel = async (orders, filename = 'countryside-craft-orders.xlsx') => {
     const rows = orders.map((o) => ({
       'Order #': o.orderNumber || o._id,
       Date: o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-IN') : '',
       Customer: o.shippingAddress?.fullName || 'Guest',
       Phone: o.shippingAddress?.phone || '',
       City: o.shippingAddress?.city || '',
       State: o.shippingAddress?.state || '',
       PIN: o.shippingAddress?.pincode || '',
       Items: o.items?.map((i) => `${i.name} (x${i.quantity})`).join(', ') || '',
       'Total (INR)': o.total || 0,
       'Payment Method': o.paymentMethod || '',
       'Payment Status': o.paymentStatus || '',
       'Order Status': o.status || '',
     }));

     const workbook = new ExcelJS.Workbook();
     const worksheet = workbook.addWorksheet('Orders');

     if (rows.length > 0) {
       worksheet.columns = Object.keys(rows[0]).map((key) => ({
         header: key,
         key: key,
         width: 18,
       }));
       worksheet.addRows(rows);
       // Style header row
       worksheet.getRow(1).font = { bold: true };
     }

     const buffer = await workbook.xlsx.writeBuffer();
     const blob = new Blob([buffer], {
       type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
     });
     const url = window.URL.createObjectURL(blob);
     const anchor = document.createElement('a');
     anchor.href = url;
     anchor.download = filename;
     anchor.click();
     window.URL.revokeObjectURL(url);
   };
   ```

#### Option B: Official SheetJS Tarball (Alternative)
If maintaining exact SheetJS API parity is preferred:
```bash
cd client
npm uninstall xlsx
npm install https://cdn.sheetjs.com/xlsx-0.20.3/xlsx-0.20.3.tgz
```

---

## 2. `multer` (Server)

### Current State
- **File:** `server/package.json` (`"multer": "^1.4.5-lts.1"`)
- **Usage:** `server/src/middlewares/upload.middleware.js`
- **Vulnerabilities:** Multer 1.x is officially deprecated due to unpatched denial-of-service vectors in underlying multipart stream parsing.

### Remediation Plan
1. **Commands:**
   ```bash
   cd server
   npm install multer@^2.0.0-rc.4 file-type
   ```

2. **Code Migration (`server/src/middlewares/upload.middleware.js`):**
   - Upgrade multer configuration to handle storage buffers.
   - Add magic-byte file signature validation using `file-type` to verify file headers match allowed types (prevent renaming `.exe` to `.png`).
   - Constrain file size limits from 50 MB to 5 MB for images / 20 MB for video.

---

## 3. `json2csv` (Server)

### Current State
- **File:** `server/package.json` (`"json2csv": "^6.0.0-alpha.2"`)
- **Usage:** `server/src/services/export.service.js`
- **Issues:**
  - Alpha dependency (`^6.0.0-alpha.2`) with unsupported API deprecations.
  - Vulnerable to CSV Formula Injection if customer fields start with `=`, `+`, `-`, `@`.

### Remediation Plan
1. **Commands:**
   ```bash
   cd server
   npm uninstall json2csv
   npm install @json2csv/plainjs
   ```

2. **Code Migration (`server/src/services/export.service.js`):**
   ```javascript
   // Replace:
   // const { Parser } = require('json2csv');

   // With:
   const { Parser } = require('@json2csv/plainjs');

   // Formula injection sanitizer
   const sanitizeCell = (val) => {
     if (typeof val === 'string' && /^[=+\-@\t\r]/.test(val)) {
       return `'${val}`;
     }
     return val;
   };

   exports.generateOrdersCSV = (orders) => {
     const fields = [
       { label: 'Order #', value: 'orderNumber' },
       { label: 'Customer Name', value: (row) => sanitizeCell(row.customerName) },
       { label: 'Phone', value: (row) => sanitizeCell(row.phone) },
       { label: 'Address', value: (row) => sanitizeCell(row.address) },
       { label: 'City', value: (row) => sanitizeCell(row.city) },
       { label: 'Pincode', value: (row) => sanitizeCell(row.pincode) },
       { label: 'Total (₹)', value: 'total' },
       { label: 'Payment Method', value: 'paymentMethod' },
       { label: 'Payment Status', value: 'paymentStatus' },
       { label: 'Order Status', value: 'status' },
       { label: 'Date', value: 'date' },
     ];

     const parser = new Parser({ fields });
     return parser.parse(orders);
   };
   ```

---

## 4. `proxy-addr`, `body-parser`, `qs` & `express` (Server)

### Current State
- `proxy-addr` 2.0.7: Critical IP spoofing vulnerability ([GHSA-jqcg-44mw-7w3h](https://github.com/advisories/GHSA-jqcg-44mw-7w3h)).
- `body-parser` <= 1.20.8: High DoS vulnerability ([GHSA-27r3-jxmh-p828](https://github.com/advisories/GHSA-27r3-jxmh-p828)).
- `qs` 6.13.0: Array limit bypass and DoS.

### Remediation Plan
1. **Update express and direct dependencies:**
   ```bash
   cd server
   npm install express@4.22.3
   npm audit fix
   ```
2. Verify with `npm audit` that all 4 critical/high transitive issues are resolved.

---

## 5. `joi` (Server)

### Current State
- `joi@17.13.6`: Prototype replacement ([GHSA-wr44-6hxh-3jwq](https://github.com/advisories/GHSA-wr44-6hxh-3jwq)) and ReDoS ([GHSA-6h2x-m376-mqjq](https://github.com/advisories/GHSA-6h2x-m376-mqjq)).

### Remediation Plan
1. **Command:**
   ```bash
   cd server
   npm install joi@17.13.8
   ```

---

## 6. `vite` (Client)

### Current State
- `vite@6.4.3`: Windows command injection and path traversal advisories.

### Remediation Plan
1. **Command:**
   ```bash
   cd client
   npm install vite@^6.4.5
   ```

---

## Summary of Verification Checks After Applying

1. Run `npm audit` in `server/` (Target: 0 critical, 0 high).
2. Run `npm audit` in `client/` (Target: 0 critical, 0 high).
3. Run `npm run lint` in both `client/` and `server/` (Must exit code 0).
4. Run `npm test` in both `client/` and `server/` (Must exit code 0).
5. Verify order export in Admin UI (both CSV and Excel).
