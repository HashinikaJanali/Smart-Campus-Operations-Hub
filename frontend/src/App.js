import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminResourcePage from './pages/AdminResourcePage';
import StudentResourcePage from './pages/StudentResourcePage';
import AdminBookingPage from './pages/AdminBookingPage';
import UserBookingPage from './pages/UserBookingPage';
import TicketingPage from './pages/TicketingPage';
import AdminTicketingPage from './pages/AdminTicketingPage';
import LoginPage from './pages/LoginPage';
import NotificationsPage from './pages/NotificationsPage';
import AdminUserManagementPage from './pages/AdminUserManagementPage';
import OAuthCallback from './pages/OAuthCallback';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
    return (
        <div className="min-h-screen bg-slate-50">
            <Routes>

                {/* PUBLIC - no login needed */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/oauth/callback" element={<OAuthCallback />} />

                {/* PROTECTED - login needed */}
                <Route path="/notifications" element={
                    <ProtectedRoute>
                        <NotificationsPage />
                    </ProtectedRoute>
                } />
                <Route path="/resoursestudent" element={
                    <ProtectedRoute>
                        <StudentResourcePage />
                    </ProtectedRoute>
                } />
                <Route path="/bookings" element={
                    <ProtectedRoute>
                        <UserBookingPage />
                    </ProtectedRoute>
                } />
                <Route path="/tickets" element={
                    <ProtectedRoute>
                        <TicketingPage />
                    </ProtectedRoute>
                } />

                {/* ADMIN ONLY */}
                <Route path="/admin-dashboard" element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                        <AdminDashboardPage />
                    </ProtectedRoute>
                } />
                <Route path="/resourseadmin" element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                        <AdminResourcePage />
                    </ProtectedRoute>
                } />
                <Route path="/admin-bookings" element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                        <AdminBookingPage />
                    </ProtectedRoute>
                } />
                <Route path="/admin-tickets" element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                        <AdminTicketingPage />
                    </ProtectedRoute>
                } />
                <Route path="/admin/users" element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                        <AdminUserManagementPage />
                    </ProtectedRoute>
                } />

                <Route path="*" element={<Navigate to="/" />} />

            </Routes>
        </div>
    );
}

export default App;