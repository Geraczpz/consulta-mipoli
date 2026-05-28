import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { registrarBitacora } from '../lib/bitacora'
import logo from '../assets/logoneg.png'

function AdminUsuarios() {
  const navigate = useNavigate()

  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rol, setRol] = useState('admin')

  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    cargarUsuarios()
  }, [])

  async function cargarUsuarios() {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', {
        ascending: false,
      })

    setUsuarios(data || [])
  }

  async function crearUsuario(e) {
    e.preventDefault()

    if (!nombre || !email || !password) {
      alert('Completa todos los campos')
      return
    }

    try {
      setLoading(true)

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

      if (error) {
        throw error
      }

      if (data?.error) {
        alert(data.error)
        setLoading(false)
        return
      }

      await registrarBitacora({
        accion: 'CREAR_USUARIO',
        modulo: 'usuarios',
        descripcion: `Creó usuario ${email} con rol ${rol}`,
      })

      alert('Usuario creado correctamente')

      setNombre('')
      setEmail('')
      setPassword('')
      setRol('admin')

      cargarUsuarios()
    } catch (error) {
      alert(error.message)
    }

    setLoading(false)
  }

  async function resetPassword(usuarioId) {
    const confirmar = confirm(
      '¿Restablecer contraseña a 12345678?'
    )

    if (!confirmar) return

    try {
      const { error } = await supabase.functions.invoke(
        'reset-password',
        {
          body: {
            userId: usuarioId,
            password: '12345678',
          },
        }
      )

      if (error) {
        throw error
      }

      await supabase
        .from('profiles')
        .update({
          debe_cambiar_password: true,
        })
        .eq('id', usuarioId)

      await registrarBitacora({
        accion: 'RESET_PASSWORD',
        modulo: 'usuarios',
        descripcion:
          'Restableció contraseña de un usuario',
      })

      alert(
        'Contraseña restablecida correctamente'
      )

      cargarUsuarios()
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

            <Link
              to="/admin/bitacora"
              className="block px-5 py-4 rounded-2xl hover:bg-white/10"
            >
              Bitácora
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
            Crear y administrar usuarios del
            sistema.
          </p>
        </header>

        <section className="p-6 grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              <div className="w-20 h-20 rounded-3xl bg-[#8b0000] flex items-center justify-center text-white text-5xl mb-6">
                +
              </div>

              <h2 className="text-4xl font-black text-[#061c3f]">
                Nuevo usuario
              </h2>

              <p className="text-gray-500 mt-3">
                Completa la información del
                usuario.
              </p>

              <form
                onSubmit={crearUsuario}
                className="mt-8 space-y-5"
              >
                <div>
                  <label className="font-bold text-[#061c3f]">
                    Nombre
                  </label>

                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) =>
                      setNombre(e.target.value)
                    }
                    className="w-full border rounded-2xl px-5 py-4 mt-2"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#061c3f]">
                    Correo electrónico
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    className="w-full border rounded-2xl px-5 py-4 mt-2"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#061c3f]">
                    Contraseña
                  </label>

                  <input
                    type="password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    className="w-full border rounded-2xl px-5 py-4 mt-2"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#061c3f]">
                    Rol
                  </label>

                  <select
                    value={rol}
                    onChange={(e) =>
                      setRol(e.target.value)
                    }
                    className="w-full border rounded-2xl px-5 py-4 mt-2"
                  >
                    <option value="admin">
                      Administrador
                    </option>

                    <option value="usuario">
                      Usuario
                    </option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#8b0000] hover:bg-red-800 text-white py-5 rounded-2xl text-xl font-black shadow-lg"
                >
                  {loading
                    ? 'Creando usuario...'
                    : 'Crear usuario'}
                </button>
              </form>
            </div>
          </div>

          <div className="xl:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="px-8 py-6 border-b">
                <h2 className="text-3xl font-black text-[#061c3f]">
                  Usuarios registrados
                </h2>
              </div>

              <div className="divide-y">
                {usuarios.map((usuario) => (
                  <div
                    key={usuario.id}
                    className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5"
                  >
                    <div>
                      <h3 className="text-2xl font-black text-[#061c3f]">
                        {usuario.nombre}
                      </h3>

                      <p className="text-gray-500 mt-1">
                        {usuario.rol}
                      </p>

                      {usuario.debe_cambiar_password && (
                        <span className="inline-block mt-3 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-bold">
                          Debe cambiar contraseña
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() =>
                        resetPassword(usuario.id)
                      }
                      className="bg-[#d70b1c] hover:bg-red-700 text-white px-6 py-4 rounded-2xl font-bold shadow-lg"
                    >
                      Restablecer contraseña
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default AdminUsuarios