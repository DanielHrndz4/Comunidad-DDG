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
import AdminUserView from './pages/admin/AdminUserView.jsx'
// @ts-ignore
import AdminTaskView from './pages/admin/AdminTaskView.jsx'
// @ts-ignore
import AdminReportView from './pages/admin/AdminReportView.jsx'
// @ts-ignore
import AdminProfile from './pages/admin/AdminProfile.jsx'

// Vistas de registro e inicio de sesión
// @ts-ignore
import Register from "./pages/register/Register.jsx";
// @ts-ignore
import Login from "./pages/login/Login.jsx";
// @ts-ignore
import Home from "./pages/home/Home.jsx";

// Contextos
// @ts-ignore
import { AuthProvider } from "./context/AuthContext.jsx";
// @ts-ignore
import { TaskProvider } from "./context/TaskContext.jsx";

// Vistas de usuarios normales
// @ts-ignore
import LoginAccess from "./pages/login-access/LoginAccess.jsx";
// @ts-ignore
import PayVigilance from "./pages/login-access/PayVigilance.jsx";
// @ts-ignore
import Profile from "./pages/login-access/Profile.jsx";
// @ts-ignore
import ProfileUpdate from "./pages/login-access/ProfileUpdate.jsx";
// @ts-ignore
import UserNormalReportView from './pages/login-access/UserNormalReportView.jsx'
// @ts-ignore
import UserNormalAnunciosView from './pages/login-access/UserNormalAnunciosView.jsx'
// @ts-ignore
import UserNormalView from './pages/login-access/UserNormalView.jsx'

// Vistas de vigilantes
// @ts-ignore
import Vigilant from "./pages/vigilant/Vigilant.jsx";
// @ts-ignore
import Visits from "./pages/vigilant/Visits.jsx";
// @ts-ignore
import Schedules from "./pages/vigilant/Schedules.jsx";
// @ts-ignore
import ProfileVigilant from "./pages/vigilant/ProfileVigilant.jsx";

// Rutas protegidas según rol
// @ts-ignore
import ProtectedRoute from "./protected/ProtectedRoute.jsx";
// @ts-ignore
import ProtectedRouteVigilant from "./protected/ProtectedRouteVigilant.jsx";
// @ts-ignore
import ProtectedRouteUser from "./protected/ProtectedRouteUser.jsx";
// @ts-ignore
import ProtectedRouteAdmin from './protected/ProtectedRouteAdmin.jsx'

// CSS global
import './index.css'

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

              <Route element={<ProtectedRoute />}>
                <Route element={<ProtectedRouteUser />}>
                  <Route element={<UserNormalLayout />}>
                    <Route path="/user" element={<LoginAccess />} />
                    <Route path="/userReport" element={<UserNormalReportView />} />
                    <Route path="/profile/:id" element={<ProfileUpdate />} />
                    <Route path="/payVigilance" element={<PayVigilance />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/allUsers" element={<UserNormalView />} />
                    <Route path="/userAnuncios" element={<UserNormalAnunciosView />} />
                  </Route>
                </Route>

                <Route element={<ProtectedRouteVigilant />}>
                  <Route element={<VigilantLayout />}>
                    <Route path="/vigilant" element={<Vigilant />} />
                    <Route path="/visits" element={<Visits />} />
                    <Route path="/profileVigilant" element={<ProfileVigilant />} />
                    <Route path="/schedules" element={<Schedules />} />
                  </Route>
                </Route>

                <Route element={<ProtectedRouteAdmin />}>
                  <Route element={<AdminLayout />}>
                    <Route path='/admin' element={<AdminHome />} />
                    <Route path="/admin/users" element={<AdminUserView />} />
                    <Route path="/admin/tasks" element={<AdminTaskView />} />
                    <Route path="/admin/reports" element={<AdminReportView />} />
                    <Route path="/admin/profile" element={<AdminProfile />} />
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
