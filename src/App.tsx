import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Dashboard } from './components/Dashboard'
import { LoginView } from './components/pages/LoginView'
import { ProtectedRoute } from './components/ProtectedRoute'
import { DashboardView } from './components/pages/DashboardView'
import { OrdersView } from './components/pages/OrdersView'
import { UsersView } from './components/pages/UsersView'
import { CustomersView } from './components/pages/CustomersView'
import { ServiceProvidersView } from './components/pages/ServiceProvidersView'
import { RegionsView } from './components/pages/RegionsView'
import { FinancialReportsView } from './components/pages/FinancialReportsView'
import { NotificationsView } from './components/pages/NotificationsView'
import { SupportHelpView } from './components/pages/SupportHelpView'
import { SettingsView } from './components/pages/SettingsView'


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginView />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardView />} />
            <Route path="orders" element={<OrdersView />} />
            <Route path="customers" element={<CustomersView isArabic={true} />} />
            <Route path="users" element={<UsersView />} />
            <Route path="service-providers" element={<ServiceProvidersView isArabic={true} />} />
            <Route path="regions" element={<RegionsView isArabic={true} />} />
            <Route path="financial" element={<FinancialReportsView />} />
            <Route path="notifications" element={<NotificationsView isArabic={true} />} />
             <Route path="support" element={<SupportHelpView isArabic={true} />} />
            <Route path="settings" element={<SettingsView />} />
          </Route>
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
