import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function PlacedCandidates() {
  const [candidates, setCandidates] = useState([]);
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    api.get('/candidates', { params: { isPlaced: true } }).then(r => setCandidates(r.data));
  }, []);

  const getSortedCandidates = () => {
    const sorted = [...candidates];
    if (sortBy === 'salary') {
      return sorted.sort((a, b) => (b.salary || 0) - (a.salary || 0));
    } else if (sortBy === 'company') {
      return sorted.sort((a, b) => (a.companyName || '').localeCompare(b.companyName || ''));
    }
    return sorted.sort((a, b) => a.name.localeCompare(b.name));
  };

  const sortedCandidates = getSortedCandidates();
  const totalSalary = candidates.reduce((sum, c) => sum + (c.salary || 0), 0);
  const avgSalary = candidates.length > 0 ? totalSalary / candidates.length : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Placed Candidates</h1>
          <p className="text-gray-600">Tracking successful placements and compensation</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-blue-100 text-sm font-semibold mb-1">Total Placed</p>
                <p className="text-4xl font-bold">{candidates.length}</p>
              </div>
              <span className="text-4xl">✅</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-green-100 text-sm font-semibold mb-1">Average Salary</p>
                <p className="text-4xl font-bold">₹{Math.round(avgSalary).toLocaleString('en-IN')}</p>
                <p className="text-green-100 text-xs mt-1">LPA</p>
              </div>
              <span className="text-4xl">💵</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-purple-100 text-sm font-semibold mb-1">Total Salary Pool</p>
                <p className="text-4xl font-bold">₹{totalSalary.toLocaleString('en-IN')}</p>
                <p className="text-purple-100 text-xs mt-1">LPA (Combined)</p>
              </div>
              <span className="text-4xl">💰</span>
            </div>
          </div>
        </div>

        {/* Sort Controls */}
        <div className="mb-6 flex flex-wrap gap-3">
          <button
            onClick={() => setSortBy('name')}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${
              sortBy === 'name'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Sort by Name
          </button>
          <button
            onClick={() => setSortBy('company')}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${
              sortBy === 'company'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Sort by Company
          </button>
          <button
            onClick={() => setSortBy('salary')}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${
              sortBy === 'salary'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Sort by Salary (High to Low)
          </button>
        </div>

        {/* Placed Candidates List */}
        {sortedCandidates.length > 0 ? (
          <div className="space-y-4">
            {sortedCandidates.map((candidate, idx) => (
              <Link
                key={candidate._id}
                to={`/candidate/${candidate._id}`}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
              >
                <div className="flex flex-col md:flex-row items-stretch">
                  {/* Rank Indicator */}
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center p-6 md:p-8 min-w-max">
                    <div className="text-center">
                      <p className="text-sm font-semibold text-blue-100">Rank</p>
                      <p className="text-4xl font-bold">#{idx + 1}</p>
                    </div>
                  </div>

                  {/* Candidate Info */}
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 font-semibold mb-1">Candidate Name</p>
                      <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {candidate.name}
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs font-semibold text-gray-500 mb-1">Company</p>
                        <p className="text-sm font-bold text-gray-900">{candidate.companyName}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 mb-1">Position</p>
                        <p className="text-sm font-bold text-gray-900">{candidate.jobRole}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 mb-1">Salary (LPA)</p>
                        <p className="text-sm font-bold text-green-600">₹{candidate.salary?.toLocaleString('en-IN') || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 mb-1">Placement Date</p>
                        <p className="text-sm font-bold text-gray-900">
                          {candidate.placementDate ? new Date(candidate.placementDate).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Status and Action */}
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 flex flex-col items-center justify-center md:border-l border-t md:border-t-0">
                    <span className="text-4xl mb-2">✓</span>
                    <p className="text-sm font-bold text-green-700">PLACED</p>
                    <div className="mt-3 pt-3 border-t border-green-200 w-full text-center">
                      <button className="text-blue-600 font-semibold text-xs hover:text-blue-800 transition-colors">
                        View Profile →
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <span className="text-6xl mb-4 block">🔍</span>
            <p className="text-gray-500 text-lg font-semibold">No placed candidates yet</p>
            <p className="text-gray-400 text-sm mt-2">As candidates get placed, they will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}