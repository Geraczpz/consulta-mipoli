import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { registrarBitacora } from '../lib/bitacora'
import logo from '../assets/logo.png'
import logoHorizontal from '../assets/logo-horizontal.png'

function BuscarPolicia() {
  const navigate = useNavigate()

  const [usuario, setUsuario] = useState(null)
  const [rol, setRol] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [resultados, setResultados] = useState([])
  const [policiaSeleccionado, setPoliciaSeleccionado] = useState(null)
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    cargarUsuario()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      buscarPolicias()
    }, 400)

    return () => clearTimeout(timer)
  }, [busqueda])

  async function cargarUsuario() {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const { data } = await supabase
      .from('profiles')
      .select('nombre, rol')
      .eq('id', user.id)
      .single()

  setUsuario(data)
setRol(data?.rol || '')
  }

  async function buscarPolicias() {
    if (busqueda.trim() === '') {
      setResultados([])
      return
    }

    setCargando(true)

    const { data, error } = await supabase.rpc('buscar_policias', {
      texto_busqueda: busqueda,
    })

    if (error) {
      console.error(error)
    } else {
      setResultados(data || [])
    }

    setCargando(false)
  }

  async function abrirPolicia(policia) {
    setPoliciaSeleccionado(policia)

    await registrarBitacora({
      accion: 'VER_POLICIA',
      modulo: 'policias',
      descripcion: `Vio el perfil de ${policia.nombre_completo}`,
      policia_id: policia.id,
    })
  }

  async function cerrarSesion() {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-[#f4f6f8] text-[#061c3f]">
      <header className="bg-white/90 backdrop-blur border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <img
            src={logoHorizontal}
            alt="Mi Poli"
            className="h-12 sm:h-16 object-contain"
          />

         <div className="flex items-center gap-3">

           <span className="hidden sm:block font-semibold">
    {usuario?.nombre || 'Usuario'}
  </span>
  
  {rol === 'admin' && (
    <button
      onClick={() => navigate('/admin')}
      className="bg-[#061c3f] hover:bg-[#0b2b5c] text-white px-5 py-2.5 rounded-full font-bold shadow-md transition"
    >
      Panel admin
    </button>
  )}

 

  <button
    onClick={cerrarSesion}
    className="bg-[#d70b1c] hover:bg-red-700 text-white px-4 sm:px-6 py-2.5 rounded-full font-bold shadow-md transition"
  >
    Cerrar sesión
  </button>
</div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <section className="text-center">
          <img
            src={logo}
            alt="Mi Poli"
            className="h-36 sm:h-48 mx-auto object-contain"
          />

          <h1 className="mt-6 text-4xl sm:text-5xl font-black tracking-tight">
            Buscar policías
          </h1>

          <p className="mt-3 text-gray-500">
            Consulta rápida, segura y profesional
          </p>
        </section>

        <section className="mt-10">
          <div className="bg-white rounded-full shadow-xl border border-gray-200 flex items-center overflow-hidden">
            <div className="pl-6 text-3xl text-[#061c3f]">⌕</div>

            <input
              type="text"
              placeholder="Buscar por nombre completo, placa, grado, subsecretaría o sector..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="flex-1 px-5 py-5 outline-none text-lg bg-transparent"
            />

         
          </div>

          {cargando && (
            <p className="mt-6 text-center text-gray-500">
              Buscando...
            </p>
          )}
        </section>

        {resultados.length > 0 && (
          <section className="mt-10 bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 flex items-center justify-between border-b">
              <h2 className="font-bold text-lg">Resultados</h2>

              <span className="text-sm bg-[#f4f6f8] px-4 py-2 rounded-full font-semibold">
                {resultados.length} resultados
              </span>
            </div>

            <div>
              {resultados.map((policia) => (
                <button
                  key={policia.id}
                  onClick={() => abrirPolicia(policia)}
                  className="w-full text-left px-6 py-5 flex items-center gap-4 border-b last:border-b-0 hover:bg-gray-50 transition"
                >
                  <div className="w-14 h-14 rounded-full bg-[#061c3f] flex items-center justify-center shrink-0">
                    <img
                      src={logo}
                      alt=""
                      className="w-10 h-10 object-contain"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-black text-lg">
                      {policia.nombre_completo || 'Sin nombre'}
                    </h3>

                    <p className="text-gray-500 mt-1">
                      Placa: {policia.placa || '—'}
                    </p>
                  </div>

                  <span className="text-3xl text-gray-400">›</span>
                </button>
              ))}
            </div>
          </section>
        )}
      </main>

      {policiaSeleccionado && (
        <ModalPolicia
          policia={policiaSeleccionado}
          cerrar={() => setPoliciaSeleccionado(null)}
        />
      )}
    </div>
  )
}

function ModalPolicia({ policia, cerrar }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden">
        <div className="bg-[#f4f6f8] border-b border-gray-200 p-6 flex items-center justify-between">
          <img
            src={logoHorizontal}
            alt="Mi Poli"
            className="h-16 object-contain"
          />

          <button
            onClick={cerrar}
            className="w-10 h-10 rounded-full bg-gray-200 text-[#061c3f] text-2xl hover:bg-gray-300 transition"
          >
            ×
          </button>
        </div>

        <div className="p-6 sm:p-8">
          <h2 className="text-3xl font-black text-[#061c3f]">
            Información del policía
          </h2>

          <div className="w-16 h-1 bg-[#d70b1c] mt-3 mb-8"></div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Info label="Nombre completo" value={policia.nombre_completo} />
            <Info label="Placa" value={policia.placa} />
            <Info label="Grado" value={policia.grado} />
            <Info label="Subsecretaría" value={policia.subsecretaria} />
            <Info label="Sector" value={policia.sector} />
          </div>

          <button
            onClick={cerrar}
            className="mt-8 w-full bg-[#d70b1c] hover:bg-red-700 text-white py-4 rounded-2xl font-black transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

function Info({ label, value }) {
  return (
    <div className="bg-[#f4f6f8] rounded-2xl p-4 border border-gray-100">
      <p className="text-xs uppercase tracking-wide text-gray-500 font-bold">
        {label}
      </p>

      <p className="mt-1 text-[#061c3f] font-black text-lg">
        {value || '—'}
      </p>
    </div>
  )
}

export default BuscarPolicia