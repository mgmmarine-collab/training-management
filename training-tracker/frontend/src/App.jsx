import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import BatchView from './pages/BatchView';
import CandidateDetail from './pages/CandidateDetail';
import PlacedCandidates from './pages/PlacedCandidates';
import Certificates from './pages/Certificates';
import Admin from './pages/Admin';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <>
              <Navbar />
              <div className="max-w-6xl mx-auto px-4 py-6">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/batch/:batchId" element={<BatchView />} />
                  <Route path="/candidate/:id" element={<CandidateDetail />} />
                  <Route path="/placed" element={<PlacedCandidates />} />
                  <Route path="/certificates" element={<Certificates />} />
                  <Route path="/admin" element={<ProtectedRoute element={<Admin />} />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </div>
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}