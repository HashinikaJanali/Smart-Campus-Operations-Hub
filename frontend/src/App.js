import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminResourcePage from './pages/AdminResourcePage';
import StudentResourcePage from './pages/StudentResourcePage';
import AdminBookingPage from './pages/AdminBookingPage';
import StudentBookingPage from './pages/StudentBookingPage';
import TicketingPage from './pages/TicketingPage';
import AdminTicketingPage from './pages/AdminTicketingPage';
import LoginPage from './pages/LoginPage';
import NotificationPanel from './components/notifications/NotificationPanel';

function App() {
    const role = localStorage.getItem("role");
    const testRole = role || "ADMIN";

    return (
        <div className="min-h-screen bg-slate-50">
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/notifications" element={<NotificationPanel />} />
                <Route path="/resourseadmin" element={<AdminResourcePage />} />
                <Route path="/resoursestudent" element={<StudentResourcePage />} />
                <Route path="/admin-bookings" element={<AdminBookingPage />} />
                <Route path="/student-bookings" element={<StudentBookingPage />} />
                <Route path="/tickets" element={<TicketingPage />} />
                <Route path="/admin-tickets" element={<AdminTicketingPage />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </div>
    );
}

export default App;