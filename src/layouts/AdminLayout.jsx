import logo from '../assets/logo.png'

function AdminLayout({ children }) {
  return (
    <div className="min-h-screen flex bg-[#f4f6f8]">
      <aside className="w-72 bg-[#061c3f] text-white flex flex-col justify-between">
        <div>
          <div className="p-8">
            <img
              src={logo}
              alt="Mi Poli"
              className="w-full object-contain"
            />
          </div>

          <nav className="space-y-2 px-4">
            <button className="w-full text-left px-4 py-3 rounded-xl bg-[#0d2a5c]">
              Buscar policías
            </button>

            <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-[#0d2a5c]">
              Panel administrador
            </button>

            <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-[#0d2a5c]">
              Importar policías
            </button>
          </nav>
        </div>

        <div className="p-4">
          <button className="w-full border border-white/20 rounded-xl py-3">
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}

export default AdminLayout