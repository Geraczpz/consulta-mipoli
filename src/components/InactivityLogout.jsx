import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

function InactivityLogout() {
  const navigate = useNavigate()

  useEffect(() => {
    let timer

    async function cerrarPorInactividad() {
      await supabase.auth.signOut()
      alert('Sesión cerrada por inactividad')
      navigate('/')
    }

    function resetTimer() {
      clearTimeout(timer)

      timer = setTimeout(() => {
        cerrarPorInactividad()
      }, 5 * 60 * 1000)
    }

    const eventos = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart']

    eventos.forEach((evento) => {
      window.addEventListener(evento, resetTimer)
    })

    resetTimer()

    return () => {
      clearTimeout(timer)
      eventos.forEach((evento) => {
        window.removeEventListener(evento, resetTimer)
      })
    }
  }, [navigate])

  return null
}

export default InactivityLogout