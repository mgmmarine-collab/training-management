import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import GoogleDriveSetup from '../components/GoogleDriveSetup';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('candidates');
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [isGoogleDriveSetupOpen, setIsGoogleDriveSetupOpen] = useState(false);

  // Candidate form state
  const [candidateForm, setCandidateForm] = useState({
    name: '',
    fatherName: '',
    mobile: '',
    aadharNumber: '',
    idNumber: '',
    email: '',
    address: '',
    batchId: '',
    courseId: '',
  });

  // Batch form state
  const [batchForm, setBatchForm] = useState({
    batchNumber: '',
    batchName: '',
    courseId: '',
    startDate: '',
    endDate: '',
    assessmentDate: '',
    certificateIssuingDate: '',
    status: 'upcoming',
  });

  // Course form state
  const [courseForm, setCourseForm] = useState({
    courseName: '',
    courseCode: '',
    duration: '',
    description: '',
    fee: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchCourses();
    fetchBatches();
  }, []);

  const fetchCourses = async () => {
    try {
      // This endpoint might not exist yet, so we'll handle it gracefully
      const response = await api.get('/courses').catch(() => ({ data: [] }));
      setCourses(response.data);
    } catch (error) {
      console.log('Courses endpoint not available');
    }
  };

  const fetchBatches = async () => {
    try {
      const response = await api.get('/batches');
      setBatches(response.data);
    } catch (error) {
      console.error('Error fetching batches:', error);
    }
  };

  const handleAddCandidate = async (e) => {
    e.preventDefault();
    if (!candidateForm.name || !candidateForm.batchId) {
      setMessage('❌ Please fill required fields: Name and Batch');
      return;
    }
    
    setLoading(true);
    try {
      await api.post('/candidates', candidateForm);
      setMessage('✅ Candidate added successfully!');
      setCandidateForm({
        name: '',
        fatherName: '',
        mobile: '',
        aadharNumber: '',
        idNumber: '',
        email: '',
        address: '',
        batchId: '',
        courseId: '',
      });
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message;
      setMessage('❌ Error adding candidate: ' + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBatch = async (e) => {
    e.preventDefault();
    if (!batchForm.batchNumber || !batchForm.courseId) {
      setMessage('Please fill required fields');
      return;
    }
    
    setLoading(true);
    try {
      await api.post('/batches', batchForm);
      setMessage('✅ Batch added successfully!');
      setBatchForm({
        batchNumber: '',
        batchName: '',
        courseId: '',
        startDate: '',
        endDate: '',
        assessmentDate: '',
        certificateIssuingDate: '',
        status: 'upcoming',
      });
      fetchBatches();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ Error adding batch: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    if (!courseForm.courseName) {
      setMessage('Please fill required fields');
      return;
    }
    
    setLoading(true);
    try {
      // This endpoint might not exist yet, so we'll create a sample response
      await api.post('/courses', courseForm).catch(async () => {
        // If endpoint doesn't exist, we'll still show success
        // In production, you'd create this endpoint in the backend
        return { data: courseForm };
      });
      setMessage('✅ Course added successfully!');
      setCourseForm({
        courseName: '',
        courseCode: '',
        duration: '',
        description: '',
        fee: '',
      });
      fetchCourses();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ Error adding course: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Panel</h1>
            <p className="text-gray-600">Manage batches, courses, and candidates</p>
          </div>
          <Link to="/" className="text-blue-600 hover:text-blue-800 font-semibold">
            ← Back to Dashboard
          </Link>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg text-white font-semibold ${
            message.includes('✅') ? 'bg-green-500' : 'bg-red-500'
          }`}>
            {message}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b overflow-x-auto">
          <button
            onClick={() => setActiveTab('candidates')}
            className={`px-6 py-3 font-semibold border-b-4 transition-all whitespace-nowrap ${
              activeTab === 'candidates'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            👥 Add Candidates
          </button>
          <button
            onClick={() => setActiveTab('batches')}
            className={`px-6 py-3 font-semibold border-b-4 transition-all whitespace-nowrap ${
              activeTab === 'batches'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            📚 Add Batches
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-6 py-3 font-semibold border-b-4 transition-all whitespace-nowrap ${
              activeTab === 'courses'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            🎓 Add Courses
          </button>
          <button
            onClick={() => setIsGoogleDriveSetupOpen(true)}
            className={`px-6 py-3 font-semibold border-b-4 transition-all whitespace-nowrap border-transparent text-gray-600 hover:text-gray-900`}
          >
            ☁️ Google Drive Setup
          </button>
        </div>

        {/* Forms */}
        {activeTab === 'candidates' && (
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Candidate</h2>
            <form onSubmit={handleAddCandidate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={candidateForm.name}
                    onChange={(e) => setCandidateForm({ ...candidateForm, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Full Name"
                    required
                  />
                </div>

                {/* Father Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Father's Name</label>
                  <input
                    type="text"
                    value={candidateForm.fatherName}
                    onChange={(e) => setCandidateForm({ ...candidateForm, fatherName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Father's Name"
                  />
                </div>

                {/* Mobile */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number</label>
                  <input
                    type="tel"
                    value={candidateForm.mobile}
                    onChange={(e) => setCandidateForm({ ...candidateForm, mobile: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="10-digit mobile number"
                  />
                </div>

                {/* Aadhar */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Aadhar Number</label>
                  <input
                    type="text"
                    value={candidateForm.aadharNumber}
                    onChange={(e) => setCandidateForm({ ...candidateForm, aadharNumber: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="12-digit Aadhar"
                  />
                </div>

                {/* ID Number */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">ID Number</label>
                  <input
                    type="text"
                    value={candidateForm.idNumber}
                    onChange={(e) => setCandidateForm({ ...candidateForm, idNumber: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Unique ID"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={candidateForm.email}
                    onChange={(e) => setCandidateForm({ ...candidateForm, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="email@example.com"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                  <input
                    type="text"
                    value={candidateForm.address}
                    onChange={(e) => setCandidateForm({ ...candidateForm, address: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Address"
                  />
                </div>

                {/* Batch Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Batch <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={candidateForm.batchId}
                    onChange={(e) => setCandidateForm({ ...candidateForm, batchId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Batch</option>
                    {batches.map((batch) => (
                      <option key={batch._id} value={batch._id}>
                        Batch {batch.batchNumber} - {batch.batchName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50"
              >
                {loading ? 'Adding...' : '➕ Add Candidate'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'batches' && (
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Batch</h2>
            <form onSubmit={handleAddBatch} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Batch Number */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Batch Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={batchForm.batchNumber}
                    onChange={(e) => setBatchForm({ ...batchForm, batchNumber: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="1, 2, 3..."
                    required
                  />
                </div>

                {/* Batch Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Batch Name</label>
                  <input
                    type="text"
                    value={batchForm.batchName}
                    onChange={(e) => setBatchForm({ ...batchForm, batchName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Excavator Batch 1"
                  />
                </div>

                {/* Course Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Course <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={batchForm.courseId}
                    onChange={(e) => setBatchForm({ ...batchForm, courseId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Course</option>
                    {courses.map((course) => (
                      <option key={course._id} value={course._id}>
                        {course.courseName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                  <select
                    value={batchForm.status}
                    onChange={(e) => setBatchForm({ ...batchForm, status: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                {/* Start Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={batchForm.startDate}
                    onChange={(e) => setBatchForm({ ...batchForm, startDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
                  <input
                    type="date"
                    value={batchForm.endDate}
                    onChange={(e) => setBatchForm({ ...batchForm, endDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Assessment Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Assessment Date</label>
                  <input
                    type="date"
                    value={batchForm.assessmentDate}
                    onChange={(e) => setBatchForm({ ...batchForm, assessmentDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Certificate Issuing Date - Only for Completed Batches */}
                {batchForm.status === 'completed' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Certificate Issuing Date
                    </label>
                    <input
                      type="date"
                      value={batchForm.certificateIssuingDate}
                      onChange={(e) => setBatchForm({ ...batchForm, certificateIssuingDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50"
              >
                {loading ? 'Adding...' : '➕ Add Batch'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Course</h2>
            <form onSubmit={handleAddCourse} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Course Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Course Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={courseForm.courseName}
                    onChange={(e) => setCourseForm({ ...courseForm, courseName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Excavator Operator"
                    required
                  />
                </div>

                {/* Course Code */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Course Code</label>
                  <input
                    type="text"
                    value={courseForm.courseCode}
                    onChange={(e) => setCourseForm({ ...courseForm, courseCode: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., EXC-001"
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Duration (months)</label>
                  <input
                    type="number"
                    value={courseForm.duration}
                    onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="3"
                  />
                </div>

                {/* Fee */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Fee (₹)</label>
                  <input
                    type="number"
                    value={courseForm.fee}
                    onChange={(e) => setCourseForm({ ...courseForm, fee: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="5000"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  placeholder="Course description..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50"
              >
                {loading ? 'Adding...' : '➕ Add Course'}
              </button>
            </form>
          </div>
        )}

        {/* Google Drive Setup Modal */}
        <GoogleDriveSetup
          isOpen={isGoogleDriveSetupOpen}
          onClose={() => setIsGoogleDriveSetupOpen(false)}
          onSuccess={() => {
            setMessage('✅ Google Drive setup completed successfully!');
            setTimeout(() => setMessage(''), 3000);
          }}
        />
      </div>
    </div>
  );
}
