// @ts-nocheck
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'

// Layouts principales
// @ts-ignore
import AdminLayout from './pages/admin/AdminLayout.jsx'
// @ts-ignore
import UserNormalLayout from './pages/login-access/UserNormalLayaout.jsx'
// @ts-ignore
import VigilantLayout from './pages/vigilant/VigilantLayaout.jsx'

// Vistas de administrador
// @ts-ignore
import AdminHome from './pages/admin/AdminHome.jsx'
// @ts-ignore
import AdminSIGView from './pages/admin/AdminSIGView'

// Vistas de registro e inicio de sesión
// @ts-ignore
import Register from "./pages/register/Register.jsx";
// @ts-ignore
import Login from "./pages/login/Login.jsx";
// @ts-ignore
import Home from "./pages/home/Home.jsx";
// @ts-ignore
import VerifyOtp from "./pages/login/VerifyOtp.jsx";

// Contextos
// @ts-ignore
import { AuthProvider, useAuth } from "./context/AuthContext";
// @ts-ignore
import { TaskProvider } from "./context/TaskContext";

// Vistas de usuarios normales
// @ts-ignore
import LoginAccess from "./pages/login-access/LoginAccess.jsx";
// @ts-ignore
import ProfileUpdate from "./pages/login-access/ProfileUpdate.jsx";

// Perfil unificado por rol
// @ts-ignore
import SharedProfile from "./components/SharedProfile.jsx";
// @ts-ignore
import PaymentsView from "./pages/login-access/PaymentsView.jsx";

// Vistas unificadas (compartidas por roles)
// @ts-ignore
import ReportsView from './pages/login-access/ReportsView.jsx'
// @ts-ignore
import AnunciosView from './pages/login-access/AnunciosView.jsx'
// @ts-ignore
import UsersView from './pages/login-access/UsersView.jsx'

// Vistas de vigilantes
// @ts-ignore
import Vigilant from "./pages/vigilant/Vigilant.jsx";
// @ts-ignore
import Visits from "./pages/vigilant/Visits.jsx";
// @ts-ignore
import Schedules from "./pages/vigilant/Schedules.jsx";
// @ts-ignore
import Delimitation from "./pages/login-access/Delimitation.jsx";


// Rutas protegidas según rol
// @ts-ignore
import ProtectedRoute from "./protected/ProtectedRoute";

// CSS global
import './index.css'

// Wrapper para Delimitación según rol (normal o vigilant) para evitar colisión de rutas
function DelimitationLayoutWrapper() {
  const { user } = useAuth();
  if (user?.role === "vigilant") {
    return <VigilantLayout />;
  }
  return <UserNormalLayout />;
}

// Renderizamos la aplicación en el root del HTML
const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <AuthProvider>
        <TaskProvider>
          <BrowserRouter>
            <Routes>
              <Route index element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-otp" element={<VerifyOtp />} />

              <Route element={<ProtectedRoute />}>
                <Route element={<ProtectedRoute allowedRoles={["normal"]} />}>
                  <Route element={<UserNormalLayout />}>
                    <Route path="/user" element={<LoginAccess />} />
                    <Route path="/userReport" element={<ReportsView />} />
                    <Route path="/profile/:id" element={<ProfileUpdate />} />
                    <Route path="/payVigilance" element={<PaymentsView />} />
                    <Route path="/profile" element={<SharedProfile />} />
                    <Route path="/allUsers" element={<UsersView />} />
                    <Route path="/userAnuncios" element={<AnunciosView />} />
                  </Route>
                </Route>

                <Route element={<ProtectedRoute allowedRoles={["vigilant"]} />}>
                  <Route element={<VigilantLayout />}>
                    <Route path="/vigilant" element={<Vigilant />} />
                    <Route path="/visits" element={<Visits />} />
                    <Route path="/profileVigilant" element={<SharedProfile />} />
                    <Route path="/schedules" element={<Schedules />} />
                  </Route>
                </Route>

                <Route element={<ProtectedRoute allowedRoles={["normal", "vigilant"]} />}>
                  <Route element={<DelimitationLayoutWrapper />}>
                    <Route path="/delimitation" element={<Delimitation />} />
                  </Route>
                </Route>

                <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
                  <Route element={<AdminLayout />}>
                    <Route path='/admin' element={<AdminHome />} />
                    <Route path="/admin/users" element={<UsersView />} />
                    <Route path="/admin/tasks" element={<AnunciosView />} />
                    <Route path="/admin/reports" element={<ReportsView />} />
                    <Route path="/admin/profile" element={<SharedProfile />} />
                    <Route path="/admin/payments" element={<PaymentsView />} />
                    <Route path="/admin/sig" element={<AdminSIGView />} />
                    <Route path="/admin/delimitation" element={<Delimitation />} />
                  </Route>
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </TaskProvider>
      </AuthProvider>
    </StrictMode>
  );
}
