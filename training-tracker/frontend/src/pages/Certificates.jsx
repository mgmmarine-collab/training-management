import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function Certificates() {
  const [allCandidates, setAllCandidates] = useState([]);
  const [activeTab, setActiveTab] = useState('issued');

  useEffect(() => {
    api.get('/candidates').then(r => setAllCandidates(r.data));
  }, []);

  const issuedCandidates = allCandidates.filter(c => c.certificateStatus === 'issued');
  const notIssuedCandidates = allCandidates.filter(c => c.certificateStatus !== 'issued');

  const currentCandidates = activeTab === 'issued' ? issuedCandidates : notIssuedCandidates;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Certificate Management</h1>
          <p className="text-gray-600">Track certificate issuance status for all candidates</p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-green-100 text-sm font-semibold mb-1">Total Issued</p>
                <p className="text-4xl font-bold">{issuedCandidates.length}</p>
                <p className="text-green-100 text-xs mt-2">
                  {allCandidates.length > 0
                    ? Math.round((issuedCandidates.length / allCandidates.length) * 100)
                    : 0}
                  % of total
                </p>
              </div>
              <span className="text-4xl">🎓</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-orange-100 text-sm font-semibold mb-1">Total Pending</p>
                <p className="text-4xl font-bold">{notIssuedCandidates.length}</p>
                <p className="text-orange-100 text-xs mt-2">
                  {allCandidates.length > 0
                    ? Math.round((notIssuedCandidates.length / allCandidates.length) * 100)
                    : 0}
                  % of total
                </p>
              </div>
              <span className="text-4xl">⏳</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-blue-100 text-sm font-semibold mb-1">Total Candidates</p>
                <p className="text-4xl font-bold">{allCandidates.length}</p>
                <p className="text-blue-100 text-xs mt-2">Across all batches</p>
              </div>
              <span className="text-4xl">👥</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('issued')}
            className={`px-8 py-3 rounded-full font-semibold transition-all ${
              activeTab === 'issued'
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-green-200'
            }`}
          >
            <span className="mr-2">✓</span> Issued ({issuedCandidates.length})
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-8 py-3 rounded-full font-semibold transition-all ${
              activeTab === 'pending'
                ? 'bg-orange-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-orange-200'
            }`}
          >
            <span className="mr-2">⏳</span> Not Issued ({notIssuedCandidates.length})
          </button>
        </div>

        {/* Candidates Grid */}
        {currentCandidates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentCandidates.map(candidate => (
              <Link
                key={candidate._id}
                to={`/candidate/${candidate._id}`}
                className={`rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group ${
                  activeTab === 'issued'
                    ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-l-4 border-green-500'
                    : 'bg-gradient-to-br from-orange-50 to-amber-50 border-l-4 border-orange-500'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-600 mb-1">Student Name</p>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {candidate.name}
                    </h3>
                  </div>
                  <span className="text-3xl">
                    {activeTab === 'issued' ? '🎓' : '📋'}
                  </span>
                </div>

                {/* Course and Batch Info */}
                <div className="space-y-2 mb-4 pb-4 border-b">
                  <div>
                    <p className="text-xs font-semibold text-gray-600">Course</p>
                    <p className="text-sm font-bold text-gray-900">{candidate.courseId?.courseName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-600">Batch</p>
                    <p className="text-sm font-bold text-gray-900">
                      Batch {candidate.batchId?.batchNumber || 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Status Details */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                    <span className="text-sm font-semibold text-gray-700">Exam Status</span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${
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

                  {activeTab === 'issued' && candidate.certificateDate && (
                    <div className="p-3 bg-white rounded-lg">
                      <p className="text-xs font-semibold text-gray-600 mb-1">Certificate Issued</p>
                      <p className="text-sm font-bold text-green-700">
                        {new Date(candidate.certificateDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  {activeTab === 'pending' && (
                    <div className="p-3 bg-white rounded-lg">
                      <p className="text-xs font-semibold text-gray-600 mb-1">Certificate Status</p>
                      <p className="text-sm font-bold text-orange-700">Awaiting Issuance</p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="mt-4 pt-4 border-t">
                  <button className="w-full text-blue-600 font-semibold text-sm hover:text-blue-800 transition-colors">
                    View Details →
                  </button>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <span className="text-6xl mb-4 block">
              {activeTab === 'issued' ? '📭' : '✅'}
            </span>
            <p className="text-gray-500 text-lg font-semibold">
              {activeTab === 'issued' ? 'No certificates issued yet' : 'All candidates have certificates!'}
            </p>
            <p className="text-gray-400 text-sm mt-2">
              {activeTab === 'issued'
                ? 'Certificates will appear here as they are issued'
                : 'Great job! All candidates have received their certificates'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}