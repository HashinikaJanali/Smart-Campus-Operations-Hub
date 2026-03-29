import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminResourcePage from './pages/AdminResourcePage';
import StudentResourcePage from './pages/StudentResourcePage';

function App() {
    // Read role from localStorage (Member 4 will set this after login)
    const role = localStorage.getItem("role");

    // For now we test with hardcoded role
    // Change "ADMIN" to "USER" to test student view
    const testRole = role || "ADMIN";

    return (
        <div>
            <Routes>
                <Route
                    path="/"
                    element={
                        testRole === "ADMIN"
                            ? <AdminResourcePage />
                            : <StudentResourcePage />
                    }
                />
                <Route path="/resourseadmin" element={<AdminResourcePage />} />
                <Route path="/resoursestudent" element={<StudentResourcePage />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </div>
    );
}

export default App;