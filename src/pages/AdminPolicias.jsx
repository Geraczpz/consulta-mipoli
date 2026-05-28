import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import logo from '../assets/logoneg.png'

function AdminPolicias() {
  const navigate = useNavigate()

  async function cerrarSesion() {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-[#f4f6f8] flex">
      <aside className="hidden md:flex w-72 bg-[#061c3f] text-white flex-col justify-between">
        <div>
          <div className="p-8">
            <img src={logo} alt="Mi Poli" className="w-full object-contain" />
          </div>

          <nav className="px-4 space-y-3">
            <Link to="/buscar" className="block px-5 py-4 rounded-2xl hover:bg-white/10">
              Buscar policías
            </Link>

            <Link to="/admin" className="block px-5 py-4 rounded-2xl bg-white/10 border-l-4 border-[#d70b1c]">
              Panel administrador
            </Link>

            <Link to="/admin/importar" className="block px-5 py-4 rounded-2xl hover:bg-white/10">
              Importar policías
            </Link>

            <Link to="/admin/usuarios" className="block px-5 py-4 rounded-2xl hover:bg-white/10">
              Usuarios
            </Link>

            <Link to="/admin/bitacora" className="block px-5 py-4 rounded-2xl hover:bg-white/10">
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
            Panel administrador
          </h1>
          <p className="text-gray-500 mt-1">
            Bienvenido al panel administrativo de Mi Poli.
          </p>
        </header>

        <section className="p-6 sm:p-10">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-10 max-w-4xl">
            <h2 className="text-4xl font-black text-[#061c3f]">
              Bienvenido al panel administrativo
            </h2>

            <p className="text-gray-500 text-lg mt-4">
              Desde el menú lateral puedes buscar policías, importar registros,
              administrar usuarios y revisar la bitácora del sistema.
            </p>

            <div className="w-24 h-1 bg-[#d70b1c] mt-8 rounded-full"></div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default AdminPolicias