import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function GoogleDriveSetup({ isOpen, onClose, onSuccess }) {
  const [step, setStep] = useState(1); // 1: Check status, 2: Authorize, 3: Enter folder ID
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [folderId, setFolderId] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (isOpen) {
      checkOAuthStatus();
    }
  }, [isOpen]);

  const checkOAuthStatus = async () => {
    try {
      const response = await api.get('/oauth/oauth-status');
      if (response.data.isAuthorized && response.data.isFolderConfigured) {
        setMessage('✅ Google Drive is already configured!');
        setTimeout(() => {
          onClose();
          onSuccess();
        }, 2000);
      } else if (response.data.isAuthorized) {
        setIsAuthorized(true);
        setStep(3); // Go to folder ID step
      } else {
        setStep(2); // Go to authorization step
      }
    } catch (error) {
      console.error('Error checking OAuth status:', error);
      setStep(2);
    }
  };

  const handleAuthorize = async () => {
    try {
      setLoading(true);
      const response = await api.get('/oauth/oauth-url');
      
      // Open authorization URL in a new window
      const authWindow = window.open(response.data.authUrl, 'google_auth', 'width=500,height=600');
      
      // Check if user completed OAuth flow
      const checkInterval = setInterval(async () => {
        try {
          const statusResponse = await api.get('/oauth/oauth-status');
          if (statusResponse.data.isAuthorized) {
            clearInterval(checkInterval);
            setIsAuthorized(true);
            setStep(3);
            authWindow?.close();
          }
        } catch (error) {
          console.error('Error checking status:', error);
        }
      }, 2000);

      // Stop checking after 5 minutes
      setTimeout(() => clearInterval(checkInterval), 300000);
    } catch (error) {
      setMessage('❌ Error: ' + error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSetFolderId = async () => {
    if (!folderId.trim()) {
      setMessage('❌ Please enter a valid Folder ID');
      return;
    }

    try {
      setLoading(true);
      await api.post('/oauth/set-folder-id', { folderId });
      setMessage('✅ Google Drive configured successfully!');
      setTimeout(() => {
        onClose();
        onSuccess();
      }, 2000);
    } catch (error) {
      setMessage('❌ Error: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">🚀 Setup Google Drive</h2>

        {message && (
          <div className={`p-3 rounded mb-4 ${message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}

        {/* Step 1: Authorize */}
        {step === 2 && (
          <div>
            <p className="text-gray-700 mb-4">
              Click the button below to authorize Google Drive access with your Gmail account.
            </p>
            <button
              onClick={handleAuthorize}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Authorizing...' : '✓ Authorize Google Drive'}
            </button>
          </div>
        )}

        {/* Step 2: Enter Folder ID */}
        {step === 3 && (
          <div>
            <p className="text-gray-700 mb-4">
              Enter your Google Drive folder ID where files will be uploaded:
            </p>
            <input
              type="text"
              value={folderId}
              onChange={(e) => setFolderId(e.target.value)}
              placeholder="e.g., 1HU4gIR3BSob1YIF0jn0UaWnOT2ncsNcE"
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
            />
            <p className="text-sm text-gray-500 mb-4">
              You can find this in your Google Drive folder URL: 
              <br />
              <code className="bg-gray-100 p-1">https://drive.google.com/drive/folders/FOLDER_ID</code>
            </p>
            <button
              onClick={handleSetFolderId}
              disabled={loading || !folderId.trim()}
              className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Setting up...' : '✓ Configure Folder'}
            </button>
          </div>
        )}

        {/* Step 3: Success or Loading */}
        {step === 1 && (
          <div className="text-center">
            <div className="inline-block animate-spin">⏳</div>
            <p className="text-gray-700 mt-4">Checking Google Drive configuration...</p>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full mt-4 text-gray-600 py-2 px-4 border border-gray-300 rounded hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
