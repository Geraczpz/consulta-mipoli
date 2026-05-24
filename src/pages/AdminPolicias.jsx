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
        <header className="bg-white border-b border-gray-200 px-6 py-5 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-[#061c3f]">
              Panel administrador
            </h1>
            <p className="text-gray-500">
              Gestión de importación y consulta de policías
            </p>
          </div>

          <button
            onClick={cerrarSesion}
            className="md:hidden bg-[#d70b1c] text-white px-4 py-2 rounded-xl font-bold"
          >
            Salir
          </button>
        </header>

        <section className="p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Link
              to="/buscar"
              className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition"
            >
              <div className="w-16 h-16 bg-[#061c3f] text-white rounded-2xl flex items-center justify-center text-3xl">
                ⌕
              </div>

              <h2 className="text-2xl font-black text-[#061c3f] mt-6">
                Buscar policías
              </h2>

              <p className="text-gray-500 mt-3">
                Consulta información de policías registrados en la base de datos.
              </p>
            </Link>

            <Link
              to="/admin/importar"
              className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition"
            >
              <div className="w-16 h-16 bg-[#d70b1c] text-white rounded-2xl flex items-center justify-center text-3xl">
                ↑
              </div>

              <h2 className="text-2xl font-black text-[#061c3f] mt-6">
                Importar policías
              </h2>





         


            <Link
              to="/admin/usuarios"
              className="block px-5 py-4 rounded-2xl bg-white/10 border-l-4 border-[#d70b1c]"
            >
              Usuarios
            </Link>
  
      




              <p className="text-gray-500 mt-3">
                Sube un archivo CSV para agregar policías de manera masiva.
              </p>
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}

export default AdminPolicias