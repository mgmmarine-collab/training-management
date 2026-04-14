import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';

export default function BatchView() {
  const { batchId } = useParams();
  const [batch, setBatch] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.get(`/batches/${batchId}`).then(r => setBatch(r.data));
    api.get('/candidates', { params: { batchId } }).then(r => setCandidates(r.data));
  }, [batchId]);

  if (!batch) return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading batch details...</p>
      </div>
    </div>
  );

  const getFilteredCandidates = () => {
    if (filter === 'placed') return candidates.filter(c => c.isPlaced);
    if (filter === 'certified') return candidates.filter(c => c.certificateStatus === 'issued');
    if (filter === 'pending') return candidates.filter(c => c.examStatus === 'pending');
    return candidates;
  };

  const filteredCandidates = getFilteredCandidates();

  const stats = {
    total: candidates.length,
    placed: candidates.filter(c => c.isPlaced).length,
    certified: candidates.filter(c => c.certificateStatus === 'issued').length,
    passed: candidates.filter(c => c.examStatus === 'pass').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="text-blue-600 hover:text-blue-800 text-sm font-semibold mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-8 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-blue-100 text-sm font-semibold mb-2">Batch #{batch.batchNumber}</p>
                <h1 className="text-4xl font-bold mb-2">{batch.batchName || `Batch ${batch.batchNumber}`}</h1>
                <p className="text-xl text-blue-100">{batch.courseId?.courseName || 'Course Name'}</p>
              </div>
              <span className="text-6xl">📚</span>
            </div>
            <div className="flex flex-wrap gap-6 pt-4 border-t border-blue-400">
              <div>
                <p className="text-blue-100 text-sm">Duration</p>
                <p className="text-lg font-semibold">{new Date(batch.startDate).toLocaleDateString()} - {new Date(batch.endDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-blue-100 text-sm">Status</p>
                <p className="text-lg font-semibold capitalize">{batch.status}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <p className="text-gray-600 text-sm font-semibold mb-2">Total Candidates</p>
            <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
            <div className="mt-3 h-1 bg-blue-100 rounded-full"></div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <p className="text-gray-600 text-sm font-semibold mb-2">Exam Passed</p>
            <p className="text-3xl font-bold text-green-600">{stats.passed}</p>
            <p className="text-xs text-gray-500 mt-1">{Math.round((stats.passed/stats.total)*100)}% pass rate</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <p className="text-gray-600 text-sm font-semibold mb-2">Certified</p>
            <p className="text-3xl font-bold text-purple-600">{stats.certified}</p>
            <p className="text-xs text-gray-500 mt-1">{Math.round((stats.certified/stats.total)*100)}% certified</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <p className="text-gray-600 text-sm font-semibold mb-2">Placed</p>
            <p className="text-3xl font-bold text-green-600">{stats.placed}</p>
            <p className="text-xs text-gray-500 mt-1">{Math.round((stats.placed/stats.total)*100)}% placement</p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="mb-6 flex flex-wrap gap-3">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${
              filter === 'all'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            All ({candidates.length})
          </button>
          <button
            onClick={() => setFilter('passed')}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${
              filter === 'passed'
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Exam Passed ({stats.passed})
          </button>
          <button
            onClick={() => setFilter('certified')}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${
              filter === 'certified'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Certified ({stats.certified})
          </button>
          <button
            onClick={() => setFilter('placed')}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${
              filter === 'placed'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Placed ({stats.placed})
          </button>
        </div>

        {/* Candidates Grid */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Candidates ({filteredCandidates.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCandidates.length > 0 ? (
              filteredCandidates.map(candidate => (
                <Link
                  key={candidate._id}
                  to={`/candidate/${candidate._id}`}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-l-4 border-blue-500 group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 font-semibold mb-1">ID: {candidate.sNo}</p>
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {candidate.name}
                      </h3>
                      <p className="text-sm text-gray-600">{candidate.mobile}</p>
                    </div>
                    <span className="text-2xl">👤</span>
                  </div>

                  {/* Status Badges */}
                  <div className="space-y-3 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700">Exam Status:</span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          candidate.examStatus === 'pass'
                            ? 'bg-green-100 text-green-700'
                            : candidate.examStatus === 'fail'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {candidate.examStatus}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700">Certificate:</span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          candidate.certificateStatus === 'issued'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {candidate.certificateStatus === 'issued' ? '✓ Issued' : 'Not Issued'}
                      </span>
                    </div>

                    {candidate.isPlaced && (
                      <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-lg p-3">
                        <p className="text-xs font-semibold text-gray-700 mb-1">💼 Placed At</p>
                        <p className="text-sm font-bold text-indigo-700">{candidate.companyName}</p>
                        <p className="text-xs text-indigo-600">{candidate.jobRole}</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      {candidate.examScore ? `Score: ${candidate.examScore}` : 'No score'}
                    </span>
                    <button className="text-blue-600 font-semibold text-sm hover:text-blue-800">
                      View →
                    </button>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <span className="text-5xl mb-4 block">📋</span>
                <p className="text-gray-500 text-lg">No candidates found in this filter</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}