import {
    Navigate,
    Route,
    Routes,
} from 'react-router';

import MainLayout from './layouts/main/MainLayout';

import DashboardPage from './pages/dashboard/DashboardPage';
import LoginPage from './pages/auth/LoginPage';
import UsersPage from './pages/administration/UsersPage';
import RolesPage from './pages/administration/RolesPage';
import NotFoundPage from './pages/errors/NotFoundPage';

import ProtectedRoute from './routes/ProtectedRoute';

export default function App() {
    return (
        <Routes>
            <Route
                path="/login"
                element={<LoginPage />}
            />

            <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                    <Route
                        path="/dashboard"
                        element={<DashboardPage />}
                    />

                    <Route
                        path="/administration/users"
                        element={<UsersPage />}
                    />

                    <Route
                        path="/administration/roles"
                        element={<RolesPage />}
                    />
                </Route>
            </Route>

            <Route
                path="/"
                element={
                    <Navigate
                        to="/dashboard"
                        replace
                    />
                }
            />

            <Route
                path="*"
                element={<NotFoundPage />}
            />
        </Routes>
    );
}