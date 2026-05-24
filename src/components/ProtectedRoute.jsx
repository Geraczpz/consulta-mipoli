import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

function ProtectedRoute({ children }) {
  const [session, setSession] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    async function revisarSesion() {
      const { data } = await supabase.auth.getSession()
      setSession(data.session)
      setCargando(false)
    }

    revisarSesion()
  }, [])

  if (cargando) return <p>Cargando...</p>

  if (!session) return <Navigate to="/" />

  return children
}

export default ProtectedRoute