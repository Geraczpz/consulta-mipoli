import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import logo from '../assets/logo.png'

function Bitacora() {
  const navigate = useNavigate()

  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState('')

  useEffect(() => {
    cargarLogs()
  }, [])

  async function cargarLogs() {
    setLoading(true)

    const { data } = await supabase
      .from('bitacora')
      .select('*')
      .order('created_at', {
        ascending: false,
      })

    setLogs(data || [])
    setLoading(false)
  }

  async function cerrarSesion() {
    await supabase.auth.signOut()
    navigate('/')
  }

  const logsFiltrados = logs.filter((log) => {
    const texto = `
      ${log.usuario_nombre}
      ${log.accion}
      ${log.modulo}
      ${log.descripcion}
    `.toLowerCase()

    return texto.includes(filtro.toLowerCase())
  })

  function colorAccion(accion) {
    if (accion.includes('IMPORT')) {
      return 'bg-blue-100 text-blue-700'
    }

    if (accion.includes('RESET')) {
      return 'bg-red-100 text-red-700'
    }

    if (accion.includes('CREAR')) {
      return 'bg-green-100 text-green-700'
    }

    if (accion.includes('VER')) {
      return 'bg-purple-100 text-purple-700'
    }

    return 'bg-gray-100 text-gray-700'
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
              className="block px-5 py-4 rounded-2xl hover:bg-white/10"
            >
              Usuarios
            </Link>

            <Link
              to="/admin/bitacora"
              className="block px-5 py-4 rounded-2xl bg-white/10 border-l-4 border-[#d70b1c]"
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
            Bitácora del sistema
          </h1>

          <p className="text-gray-500 mt-1">
            Registro de actividad y acciones realizadas.
          </p>
        </header>

        <section className="p-6">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-6 border-b">
              <input
                type="text"
                placeholder="Buscar en bitácora..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                className="w-full border rounded-2xl px-5 py-4"
              />
            </div>

            {loading ? (
              <div className="p-10 text-center">
                Cargando...
              </div>
            ) : logsFiltrados.length === 0 ? (
              <div className="p-10 text-center text-gray-500">
                No hay registros
              </div>
            ) : (
              <div className="divide-y">
                {logsFiltrados.map((log) => (
                  <div
                    key={log.id}
                    className="p-6 hover:bg-gray-50 transition"
                  >
                    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${colorAccion(
                              log.accion
                            )}`}
                          >
                            {log.accion}
                          </span>

                          <span className="text-sm text-gray-500">
                            {log.modulo}
                          </span>
                        </div>

                        <h2 className="text-xl font-black text-[#061c3f] mt-3">
                          {log.usuario_nombre}
                        </h2>

                        <p className="text-gray-600 mt-2">
                          {log.descripcion}
                        </p>
                      </div>

                      <div className="text-sm text-gray-500 whitespace-nowrap">
                        {new Date(
                          log.created_at
                        ).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default Bitacora