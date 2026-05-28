import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import logo from '../assets/logo.png'
import { registrarBitacora } from '../lib/bitacora'

function AdminUsuarios() {
  const navigate = useNavigate()

  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)

  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rol, setRol] = useState('general')

  const [creando, setCreando] = useState(false)

  useEffect(() => {
    obtenerUsuarios()
  }, [])

  async function obtenerUsuarios() {
    setLoading(true)

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    setUsuarios(data || [])
    setLoading(false)
  }

  async function crearUsuario(e) {
    e.preventDefault()

    setCreando(true)

    try {
      const { data, error } = await supabase.functions.invoke(
        'crear-usuario',
        {
          body: {
            nombre,
            email,
            password,
            rol,
          },
        }
      )

      if (error) throw error

      if (!data.ok) {
        throw new Error(data.error)
      }

      alert('Usuario creado correctamente')

      setNombre('')
      setEmail('')
      setPassword('')
      setRol('general')

      obtenerUsuarios()
    } catch (error) {
      alert(error.message)
    }

    setCreando(false)
  }

  async function resetPassword(userId) {
    const confirmar = confirm(
      '¿Restablecer contraseña a 12345678?'
    )

    if (!confirmar) return

    try {
      const { data, error } = await supabase.functions.invoke(
        'reset-password',
        {
          body: {
            userId,
          },
        }
      )

      if (error) throw error

      if (!data.ok) {
        throw new Error(data.error)
      }

      alert(
        'Contraseña restablecida a 12345678'
      )

      obtenerUsuarios()
    } catch (error) {
      alert(error.message)
    }
  }

  async function cerrarSesion() {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-[#f4f6f8] flex">
      <aside className="hidden md:flex w-72 bg-[#061c3f] text-white flex-col justify-between">
        <div>
          <div className="p-8">
            <img
              src={logo}
              alt="Mi Poli"
              className="w-full object-contain"
            />
          </div>

          <nav className="px-4 space-y-3">
            <Link
              to="/buscar"
              className="block px-5 py-4 rounded-2xl hover:bg-white/10"
            >
              Buscar policías
            </Link>

            <Link
              to="/admin"
              className="block px-5 py-4 rounded-2xl hover:bg-white/10"
            >
              Panel administrador
            </Link>

            <Link
              to="/admin/importar"
              className="block px-5 py-4 rounded-2xl hover:bg-white/10"
            >
              Importar policías
            </Link>

            <Link
              to="/admin/usuarios"
              className="block px-5 py-4 rounded-2xl bg-white/10 border-l-4 border-[#d70b1c]"
            >
              Usuarios
            </Link>
          </nav>
        </div>

        <div className="p-4">
          <button
            onClick={cerrarSesion}
            className="w-full border border-white/20 rounded-2xl py-4 hover:bg-white/10"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="flex-1">
        <header className="bg-white border-b border-gray-200 px-6 py-5">
          <h1 className="text-3xl font-black text-[#061c3f]">
            Administración de usuarios
          </h1>

          <p className="text-gray-500 mt-1">
            Crear y administrar usuarios del sistema.
          </p>
        </header>

        <section className="p-6 grid xl:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <div className="w-16 h-16 rounded-2xl bg-[#d70b1c] text-white flex items-center justify-center text-3xl">
              +
            </div>

            <h2 className="text-2xl font-black text-[#061c3f] mt-6">
              Nuevo usuario
            </h2>

            <form
              onSubmit={crearUsuario}
              className="mt-8 space-y-5"
            >
              <input
                type="text"
                placeholder="Nombre"
                value={nombre}
                onChange={(e) =>
                  setNombre(e.target.value)
                }
                className="w-full border rounded-2xl px-5 py-4"
              />

              <input
                type="email"
                placeholder="Correo"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="w-full border rounded-2xl px-5 py-4"
              />

              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                className="w-full border rounded-2xl px-5 py-4"
              />

              <select
                value={rol}
                onChange={(e) =>
                  setRol(e.target.value)
                }
                className="w-full border rounded-2xl px-5 py-4"
              >
                <option value="general">
                  General
                </option>

                <option value="admin">
                  Administrador
                </option>
              </select>

              <button
                type="submit"
                disabled={creando}
                className="w-full bg-[#d70b1c] text-white py-4 rounded-2xl font-black"
              >
                {creando
                  ? 'Creando usuario...'
                  : 'Crear usuario'}
              </button>
            </form>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-black text-[#061c3f]">
                Usuarios registrados
              </h2>
            </div>

            <div className="max-h-[700px] overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center">
                  Cargando...
                </div>
              ) : usuarios.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No hay usuarios
                </div>
              ) : (
                usuarios.map((usuario) => (
                  <div
                    key={usuario.id}
                    className="p-6 border-b"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="font-black text-lg text-[#061c3f]">
                          {usuario.nombre}
                        </h3>

                        <p className="text-gray-500 mt-1">
                          Rol: {usuario.rol}
                        </p>

                        {usuario.debe_cambiar_password && (
                          <span className="inline-block mt-3 text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full">
                            Debe cambiar contraseña
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() =>
                          resetPassword(usuario.id)
                        }
                        className="bg-[#061c3f] hover:bg-[#0b2f66] text-white px-5 py-3 rounded-2xl text-sm font-bold"
                      >
                        Restablecer contraseña
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
await registrarBitacora({
  accion: 'CREAR_USUARIO',
  modulo: 'usuarios',
  descripcion: `Creó usuario ${email} con rol ${rol}`,
})

await registrarBitacora({
  accion: 'RESET_PASSWORD',
  modulo: 'usuarios',
  descripcion: 'Restableció contraseña de un usuario a 12345678',
})
export default AdminUsuarios