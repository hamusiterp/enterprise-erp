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
import DepartmentsPage from './pages/organization/DepartmentsPage';
import DesignationsPage from './pages/organization/DesignationsPage';
import BanksPage from './pages/administration/banks';

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

                    

                    <Route
                        path="/organization/departments"
                        element={<DepartmentsPage />}
                    />

                    <Route
                        path="/organization/designations"
                        element={<DesignationsPage />}
                    />
                    <Route
  path="/administration/banks"
  element={<BanksPage />}
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