import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminResourcePage from './pages/AdminResourcePage';
import StudentResourcePage from './pages/StudentResourcePage';
import AdminBookingPage from './pages/AdminBookingPage';
import StudentBookingPage from './pages/StudentBookingPage';
import UserHeader from './components/common/UserHeader';

function App() {
    // Read role from localStorage (Member 4 will set this after login)
    const role = localStorage.getItem("role");
    
    // For now we test with hardcoded role
    // Change "ADMIN" to "USER" to test student view
    const testRole = role || "ADMIN";

    return (
        <div className="min-h-screen bg-slate-50">
            <Routes>

                <Route path="/" element={<HomePage />} />
                <Route path="/resourseadmin" element={<AdminResourcePage />} />
                <Route path="/resoursestudent" element={<StudentResourcePage />} />
                <Route path="/admin-bookings" element={<AdminBookingPage />} />
                <Route path="/student-bookings" element={<StudentBookingPage />} />
                <Route path="/tickets" element={<div className="p-20 text-center text-slate-500 font-bold bg-white m-10 rounded-3xl border border-slate-200">Tickets Module - Coming Soon</div>} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </div>
    );
}

export default App;