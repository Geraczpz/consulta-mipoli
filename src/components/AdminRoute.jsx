import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

function AdminRoute({ children }) {
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    checkAdmin()
  }, [])

  async function checkAdmin() {
    const {
      data: { session }
    } = await supabase.auth.getSession()

    if (!session) {
      setLoading(false)
      return
    }

    const userId = session.user.id

    const { data, error } = await supabase
      .from('profiles')
      .select('rol')
      .eq('id', userId)
      .single()

    console.log('USER ID:', userId)
    console.log('PROFILE:', data)
    console.log('ERROR:', error)

    if (data?.rol === 'admin') {
      setIsAdmin(true)
    }

    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Cargando...
      </div>
    )
  }

  if (!isAdmin) {
    return <Navigate to="/buscar" />
  }

  return children
}

export default AdminRoute