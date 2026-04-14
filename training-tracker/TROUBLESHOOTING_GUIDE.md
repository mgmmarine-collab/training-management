# Troubleshooting & Common Issues Guide

**This document covers common errors and their solutions**

---

## 🔴 Critical Errors

### Error 1: MongoDB Connection Failed

**Symptoms:**
```
MongooseError: Cannot connect to MongoDB
Error: connect ENOTFOUND cluster0.kqfa7vu.mongodb.net
```

**Solutions:**
1. Verify MongoDB URI in `.env`
   ```bash
   MONGO_URI=mongodb+srv://MGM:Vishnuap1%40@cluster0.kqfa7vu.mongodb.net/training_db
   ```

2. Check MongoDB Atlas IP Whitelist:
   - Login to MongoDB Atlas
   - Cluster → Network Access
   - Add your IP address (or 0.0.0.0/0 for development)

3. Test connection:
   ```bash
   node -e "
   require('dotenv').config();
   const mongoose = require('mongoose');
   mongoose.connect(process.env.MONGO_URI)
     .then(() => console.log('✅ Connected'))
     .catch(e => console.log('❌ Error:', e.message));
   "
   ```

4. Verify password encoding:
   - Special characters in password must be URL-encoded
   - Use MongoDB Atlas connection string generator
   - Example: `@` becomes `%40`

**Prevention:**
- Use strong, stable MongoDB connection
- Keep IP whitelist updated
- Test connection before deploying

---

### Error 2: Port Already in Use

**Symptoms:**
```
EADDRINUSE: address already in use :::5000
EADDRINUSE: address already in use :::5173
```

**Solutions:**
1. Kill process using port:
   ```bash
   # Linux/Mac:
   lsof -ti:5000 | xargs kill -9
   lsof -ti:5173 | xargs kill -9
   
   # Windows (PowerShell):
   Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process
   ```

2. Change port in .env:
   ```bash
   PORT=5001  # Changed from 5000
   ```

3. Change Vite port in `frontend/vite.config.js`:
   ```javascript
   export default defineConfig({
     plugins: [react()],
     server: {
       port: 5174
     }
   })
   ```

**Prevention:**
- Check which port is free: `netstat -tlnp | grep :5000`
- Use dynamic port assignment in environment

---

### Error 3: Module Not Found

**Symptoms:**
```
Error: Cannot find module 'jsonwebtoken'
Error: Cannot find module 'multer'
Error: Cannot find module 'exceljs'
```

**Solutions:**
1. Install missing dependencies:
   ```bash
   cd backend
   npm install jsonwebtoken@9.0.2 multer@1.4.4 exceljs@4.3.0 pdfkit@0.13.0
   ```

2. Verify package.json has dependencies
3. Delete node_modules and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

4. Check Node version:
   ```bash
   node --version  # Should be v14+
   ```

**Prevention:**
- Always run `npm install` after cloning
- Check package.json matches needed versions
- Use `npm ci` for production deployments

---

## 🟠 Functional Errors

### Error 4: CORS Error

**Symptoms:**
```
Access to XMLHttpRequest blocked by CORS policy
Origin 'http://localhost:5173' not allowed
```

**Solutions:**
1. CORS is enabled in server.js, verify:
   ```javascript
   const cors = require('cors');
   app.use(cors());
   ```

2. Check API base URL in `frontend/src/api/axios.js`:
   ```javascript
   const api = axios.create({ baseURL: 'http://localhost:5000/api' });
   ```

3. If issue persists, expand CORS options:
   ```javascript
   app.use(cors({
     origin: ['http://localhost:5173', 'http://localhost:5174'],
     credentials: true
   }));
   ```

**Prevention:**
- Test API endpoints directly with cURL
- Check browser console for CORS errors
- Use Postman for API testing without CORS restrictions

---

### Error 5: Authentication Token Errors

**Symptoms:**
```
401 Unauthorized: Invalid or expired token
Cannot read property 'split' of undefined
```

**Solutions:**
1. Verify token is stored in localStorage:
   ```javascript
   // Browser console:
   localStorage.getItem('adminToken')  // Should return a token
   ```

2. Check token format:
   - Should start with `eyJ` (JWT header)
   - Contains 3 parts separated by dots

3. Verify Bearer header format in axios:
   ```javascript
   // frontend/src/api/axios.js
   config.headers.Authorization = `Bearer ${token}`;
   ```

4. Check token expiration (can decode at jwt.io):
   ```javascript
   // Should have "exp" field ~24 hours in future
   ```

5. Clear localStorage and re-login:
   ```javascript
   localStorage.clear();
   // Then login again
   ```

**Prevention:**
- Save token immediately after login
- Test token with GET /api/auth/me
- Don't modify token manually

---

### Error 6: Candidate Edit Not Working

**Symptoms:**
```
PUT request returns 200 but data doesn't update
Form changes aren't saved
Empty form after Save
```

**Solutions:**
1. Verify handleSave function exists in CandidateDetail.jsx:
   ```javascript
   const handleSave = async () => {
     const response = await api.put(`/candidates/${id}`, editData);
     setCandidate(response.data);
     setIsEditing(false);
   };
   ```

2. Check edit state management:
   ```javascript
   const [isEditing, setIsEditing] = useState(false);
   const [editData, setEditData] = useState({});
   ```

3. Verify form inputs update editData:
   ```javascript
   <input
     value={editData.name || ''}
     onChange={(e) => setEditData({...editData, name: e.target.value})}
   />
   ```

4. Check API response:
   - Open DevTools → Network tab
   - Click Save
   - Check request body has updated values
   - Check response has updated data

5. Test PUT endpoint directly:
   ```bash
   curl -X PUT http://localhost:5000/api/candidates/CANDIDATE_ID \
     -H "Content-Type: application/json" \
     -d '{"name":"Updated Name"}'
   ```

**Prevention:**
- Test edit on each feature addition
- Use browser DevTools to inspect state
- Log handleSave function execution

---

### Error 7: Serial Number (sNo) Not Auto-Incrementing

**Symptoms:**
```
All candidates in batch have sNo=1
sNo doesn't increment sequentially
```

**Solutions:**
1. Verify pre-save hook in Candidate model:
   ```javascript
   candidateSchema.pre('save', async function() {
     if (!this.sNo && this.batchId) {
       const lastCandidate = await mongoose.model('Candidate')
         .findOne({ batchId: this.batchId })
         .sort({ sNo: -1 });
       this.sNo = lastCandidate ? lastCandidate.sNo + 1 : 1;
     }
   });
   ```

2. Verify batchId is set before saving:
   ```javascript
   // Backend - check POST body includes batchId
   ```

3. Test with MongoDB CLI:
   ```bash
   db.candidates.find({batchId: ObjectId("...")}).sort({sNo: 1})
   // Should show: 1, 2, 3, 4...
   ```

4. Clear and re-add candidates:
   - Delete candidates from batch
   - Re-add to test auto-increment

**Prevention:**
- Test auto-increment after model changes
- Always include batchId when creating candidates

---

## 🟡 Performance Issues

### Error 8: Slow Page Loading

**Symptoms:**
```
Dashboard takes > 5 seconds to load
Batch view is slow
Export takes > 20 seconds
```

**Solutions:**
1. Check database query performance:
   ```bash
   # MongoDB - check indexes
   db.candidates.getIndexes()
   db.batches.getIndexes()
   ```

2. Add indexes for common queries:
   ```javascript
   // backend/seed.js - add after connections:
   Candidate.collection.createIndex({ batchId: 1 });
   Batch.collection.createIndex({ status: 1 });
   ```

3. Optimize API responses:
   ```javascript
   // Limit initial load
   router.get('/batches', async (req, res) => {
     const batches = await Batch.find()
       .limit(100)
       .populate('courseId');
     res.json(batches);
   });
   ```

4. Enable response compression:
   ```javascript
   // backend/server.js
   const compression = require('compression');
   app.use(compression());
   ```

5. Check frontend rendering:
   - Open DevTools → Performance tab
   - Record page load
   - Check for unnecessary re-renders

**Prevention:**
- Monitor performance during development
- Test with large datasets (1000+ candidates)
- Profile regularly with DevTools

---

### Error 9: Export (Excel/PDF) Fails

**Symptoms:**
```
Error: Cannot create worksheet
PDF generation timeout
Export returns blank file
```

**Solutions:**
1. Verify ExcelJS version:
   ```bash
   npm ls exceljs
   # Should be 4.3.0
   ```

2. Test export manually:
   ```bash
   curl http://localhost:5000/api/export/batch-candidates-excel/BATCH_ID \
     -H "Authorization: Bearer TOKEN" \
     -o test.xlsx
   # Check file size > 0
   ```

3. Check file headers are set:
   ```javascript
   res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
   res.setHeader('Content-Disposition', 'attachment; filename=...xlsx');
   ```

4. Verify large datasets:
   - Limit candidates per export (max 5000)
   - Add pagination for large batches

5. Check disk space:
   - Server needs space to generate files
   - Clean temp files regularly

**Prevention:**
- Test export with various batch sizes
- Monitor server disk space
- Set export timeout limits

---

## 🟢 Configuration Issues

### Error 10: Google Drive Not Configured

**Symptoms:**
```
Error: Google Drive not configured
Error: Missing folder ID
```

**Solutions:**
1. Verify .env has Google credentials:
   ```bash
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   GOOGLE_DRIVE_FOLDER_ID=...
   ```

2. Get credentials from Google Cloud:
   - Go to Google Cloud Console
   - Create OAuth 2.0 credentials
   - Download JSON keys
   - Extract values to .env

3. Create Google Drive folder:
   - Create folder in Drive
   - Copy folder ID from URL: `drive.google.com/drive/folders/FOLDER_ID`
   - Add to .env: `GOOGLE_DRIVE_FOLDER_ID=FOLDER_ID`

4. Test OAuth flow:
   - Go to `/api/oauth/oauth-url` (returns auth link)
   - Authorize application
   - Should get callback with code

5. If file upload fails with "not configured":
   - Re-authorize in admin panel
   - Verify folder ID is valid
   - Check OAuth tokens not expired

**Prevention:**
- Test Google Drive integration early
- Monitor OAuth token expiration
- Backup files locally as well

---

## 🟣 Data Issues

### Error 11: Duplicate Records

**Symptoms:**
```
Candidate appears twice in database
Same batch listed multiple times
```

**Solutions:**
1. Use MongoDB unique indexes:
   ```javascript
   // models/Admin.js
   adminSchema.index({ username: 1 }, { unique: true });
   ```

2. Check for race conditions:
   - Ensure API calls are sequential
   - Add loading states to prevent double-submit

3. Deduplicate existing data:
   ```bash
   # MongoDB CLI:
   db.candidates.aggregate([
     { $match: { name: "John Doe" } },
     { $count: "count" }
   ])
   ```

4. Enable write concern:
   ```javascript
   const options = { writeConcern: { w: 'majority' } };
   ```

**Prevention:**
- Add client-side validation
- Disable button during submission
- Monitor for duplicate IDs

---

### Error 12: Database Inconsistency

**Symptoms:**
```
Candidate references non-existent batch
Orphaned records in database
Referential integrity issues
```

**Solutions:**
1. Fix invalid references:
   ```javascript
   // Delete candidates with no batch
   db.candidates.deleteMany({ batchId: null })
   ```

2. Add pre-validation hooks:
   ```javascript
   candidateSchema.pre('save', async function() {
     if (this.batchId) {
       const batch = await Batch.findById(this.batchId);
       if (!batch) throw new Error('Invalid batch ID');
     }
   });
   ```

3. Backup database before cleanup:
   ```bash
   mongodump --uri="MONGO_URI" --out ./backup
   ```

4. Implement cascade delete:
   ```javascript
   // When deleting batch, delete candidates
   batchSchema.post('findByIdAndDelete', async function(doc) {
     await Candidate.deleteMany({ batchId: doc._id });
   });
   ```

**Prevention:**
- Validate references before saving
- Test delete operations
- Regular database maintenance
- Keep backups

---

## 📋 Testing & Debugging

### How to Debug: Browser Console

```javascript
// Check token:
localStorage.getItem('adminToken')

// Check admin data:
JSON.parse(localStorage.getItem('admin'))

// Check Axios configuration:
api.defaults.headers

// Monitor API calls:
fetch('http://localhost:5000/api/candidates')
  .then(r => r.json())
  .then(d => console.log(d))
```

### How to Debug: Backend

```javascript
// Add logging to authRoutes.js:
console.log('Register attempt:', username);
console.log('Login attempt:', username);

// Add logging to candidateRoutes.js:
console.log('Creating candidate:', req.body);
console.log('Updating candidate:', id, req.body);

// Add global error handler:
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});
```

### How to Debug: Network

**Using Postman:**
1. Create request: POST /api/auth/login
2. Set body: `{"username":"admin","password":"test123"}`
3. Send and check response
4. Copy token to Authorization header
5. Test other endpoints

**Using cURL:**
```bash
# Login
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"test"}' \
  | jq -r '.token')

# Use token
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/auth/me
```

---

## ✅ Verification Steps

Before reporting an issue:

1. ✅ Node version is v14+: `node --version`
2. ✅ npm install completed: `npm ls jsonwebtoken`
3. ✅ .env file configured: `cat .env`
4. ✅ MongoDB connected: Check backend logs
5. ✅ Ports available: `netstat -tlnp | grep 5000`
6. ✅ Frontend/backend both running: Open both URLs
7. ✅ No console errors: F12 → Console tab
8. ✅ API endpoints responding: Test with cURL
9. ✅ Token valid: jwt.io decode check
10. ✅ Database has data: MongoDB CLI check

---

## Getting Help

**Provide this information when asking for help:**

```markdown
**Error:**
[Exact error message]

**Steps to reproduce:**
1. ...
2. ...
3. ...

**Environment:**
- Node version: [output of node --version]
- npm version: [output of npm --version]
- OS: [Windows/Mac/Linux]
- Browser: [Chrome/Firefox/Safari]

**Logs:**
[Backend console output]
[Frontend console errors]
[Network tab errors]

**Attachments:**
- .env file (PASSWORD REMOVED)
- Error screenshots
- Network response
```

---

## Common Commands Reference

```bash
# Start services
npm run dev                    # Frontend/Backend dev

# Install dependencies
npm install                   # Install in current folder

# Database operations
node seed.js                 # Populate sample data
npm run db:backup            # Backup database

# Testing
npm test                     # Run tests (if configured)
npm run lint                 # Check code quality

# Build for production
npm run build                # Build frontend
npm run start                # Start production server

# Debugging
npm run debug               # Start with debugger
NODE_DEBUG=* npm run dev    # Verbose logging
```

---

## Final Checklist

- [ ] No "Cannot find module" errors
- [ ] MongoDB connection successful
- [ ] Frontend and backend both running
- [ ] Can login/register successfully
- [ ] Can add candidates and batches
- [ ] Edit functionality works
- [ ] Export functions work
- [ ] All buttons functional
- [ ] No console errors
- [ ] Mobile responsive

**If all checked:** System is ready! 🎉

---

**Last Updated:** 2026-04-10
**Version:** 1.0 - Production Ready
