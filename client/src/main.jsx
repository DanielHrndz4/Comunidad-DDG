// Importamos StrictMode para ayudar a detectar problemas en desarrollo
import { StrictMode } from 'react'
// Importamos createRoot para renderizar la app en React 18+
import { createRoot } from 'react-dom/client'
// Importamos BrowserRouter, Route y Routes para manejar el enrutamiento
import { BrowserRouter, Route, Routes } from 'react-router'

// Layouts principales
import AdminLayout from './pages/admin/AdminLayout.jsx'
import UserNormalLayout from './pages/login-access/UserNormalLayaout.jsx'
import VigilantLayout from './pages/vigilant/VigilantLayaout.jsx'

// Vistas de administrador
import AdminHome from './pages/admin/AdminHome.jsx'
import AdminUserView from './pages/admin/AdminUserView.jsx'
import AdminTaskView from './pages/admin/AdminTaskView.jsx'
import AdminReportView from './pages/admin/AdminReportView.jsx'
import AdminProfile from './pages/admin/AdminProfile.jsx'

// Vistas de registro e inicio de sesión
import Register from "./pages/register/Register.jsx";
import Login from "./pages/login/Login.jsx";
import Home from "./pages/home/Home.jsx";

// Contextos
import { AuthProvider } from "./context/AuthContext.jsx";
import { TaskProvider } from "./context/TaskContext.jsx";

// Vistas de usuarios normales
import LoginAccess from "./pages/login-access/LoginAccess.jsx";
import PayVigilance from "./pages/login-access/PayVigilance.jsx";
import Profile from "./pages/login-access/Profile.jsx";
import ProfileUpdate from "./pages/login-access/ProfileUpdate.jsx";
import UserNormalReportView from './pages/login-access/UserNormalReportView.jsx'
import UserNormalAnunciosView from './pages/login-access/UserNormalAnunciosView.jsx'
import UserNormalView from './pages/login-access/UserNormalView.jsx'

// Vistas de vigilantes
import Vigilant from "./pages/vigilant/Vigilant.jsx";
import Visits from "./pages/vigilant/Visits.jsx";
import Schedules from "./pages/vigilant/Schedules.jsx";
import ProfileVigilant from "./pages/vigilant/ProfileVigilant.jsx";

// Rutas protegidas según rol
import ProtectedRoute from "./protected/ProtectedRoute.jsx";
import ProtectedRouteVigilant from "./protected/ProtectedRouteVigilant.jsx";
import ProtectedRouteUser from "./protected/ProtectedRouteUser.jsx";
import ProtectedRouteAdmin from './protected/ProtectedRouteAdmin.jsx'

// CSS global
import './index.css'

// Renderizamos la aplicación en el root del HTML
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Proveemos el contexto de autenticación */}
    <AuthProvider>
      {/* Proveemos el contexto de tareas/visitas */}
      <TaskProvider>
        {/* Router principal de la aplicación */}
        <BrowserRouter>
          <Routes>
            {/* Ruta principal de la app */}
            <Route index element={<Home />}></Route>
            
            {/* Rutas públicas */}
            <Route path="/login" element={<Login />}> /</Route>
            <Route path="/register" element={<Register />}> /</Route>

            {/* Rutas protegidas: requieren usuario autenticado */}
            <Route element={<ProtectedRoute />} >

              {/* Rutas para usuarios regulares (no admin ni vigilante) */}
              <Route element={<ProtectedRouteUser />}>
                <Route element={<UserNormalLayout />}>
                  <Route path="/user" element={<LoginAccess />}> /</Route>
                  <Route path="/userReport" element={<UserNormalReportView />} />
                  <Route path="/profile/:id" element={<ProfileUpdate />} />
                  <Route path="/payVigilance" element={<PayVigilance />}> /</Route>
                  <Route path="/profile" element={<Profile />}> /</Route>
                  <Route path="/allUsers" element={<UserNormalView />}> /</Route>
                  <Route path="/userAnuncios" element={<UserNormalAnunciosView />}> /</Route>
                </Route>
              </Route>

              {/* Rutas para usuarios vigilantes */}
              <Route element={<ProtectedRouteVigilant />}>
                <Route element={<VigilantLayout />}>
                  <Route path="/vigilant" element={<Vigilant />}> /</Route>
                  <Route path="/visits" element={<Visits />}> /</Route>
                  <Route path="/profileVigilant" element={<ProfileVigilant />} />
                  <Route path="/schedules" element={<Schedules />}> /</Route>
                </Route>
              </Route>

              {/* Rutas para administradores */}
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
  </StrictMode>,
)
