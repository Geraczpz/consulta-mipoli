import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import logo from '../assets/logo.png'
import logoHorizontal from '../assets/logo-horizontal.png'

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [cargando, setCargando] = useState(false)

  async function iniciarSesion(e) {
    e.preventDefault()
    setCargando(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      alert(error.message)
      setCargando(false)
      return
    }

    const {
      data: { session },
    } = await supabase.auth.getSession()

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()

    if (profileError) {
      alert('Error cargando perfil')
      setCargando(false)
      return
    }

    if (profile?.debe_cambiar_password === true) {
      navigate('/cambiar-password')
      setCargando(false)
      return
    }

    if (profile?.rol === 'admin') {
      navigate('/admin')
    } else {
      navigate('/buscar')
    }

    setCargando(false)
  }

  return (
    <div className="min-h-screen bg-[#f4f6f8] flex items-center justify-center px-4">
      <div className="w-full max-w-5xl bg-white rounded-[2rem] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        <section className="hidden lg:flex bg-gradient-to-br from-[#0b1220] via-[#13213d] to-[#1d2f52] p-10 items-center justify-center relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-[#d70b1c] rounded-full opacity-90 blur-2xl"></div>
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-white/5 rounded-full blur-2xl"></div>

          <div className="relative text-center">
            <img
              src={logo}
              alt="Mi Poli"
              className="w-72 mx-auto object-contain drop-shadow-[0_0_25px_rgba(255,255,255,0.15)]"
            />

            <h2 className="text-white text-3xl font-black mt-8">
              Sistema de consulta policial
            </h2>

            <p className="text-white/70 mt-4">
              Acceso seguro para búsqueda y validación de policías registrados.
            </p>
          </div>
        </section>

        <section className="p-8 sm:p-12">
          <div className="mb-10">
            <img
              src={logoHorizontal}
              alt="Mi Poli"
              className="h-20 object-contain"
            />

            <h1 className="text-3xl sm:text-4xl font-black text-[#061c3f] mt-8">
              Iniciar sesión
            </h1>

            <p className="text-gray-500 mt-2">
              Ingresa tus credenciales para continuar.
            </p>
          </div>

          <form onSubmit={iniciarSesion} className="space-y-5">
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:border-[#061c3f]"
            />

            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:border-[#061c3f]"
            />

            <button
              type="submit"
              disabled={cargando}
              className="w-full bg-[#d70b1c] hover:bg-red-700 text-white py-4 rounded-2xl font-black shadow-lg transition disabled:opacity-60"
            >
              {cargando ? 'Entrando...' : 'Entrar al sistema'}
            </button>
          </form>
        </section>
      </div>
    </div>
  )
}

export default Login