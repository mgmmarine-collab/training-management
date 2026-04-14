import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import GoogleDriveSetup from '../components/GoogleDriveSetup';

export default function CandidateDetail() {
  const { id } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [uploadingPlacement, setUploadingPlacement] = useState(false);
  const [uploadingCertificate, setUploadingCertificate] = useState(false);
  const [placementFiles, setPlacementFiles] = useState(null);
  const [certificateFiles, setCertificateFiles] = useState(null);
  const [showGDriveSetup, setShowGDriveSetup] = useState(false);
  const [pendingUploadType, setPendingUploadType] = useState(null);

  useEffect(() => {
    // Fetch candidate data
    api.get(`/candidates/${id}`).then(r => {
      setCandidate(r.data);
      setEditData(r.data);
    });

    // Fetch all batches and courses for dropdowns
    api.get('/batches').then(r => setBatches(r.data)).catch(e => console.error('Error fetching batches:', e));
    api.get('/courses').then(r => setCourses(r.data)).catch(e => console.error('Error fetching courses:', e));
  }, [id]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await api.put(`/candidates/${id}`, editData);
      setCandidate(response.data);
      setIsEditing(false);
      setMessage('✅ Candidate updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ Error: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleUploadPlacement = async () => {
    if (!placementFiles || placementFiles.length === 0) {
      setMessage('❌ Please select files to upload');
      return;
    }

    setUploadingPlacement(true);
    try {
      const formData = new FormData();
      Array.from(placementFiles).forEach(file => {
        formData.append('files', file);
      });
      formData.append('fileType', 'placement');

      const response = await api.post(`/files/upload-placement/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setMessage(`✅ ${response.data.message}`);
      setPlacementFiles(null);
      // Refresh candidate data
      const updatedCandidate = await api.get(`/candidates/${id}`);
      setCandidate(updatedCandidate.data);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message;
      if (errorMsg.includes('Google Drive not configured')) {
        setMessage('⚠️ Google Drive needs to be set up. Please authorize and provide your folder ID.');
        setPendingUploadType('placement');
        setShowGDriveSetup(true);
      } else {
        setMessage('❌ Error: ' + errorMsg);
      }
    } finally {
      setUploadingPlacement(false);
    }
  };

  const handleUploadCertificate = async () => {
    if (!certificateFiles || certificateFiles.length === 0) {
      setMessage('❌ Please select files to upload');
      return;
    }

    setUploadingCertificate(true);
    try {
      const formData = new FormData();
      Array.from(certificateFiles).forEach(file => {
        formData.append('files', file);
      });

      const response = await api.post(`/files/upload-certificate/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setMessage(`✅ ${response.data.message}`);
      setCertificateFiles(null);
      // Refresh candidate data
      const updatedCandidate = await api.get(`/candidates/${id}`);
      setCandidate(updatedCandidate.data);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message;
      if (errorMsg.includes('Google Drive not configured')) {
        setMessage('⚠️ Google Drive needs to be set up. Please authorize and provide your folder ID.');
        setPendingUploadType('certificate');
        setShowGDriveSetup(true);
      } else {
        setMessage('❌ Error: ' + errorMsg);
      }
    } finally {
      setUploadingCertificate(false);
    }
  };

  if (!candidate)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading candidate profile...</p>
        </div>
      </div>
    );

  const getSalaryDisplay = (salary) => {
    if (!salary) return 'Not specified';
    return '₹' + salary.toLocaleString('en-IN') + ' LPA';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-6">
        {/* Back Button */}
        <Link to={`/batch/${candidate.batchId?._id}`} className="text-blue-600 hover:text-blue-800 text-sm font-semibold mb-4 inline-block">
          ← Back to Batch
        </Link>

        {/* Message */}
        {message && (
          <div className={`mb-4 p-4 rounded-lg ${message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}

        {/* Header Card */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-8 text-white shadow-lg mb-8 flex justify-between items-start">
          <div>
            <p className="text-blue-100 text-sm font-semibold mb-2">Candidate Profile</p>
            <h1 className="text-4xl font-bold mb-2">{candidate.name}</h1>
            <p className="text-blue-100">S.No: {candidate.sNo}</p>
          </div>
          <div className="flex gap-3 flex-wrap justify-end">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-white hover:bg-gray-100 text-blue-600 px-6 py-2 rounded-lg font-semibold transition-all"
              >
                ✏️ Edit
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold transition-all disabled:opacity-50"
                >
                  {loading ? '💾 Saving...' : '💾 Save'}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditData(candidate);
                  }}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg font-semibold transition-all"
                >
                  ❌ Cancel
                </button>
              </>
            )}
          </div>
        </div>

        {/* Editable Form */}
        {isEditing ? (
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Candidate Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={editData.name || ''}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Father's Name</label>
                <input
                  type="text"
                  value={editData.fatherName || ''}
                  onChange={(e) => setEditData({ ...editData, fatherName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile</label>
                <input
                  type="text"
                  value={editData.mobile || ''}
                  onChange={(e) => setEditData({ ...editData, mobile: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={editData.email || ''}
                  onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Aadhar Number</label>
                <input
                  type="text"
                  value={editData.aadharNumber || ''}
                  onChange={(e) => setEditData({ ...editData, aadharNumber: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">ID Number</label>
                <input
                  type="text"
                  value={editData.idNumber || ''}
                  onChange={(e) => setEditData({ ...editData, idNumber: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Batch</label>
                <select
                  value={editData.batchId || ''}
                  onChange={(e) => setEditData({ ...editData, batchId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Batch</option>
                  {batches.map(batch => (
                    <option key={batch._id} value={batch._id}>{batch.batchName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Course</label>
                <select
                  value={editData.courseId || ''}
                  onChange={(e) => setEditData({ ...editData, courseId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Course</option>
                  {courses.map(course => (
                    <option key={course._id} value={course._id}>{course.courseName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Exam Status</label>
                <select
                  value={editData.examStatus || 'pending'}
                  onChange={(e) => setEditData({ ...editData, examStatus: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="pass">Pass</option>
                  <option value="fail">Fail</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Exam Score</label>
                <input
                  type="number"
                  value={editData.examScore || ''}
                  onChange={(e) => setEditData({ ...editData, examScore: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Certificate Status</label>
                <select
                  value={editData.certificateStatus || 'not_issued'}
                  onChange={(e) => setEditData({ ...editData, certificateStatus: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="not_issued">Not Issued</option>
                  <option value="issued">Issued</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Placed</label>
                <select
                  value={editData.isPlaced ? 'yes' : 'no'}
                  onChange={(e) => setEditData({ ...editData, isPlaced: e.target.value === 'yes' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Incentive</label>
                <select
                  value={editData.hasIncentive ? 'yes' : 'no'}
                  onChange={(e) => setEditData({ ...editData, hasIncentive: e.target.value === 'yes' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
              {editData.isPlaced && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Placement Date</label>
                    <input
                      type="date"
                      value={editData.placementDate ? editData.placementDate.split('T')[0] : ''}
                      onChange={(e) => setEditData({ ...editData, placementDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name</label>
                    <input
                      type="text"
                      value={editData.companyName || ''}
                      onChange={(e) => setEditData({ ...editData, companyName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Job Role</label>
                    <input
                      type="text"
                      value={editData.jobRole || ''}
                      onChange={(e) => setEditData({ ...editData, jobRole: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Salary (LPA)</label>
                    <input
                      type="number"
                      value={editData.salary || ''}
                      onChange={(e) => setEditData({ ...editData, salary: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                <textarea
                  value={editData.address || ''}
                  onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Personal Information */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">📋</span> Personal Information
                </h2>
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="text-xs font-semibold text-gray-600">Father's Name</label>
                    <p className="text-lg font-semibold text-gray-900 mt-1">{candidate.fatherName || 'Not provided'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="text-xs font-semibold text-gray-600">Mobile Number</label>
                    <p className="text-lg font-semibold text-gray-900 mt-1">{candidate.mobile || 'Not provided'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="text-xs font-semibold text-gray-600">Email</label>
                    <p className="text-lg font-semibold text-gray-900 mt-1">{candidate.email || 'Not provided'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="text-xs font-semibold text-gray-600">Aadhar Number</label>
                    <p className="text-lg font-semibold text-gray-900 mt-1">{candidate.aadharNumber || 'Not provided'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="text-xs font-semibold text-gray-600">ID Number</label>
                    <p className="text-lg font-semibold text-gray-900 mt-1">{candidate.idNumber || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {/* Education Information */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">🎓</span> Education
                </h2>
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                    <label className="text-xs font-semibold text-gray-600">Batch</label>
                    <p className="text-lg font-semibold text-gray-900 mt-1">{candidate.batchId?.batchName || 'Not assigned'}</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
                    <label className="text-xs font-semibold text-gray-600">Course</label>
                    <p className="text-lg font-semibold text-gray-900 mt-1">{candidate.courseId?.courseName || 'Not assigned'}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                    <label className="text-xs font-semibold text-gray-600">Exam Score</label>
                    <p className="text-lg font-semibold text-gray-900 mt-1">{candidate.examScore ? `${candidate.examScore}%` : 'Not taken'}</p>
                  </div>
                </div>
              </div>

              {/* Status Overview */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">✅</span> Status Overview
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <span className="text-sm font-semibold text-gray-700">Exam Status</span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        candidate.examStatus === 'pass'
                          ? 'bg-green-100 text-green-700'
                          : candidate.examStatus === 'fail'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {candidate.examStatus?.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <span className="text-sm font-semibold text-gray-700">Certificate</span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        candidate.certificateStatus === 'issued'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {candidate.certificateStatus === 'issued' ? '✓ ISSUED' : 'PENDING'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
                    <span className="text-sm font-semibold text-gray-700">Placement</span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        candidate.isPlaced ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {candidate.isPlaced ? '✓ PLACED' : 'UNPLACED'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                    <span className="text-sm font-semibold text-gray-700">Incentive</span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        candidate.hasIncentive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {candidate.hasIncentive ? '✓ YES' : 'NO'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Placement Information */}
            {candidate.isPlaced && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 shadow-lg mb-8 border-l-4 border-green-500">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="text-3xl mr-3">💼</span> Placement Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-4 shadow">
                <label className="text-xs font-semibold text-gray-600">Company Name</label>
                <p className="text-xl font-bold text-green-700 mt-2">{candidate.companyName}</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow">
                <label className="text-xs font-semibold text-gray-600">Job Role</label>
                <p className="text-xl font-bold text-green-700 mt-2">{candidate.jobRole}</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow">
                <label className="text-xs font-semibold text-gray-600">Salary Package</label>
                <p className="text-xl font-bold text-green-700 mt-2">{getSalaryDisplay(candidate.salary)}</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow">
                <label className="text-xs font-semibold text-gray-600">Placement Date</label>
                <p className="text-xl font-bold text-green-700 mt-2">
                  {candidate.placementDate ? new Date(candidate.placementDate).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Placement Files Upload & Display */}
        {candidate.isPlaced && (
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="text-3xl mr-3">📄</span> Placement Documents
            </h2>
            
            {/* Upload Section */}
            <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-dashed border-blue-300">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Upload Pay Slip & Certificate (PDF, Word, Excel, Image, PSD)</label>
              <div className="flex items-center gap-4 flex-wrap">
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.psd"
                  onChange={(e) => setPlacementFiles(e.target.files)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                />
                <button
                  onClick={handleUploadPlacement}
                  disabled={uploadingPlacement || !placementFiles}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-all disabled:opacity-50"
                >
                  {uploadingPlacement ? '⏳ Uploading...' : '📤 Upload'}
                </button>
              </div>
              {placementFiles && <p className="text-xs text-gray-600 mt-2">Selected: {placementFiles.length} file(s)</p>}
            </div>

            {/* Placement Files Display */}
            {candidate.placementFiles && candidate.placementFiles.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Uploaded Documents</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {candidate.placementFiles.map((file, idx) => (
                    <div key={idx} className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border-l-4 border-blue-500">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="text-sm font-bold text-gray-900 truncate">{file.fileName}</p>
                          <p className="text-xs text-gray-600 mt-1">
                            {file.fileType === 'placement' ? 'Placement Document' : file.fileType}
                          </p>
                        </div>
                        <span className="text-2xl">📎</span>
                      </div>
                      <p className="text-xs text-gray-600 mb-3">
                        Uploaded: {new Date(file.uploadedDate).toLocaleDateString()}
                      </p>
                      <a
                        href={file.downloadLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all"
                      >
                        🔗 View/Download
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Certificate Files Upload & Display */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="text-3xl mr-3">🏆</span> Certificate Documents
          </h2>
          
          {/* Upload Section */}
          <div className="mb-6 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-dashed border-purple-300">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Upload Training Certificate (PDF, Word, Excel, Image, PSD)</label>
            <div className="flex items-center gap-4 flex-wrap">
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.psd"
                onChange={(e) => setCertificateFiles(e.target.files)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
              />
              <button
                onClick={handleUploadCertificate}
                disabled={uploadingCertificate || !certificateFiles}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold transition-all disabled:opacity-50"
              >
                {uploadingCertificate ? '⏳ Uploading...' : '📤 Upload'}
              </button>
            </div>
            {certificateFiles && <p className="text-xs text-gray-600 mt-2">Selected: {certificateFiles.length} file(s)</p>}
          </div>

          {/* Certificate Files Display */}
          {candidate.certificateFiles && candidate.certificateFiles.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Uploaded Certificates</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {candidate.certificateFiles.map((file, idx) => (
                  <div key={idx} className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-xl p-4 border-l-4 border-purple-500">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-900 truncate">{file.fileName}</p>
                        <p className="text-xs text-gray-600 mt-1">Training Certificate</p>
                      </div>
                      <span className="text-2xl">📜</span>
                    </div>
                    <p className="text-xs text-gray-600 mb-3">
                      Uploaded: {new Date(file.uploadedDate).toLocaleDateString()}
                    </p>
                    <a
                      href={file.downloadLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all"
                    >
                      🔗 View/Download
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {candidate.hasIncentive && candidate.incentiveStages && candidate.incentiveStages.length > 0 && (
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="text-3xl mr-3">💰</span> Government Incentive Stages
            </h2>
            <div className="space-y-3">
              {candidate.incentiveStages.map((stage, idx) => (
                <div
                  key={idx}
                  className={`relative flex items-start p-5 rounded-xl transition-all ${
                    stage.received
                      ? 'bg-green-50 border-l-4 border-green-500'
                      : 'bg-gray-50 border-l-4 border-gray-300'
                  }`}
                >
                  {/* Timeline connector */}
                  {idx < candidate.incentiveStages.length - 1 && (
                    <div className="absolute left-8 top-16 h-6 w-1 bg-gray-200"></div>
                  )}

                  {/* Circle indicator */}
                  <div
                    className={`flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center font-bold text-white mr-4 ${
                      stage.received ? 'bg-green-500' : 'bg-gray-400'
                    }`}
                  >
                    {idx + 1}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-gray-900">{stage.stageName}</h3>
                        <p className="text-sm text-gray-600 mt-1">Stage {stage.stageNumber}</p>
                      </div>
                      <span className={`text-lg font-bold ${stage.received ? 'text-green-600' : 'text-gray-600'}`}>
                        ₹{stage.amount?.toLocaleString('en-IN') || 0}
                      </span>
                    </div>
                    {stage.received && stage.receivedDate && (
                      <p className="text-xs text-green-600 font-semibold">
                        ✓ Received on {new Date(stage.receivedDate).toLocaleDateString()}
                      </p>
                    )}
                    {!stage.received && (
                      <p className="text-xs text-gray-500 font-semibold">⏳ Pending</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t-2 border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Total Incentive</span>
                <span className="text-2xl font-bold text-blue-600">
                  ₹{candidate.totalIncentiveAmount?.toLocaleString('en-IN') || 0}
                </span>
              </div>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-green-500 h-3 rounded-full transition-all"
                    style={{
                      width: `${
                        (candidate.incentiveStages.filter(s => s.received).length /
                          candidate.incentiveStages.length) *
                        100
                      }%`
                    }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  {candidate.incentiveStages.filter(s => s.received).length} of{' '}
                  {candidate.incentiveStages.length} stages received
                </p>
              </div>
            </div>
          </div>
        )}
            
            </>
        )}

        {/* Google Drive Setup Modal */}
        <GoogleDriveSetup 
          isOpen={showGDriveSetup}
          onClose={() => {
            setShowGDriveSetup(false);
            setPendingUploadType(null);
          }}
          onSuccess={async () => {
            // Retry upload after setup completes
            if (pendingUploadType === 'placement' && placementFiles) {
              await handleUploadPlacement();
            } else if (pendingUploadType === 'certificate' && certificateFiles) {
              await handleUploadCertificate();
            }
            setPendingUploadType(null);
          }}
        />
      </div>
    </div>
  );
}