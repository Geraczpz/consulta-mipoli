import { Routes, Route } from 'react-router-dom'

import Login from './pages/Login'
import BuscarPolicia from './pages/BuscarPolicia'
import DetallePolicia from './pages/DetallePolicia'
import AdminPolicias from './pages/AdminPolicias'
import ImportarPolicias from './pages/ImportarPolicias'
import AdminUsuarios from './pages/AdminUsuarios'
import InactivityLogout from './components/InactivityLogout'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import CambiarPassword from './pages/CambiarPassword'
import Bitacora from './pages/Bitacora'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

<Route
  path="/admin/bitacora"
  element={
    <AdminRoute>
      <Bitacora />
    </AdminRoute>
  }
/>

      <Route
        path="/buscar"
        element={
          <ProtectedRoute>
            <BuscarPolicia />
          </ProtectedRoute>
        }
      />

      <Route
        path="/policias/:id"
        element={
          <ProtectedRoute>
            <DetallePolicia />
          </ProtectedRoute>
        }
      />

     <Route
  path="/admin"
  element={
    <AdminRoute>
      <AdminPolicias />
    </AdminRoute>
  }
/>
      <Route
        path="/admin/importar"
        element={
          <AdminRoute>
            <ImportarPolicias />
          </AdminRoute>
        }
      />

      <Route
  path="/admin/usuarios"
  element={
    <AdminRoute>
      <AdminUsuarios />
    </AdminRoute>
  }
/>

<Route path="/admin" element={<AdminPolicias />} />
<Route
  path="/cambiar-password"
  element={<CambiarPassword />}
/>
<Route
  path="/admin/importar"
  element={<ImportarPolicias />}
/>

    </Routes>
  )
}



export default App