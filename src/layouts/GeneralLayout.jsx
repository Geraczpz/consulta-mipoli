import logo from '../assets/logo.png'

function GeneralLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#f4f6f8]">
      <header className="bg-white border-b-4 border-[#061c3f]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <img
            src={logo}
            alt="Mi Poli"
            className="h-16 object-contain"
          />

          <button className="text-[#d70b1c] font-semibold">
            Cerrar sesión
          </button>
        </div>

        <div className="h-1 bg-[#d70b1c] w-40"></div>
      </header>

      <main>{children}</main>
    </div>
  )
}

export default GeneralLayout