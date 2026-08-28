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
import ItemsPage from './pages/administration/items';
import ProjectsPage from './pages/administration/projects';
import CategoriesPage from './pages/administration/categories';
import SuppliersPage from './pages/administration/suppliers';
import CustomersPage from './pages/administration/customers';
import FixedAssetsPage from './pages/administration/fixed-assets';
import CreateFixedAssetPage from './pages/administration/fixed-assets/create';
import EditFixedAssetPage from './pages/administration/fixed-assets/edit';
import FixedAssetDetailsPage from './pages/administration/fixed-assets/details';
import PurchasersPage from './pages/administration/purchasers';
import CreatePurchaserPage from './pages/administration/purchasers/create';
import EditPurchaserPage from './pages/administration/purchasers/edit';
import PurchaserDetailsPage from './pages/administration/purchasers/details';
import ChequesPage from './pages/cheques';
import SubcontractorsPage from './pages/administration/subcontractors';
import PermissionsPage from './pages/administration/PermissionsPage';
import CompanySettingsPage from './pages/settings/company-profile';
import FiscalYearsPage from './pages/settings/fiscal-years';
import DocumentSequencesPage from './pages/settings/document-sequences';
import TaxRatesPage from './pages/settings/tax-rates';
import ReportingPeriodsPage from './pages/settings/reporting-periods';
import AccessPoliciesPage from './pages/settings/access-policies';
import WorkflowSettingsPage from './pages/settings/workflows';
import UnitsOfMeasurementPage from './pages/settings/units-of-measurement';
import StoreRequisitionCreatePage from './pages/store/store-requisitions/create';
import StoreRequisitionPrintPage from './pages/store/store-requisitions/print';
import StoreRequisitionListPage from './pages/store/store-requisitions';
import StoreRequisitionEditPage from './pages/store/store-requisitions/edit';
import StoreRequisitionApprovalsPage from './pages/store/store-requisitions/approvals';
import StoreRequisitionDocumentReceivingPage from './pages/store/store-requisitions/document-receiving';
import StoreRequisitionStockCheckPage from './pages/store/store-requisitions/stock-check';
import StoreRequisitionCreatePrPage from './pages/store/purchase_requisitions/create-pr';
import UnitPriceRequestPage from './pages/store/store-requisitions/unit-price-request';
import AddUnitPricePage from './pages/store/purchase_requisitions/add-unit-price';

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
                        path="/administration/permissions"
                        element={<PermissionsPage />}
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

                    <Route
                        path="/administration/items"
                        element={<ItemsPage />}
                    />

                    <Route
                        path="/administration/projects"
                        element={<ProjectsPage />}
                        />

                        <Route
                            path="/administration/categories"
                            element={<CategoriesPage />}
                        />

                        <Route
                            path="/administration/suppliers"
                            element={<SuppliersPage />}
                            />

                            <Route
                            path="/administration/customers"
                            element={<CustomersPage />}
                            />

                            <Route
                                path="/administration/fixed-assets"
                                element={<FixedAssetsPage />}
                                />

                                <Route
                                path="/administration/fixed-assets/create"
                                element={<CreateFixedAssetPage />}
                                />

                                <Route
                                path="/administration/fixed-assets/:id/edit"
                                element={<EditFixedAssetPage />}
                                />

                                <Route
                                path="/administration/fixed-assets/:id"
                                element={<FixedAssetDetailsPage />}
                                />

                                <Route
                                    path="/administration/purchasers/create"
                                    element={<CreatePurchaserPage />}
                                />

                                <Route
                                    path="/administration/purchasers/:id/edit"
                                    element={<EditPurchaserPage />}
                                />

                                <Route
                                    path="/administration/purchasers/:id"
                                    element={<PurchaserDetailsPage />}
                                />

                                <Route
                                    path="/administration/purchasers"
                                    element={<PurchasersPage />}
                                />

                                <Route
                                    path="/cheques"
                                    element={<ChequesPage />}
                                    />

                                    <Route
                                    path="/administration/subcontractors"
                                    element={<SubcontractorsPage />}
                                    />

                                    <Route
                                    path="/settings/company-profile"
                                    element={<CompanySettingsPage />}
                                    />

                                    <Route
                                    path="/settings/fiscal-years"
                                    element={<FiscalYearsPage />}
                                />
                                <Route
                                    path="/settings/document-sequences"
                                    element={<DocumentSequencesPage />}
                                />
                                <Route
                                    path="/settings/tax-rates"
                                    element={<TaxRatesPage />}
                                />

                                <Route
                                    path="/settings/reporting-periods"
                                    element={<ReportingPeriodsPage />}
                                />

                                <Route
                                    path="/settings/access-policies"
                                    element={<AccessPoliciesPage />}
                                />

                                <Route
                                    path="/settings/workflows"
                                    element={<WorkflowSettingsPage />}
                                />

                                <Route
                                path="/settings/units-of-measurement"
                                element={<UnitsOfMeasurementPage />}
                                />
                                <Route
  path="/store/store-requisitions/create"
  element={<StoreRequisitionCreatePage />}
/>

<Route
  path="/store/store-requisitions/:id/print"
  element={<StoreRequisitionPrintPage />}
/>
<Route
  path="/store/store-requisitions"
  element={<StoreRequisitionListPage />}
/>
<Route
  path="/store/store-requisitions/:id/edit"
  element={<StoreRequisitionEditPage />}
/>
<Route
  path="/store/store-requisitions/approvals"
  element={<StoreRequisitionApprovalsPage />}
/>
<Route
  path="/store/store-requisitions/document-receiving"
  element={
    <StoreRequisitionDocumentReceivingPage />
  }
/>
<Route
  path="/store/store-requisitions/stock-check"
  element={
    <StoreRequisitionStockCheckPage />
  }
/>
<Route
  path="/store/purchase_requisitions/create-pr"
  element={
    <StoreRequisitionCreatePrPage />
  }
/>
<Route
  path="/store/store-requisitions/unit-price-request"
  element={<UnitPriceRequestPage />}
/>
<Route
  path="/store/purchase-requisitions/add-unit-price"
  element={<AddUnitPricePage />}
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