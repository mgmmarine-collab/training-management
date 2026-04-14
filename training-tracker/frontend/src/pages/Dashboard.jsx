import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [batches, setBatches] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [batchCategories, setBatchCategories] = useState({
    active: { count: 0, batches: [] },
    completed: { count: 0, batches: [] },
    upcoming: { count: 0, batches: [] }
  });

  useEffect(() => {
    api.get('/stats').then(r => {
      setStats(r.data);
      setBatchCategories({
        active: { count: r.data.batches?.active || 0, batches: [] },
        completed: { count: r.data.batches?.completed || 0, batches: [] },
        upcoming: { count: r.data.batches?.upcoming || 0, batches: [] }
      });
    });
    
    api.get('/batches').then(r => {
      setBatches(r.data);
      
      // Categorize batches
      const now = new Date();
      const active = r.data.filter(b => b.status === 'active' && new Date(b.endDate) >= now);
      const completed = r.data.filter(b => b.status === 'completed');
      const upcoming = r.data.filter(b => new Date(b.startDate) > now);

      setBatchCategories({
        active: { count: active.length, batches: active },
        completed: { count: completed.length, batches: completed },
        upcoming: { count: upcoming.length, batches: upcoming }
      });

      // Process chart data
      const data = r.data.map(batch => ({
        name: `Batch ${batch.batchNumber}`,
        active: batch.status === 'active' ? 1 : 0,
        completed: batch.status === 'completed' ? 1 : 0,
      }));
      setChartData(data);
    });
  }, []);

  const statCards = [
    {
      label: 'Total Candidates',
      value: stats.total ?? 0,
      icon: '👥',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Certificates Issued',
      value: stats.certified ?? 0,
      icon: '🎓',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Placed Candidates',
      value: stats.placed ?? 0,
      icon: '💼',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      label: 'Govt. Incentive Recipients',
      value: stats.incentive ?? 0,
      icon: '💰',
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50'
    },
  ];

  const categoryCards = [
    {
      title: 'Currently Running',
      count: batchCategories.active.count,
      icon: '🚀',
      color: 'from-blue-500 to-cyan-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      batches: batchCategories.active.batches
    },
    {
      title: 'Completed',
      count: batchCategories.completed.count,
      icon: '✅',
      color: 'from-green-500 to-emerald-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
      batches: batchCategories.completed.batches
    },
    {
      title: 'Upcoming',
      count: batchCategories.upcoming.count,
      icon: '📅',
      color: 'from-amber-500 to-orange-500',
      textColor: 'text-amber-600',
      bgColor: 'bg-amber-50',
      batches: batchCategories.upcoming.batches
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Training Dashboard</h1>
            <p className="text-gray-600">Overview of all training batches and candidate progress</p>
          </div>
          <Link
            to="/admin"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
          >
            🔧 Admin Panel
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, idx) => (
            <div
              key={idx}
              className={`bg-gradient-to-br ${card.color} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-fade-in`}
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm font-semibold opacity-90 mb-1">{card.label}</p>
                  <p className="text-4xl font-bold">{card.value}</p>
                </div>
                <span className="text-3xl">{card.icon}</span>
              </div>
              <div className="h-1 bg-white opacity-30 rounded-full"></div>
            </div>
          ))}
        </div>

        {/* Batch Categories - Animated Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Batch Status Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categoryCards.map((category, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105 animate-fade-in"
                style={{ animationDelay: `${0.3 + idx * 0.1}s` }}
              >
                {/* Header */}
                <div className={`bg-gradient-to-r ${category.color} p-6 text-white`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-semibold opacity-90">Status</p>
                      <h3 className="text-2xl font-bold mt-1">{category.title}</h3>
                    </div>
                    <span className="text-4xl">{category.icon}</span>
                  </div>
                </div>

                {/* Count */}
                <div className={`${category.bgColor} px-6 py-4`}>
                  <p className={`text-center text-5xl font-bold ${category.textColor} animate-bounce`}>
                    {category.count}
                  </p>
                  <p className="text-center text-sm text-gray-600 mt-2">
                    {category.count === 1 ? 'Batch' : 'Batches'}
                  </p>
                </div>

                {/* Details */}
                <div className="px-6 py-4 border-t max-h-40 overflow-y-auto">
                  {category.batches.length > 0 ? (
                    <div className="space-y-2">
                      {category.batches.slice(0, 3).map((batch, i) => (
                        <div key={i} className="text-sm p-2 bg-gray-50 rounded">
                          <p className="font-semibold text-gray-900">Batch {batch.batchNumber}</p>
                          <p className="text-gray-600 text-xs">{batch.courseId?.courseName}</p>
                        </div>
                      ))}
                      {category.batches.length > 3 && (
                        <p className="text-xs text-gray-500 text-center p-2">
                          +{category.batches.length - 3} more
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 text-sm">No batches</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Batch Status Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-lg animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Batch Overview</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#FFF'
                  }}
                />
                <Legend />
                <Bar dataKey="active" fill="#3B82F6" name="Active" radius={[8, 8, 0, 0]} />
                <Bar dataKey="completed" fill="#10B981" name="Completed" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Placement Stats */}
          <div className="bg-white rounded-2xl p-6 shadow-lg animate-fade-in" style={{ animationDelay: '0.7s' }}>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Placement Stats</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-gray-700">Placement Rate</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {stats.total ? Math.round((stats.placed / stats.total) * 100) : 0}%
                  </p>
                </div>
                <span className="text-4xl">📊</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-gray-700">Certificate Pass Rate</p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.total ? Math.round((stats.certified / stats.total) * 100) : 0}%
                  </p>
                </div>
                <span className="text-4xl">✅</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-gray-700">Total Incentive Disbursed</p>
                  <p className="text-2xl font-bold text-amber-600">₹{stats.totalIncentiveAmount?.toLocaleString('en-IN') || 0}</p>
                </div>
                <span className="text-4xl">💵</span>
              </div>
            </div>
          </div>
        </div>

        {/* Batches Grid */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">All Batches</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {batches && batches.length > 0 ? (
              batches.map(batch => (
                <Link
                  key={batch._id}
                  to={`/batch/${batch._id}`}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-l-4 border-blue-500 group animate-fade-in"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm text-gray-600 font-semibold mb-1">Batch #{batch.batchNumber}</p>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {batch.batchName || `Batch ${batch.batchNumber}`}
                      </h3>
                    </div>
                    <span className="text-2xl">📚</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    <span className="font-semibold">Course:</span> {batch.courseId?.courseName || 'N/A'}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-xs text-gray-500">
                      <p>Start: {new Date(batch.startDate).toLocaleDateString()}</p>
                      <p>End: {new Date(batch.endDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                        batch.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : batch.status === 'active'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {batch.status?.charAt(0).toUpperCase() + batch.status?.slice(1)}
                    </span>
                    <button className="text-blue-600 font-semibold text-sm hover:text-blue-800">
                      View Details →
                    </button>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">No batches found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
        }
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-bounce {
          animation: bounce 2s infinite;
        }
      `}</style>
    </div>
  );
}