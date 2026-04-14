# 📁 Google Drive Integration Setup Guide

This guide will help you set up Google Drive file storage for placement documents and certificates.

## 📋 Prerequisites

- Google Cloud Project
- Service Account credentials (JSON key file)
- Google Drive API enabled

## 🔧 Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **Create Project** (or select an existing one)
3. Enter project name and click **Create**

## 🔐 Step 2: Enable Google Drive API

1. In the Google Cloud Console, go to **APIs & Services** → **Library**
2. Search for "Google Drive API"
3. Click on it and press **Enable**

## 🔑 Step 3: Create a Service Account

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **Service Account**
3. Fill in the service account details:
   - Service account name: `training-tracker-bot`
   - Service account ID: (auto-filled)
4. Click **Create and Continue**
5. Grant the following roles:
   - **Editor** (to read/write files to Google Drive)
6. Click **Continue** and then **Done**

## 🗝️ Step 4: Generate Service Account Key

1. In Credentials page, find your service account under **Service Accounts**
2. Click on the service account email
3. Go to the **Keys** tab
4. Click **Add Key** → **Create new key**
5. Select **JSON** format
6. Click **Create** (the key file will download automatically)

## 📎 Step 5: Create or Get a Google Drive Folder

1. Open [Google Drive](https://drive.google.com/)
2. Create a new folder named `training-tracker-files` (or use existing)
3. Right-click the folder → **Share**
4. Share it with your service account email (found in the JSON key file as `client_email`)
5. Give **Editor** permission
6. Note the Folder ID from the URL: `https://drive.google.com/drive/folders/{FOLDER_ID}`

## 🔒 Step 6: Configure Environment Variables

1. Open the downloaded JSON key file with a text editor
2. Copy the entire JSON content
3. Add to your `.env` file in the backend directory:

```bash
GOOGLE_CREDENTIALS='{"type":"service_account","project_id":"your-project-id",...}'
GOOGLE_DRIVE_FOLDER_ID=your_folder_id_here
```

**Important:** The entire JSON must be on a single line as a string value.

### Alternative (Easier) Method:
1. Base64 encode the JSON file
2. Add to `.env`:
```bash
GOOGLE_CREDENTIALS_B64=your_base64_encoded_credentials_here
```

## ✅ Step 7: Verify Setup

1. Restart the backend server:
```bash
npm start
```

2. Check console for message:
```
✅ Google Drive API initialized
```

3. Try uploading a test file from the candidate detail page

## 🐛 Troubleshooting

### "Google Drive not initialized"
- Check if `GOOGLE_CREDENTIALS` is properly set in `.env`
- Ensure the JSON is valid (no line breaks)
- Verify the service account email

### "Permission denied"
- Share the Google Drive folder with the service account email
- Ensure the service account has **Editor** permission

### "File type not allowed"
- Check the fileFilter in `routes/fileRoutes.js`
- Make sure the MIME type is in the allowedMimes array

### "Upload failed silently"
- Check browser console for errors
- Check server logs for detailed error messages

## 📝 Supported File Types

- **PDF**: `.pdf`
- **Word**: `.doc`, `.docx`
- **Excel**: `.xls`, `.xlsx`
- **Images**: `.jpg`, `.jpeg`, `.png`, `.gif`
- **Photoshop**: `.psd`

## 🔗 File Links

Files are stored in Google Drive with:
- **View Link**: Direct share link to view/download
- **Download Link**: Direct download link
- **File ID**: Stored in database for future reference

## 🚀 Production Considerations

1. **Folder Organization**: Create subfolders for each batch or year
2. **Access Control**: Use Google Drive sharing for sensitive files
3. **Backup**: Regularly backup Google Drive folder
4. **Quota**: Monitor API quota usage in Google Cloud Console
5. **Security**: Never commit `.env` file with credentials to Git

## 📞 Support

For more info on Google Drive API:
- [Google Drive API Documentation](https://developers.google.com/drive/api/guides/about-sdk)
- [Service Account Documentation](https://developers.google.com/identity/protocols/oauth2/service-account)
