import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Papa from 'papaparse'
import { supabase } from '../lib/supabaseClient'
import logo from '../assets/logo.png'

function ImportarPolicias() {
  const navigate = useNavigate()

  const [archivo, setArchivo] = useState(null)
  const [cargando, setCargando] = useState(false)
  const [preview, setPreview] = useState([])

  function descargarPlantilla() {
    const contenido =
      'nombre_completo,placa,grado,subsecretaria,sector\nJuan Carlos Pérez López,A12345,Oficial,Operación Policial,Norte\nMaría Fernanda García Ramírez,B67890,Suboficial,Seguridad Ciudadana,Centro'

    const blob = new Blob([contenido], {
      type: 'text/csv;charset=utf-8;',
    })

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = 'plantilla_policias.csv'
    link.click()

    URL.revokeObjectURL(url)
  }

  function seleccionarArchivo(e) {
    const file = e.target.files[0]
    setArchivo(file)

    if (!file) return

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (resultado) {
        setPreview(resultado.data.slice(0, 5))
      },
    })
  }

  async function importarCSV() {
    if (!archivo) {
      alert('Selecciona un archivo CSV')
      return
    }

    setCargando(true)

    Papa.parse(archivo, {
      header: true,
      skipEmptyLines: true,
      complete: async function (resultado) {
    
const policiasMap = new Map()

resultado.data.forEach((fila) => {
  if (!fila.placa) return

  policiasMap.set(fila.placa.trim(), {
    nombre_completo: fila.nombre_completo?.trim(),
    placa: fila.placa?.trim(),
    grado: fila.grado?.trim(),
    subsecretaria: fila.subsecretaria?.trim(),
    sector: fila.sector?.trim(),
  })
})

const policias = Array.from(policiasMap.values())




 const { error } = await supabase
  .from('policias')
  .upsert(policias, {
    onConflict: 'placa',
  })

        if (error) {
          alert(error.message)
        } else {
          alert('Policías importados correctamente')
          setArchivo(null)
          setPreview([])
        }

        setCargando(false)
      },
    })
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
            <img src={logo} alt="Mi Poli" className="w-full object-contain" />
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
              className="block px-5 py-4 rounded-2xl bg-white/10 border-l-4 border-[#d70b1c]"
            >
              Importar policías
            </Link>

            <Link
              to="/admin/usuarios"
              className="block px-5 py-4 rounded-2xl hover:bg-white/10"
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
        <header className="bg-white border-b border-gray-200 px-6 py-5 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-[#061c3f]">
              Importar policías
            </h1>
            <p className="text-gray-500">
              Sube un archivo CSV con nombre completo y datos generales.
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
              <div className="w-16 h-16 bg-[#d70b1c] text-white rounded-2xl flex items-center justify-center text-3xl">
                ↑
              </div>

              <h2 className="text-2xl font-black text-[#061c3f] mt-6">
                Subir archivo CSV
              </h2>

              <p className="text-gray-500 mt-2">
                El archivo debe respetar exactamente los nombres de columnas de
                la plantilla.
              </p>

              <div className="mt-8 border-2 border-dashed border-gray-300 rounded-3xl p-8 text-center bg-[#f4f6f8]">
                <input
                  type="file"
                  accept=".csv"
                  onChange={seleccionarArchivo}
                  className="hidden"
                  id="archivo-csv"
                />

                <label
                  htmlFor="archivo-csv"
                  className="cursor-pointer inline-block bg-[#061c3f] text-white px-8 py-4 rounded-2xl font-black shadow hover:bg-[#0b2b5c] transition"
                >
                  Seleccionar archivo
                </label>

                <p className="mt-4 text-gray-500">
                  {archivo ? archivo.name : 'Ningún archivo seleccionado'}
                </p>
              </div>

              <button
                onClick={importarCSV}
                disabled={cargando}
                className="mt-8 w-full bg-[#d70b1c] hover:bg-red-700 text-white py-4 rounded-2xl font-black shadow-lg transition disabled:opacity-60"
              >
                {cargando ? 'Importando...' : 'Importar policías'}
              </button>
            </div>

            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 h-fit">
              <h2 className="text-2xl font-black text-[#061c3f]">
                Plantilla
              </h2>

              <div className="w-14 h-1 bg-[#d70b1c] mt-3 mb-6"></div>

              <p className="text-gray-500">
                Descarga la plantilla para llenar correctamente los datos.
              </p>

              <button
                onClick={descargarPlantilla}
                className="mt-6 w-full bg-[#061c3f] hover:bg-[#0b2b5c] text-white py-4 rounded-2xl font-black transition"
              >
                Descargar plantilla CSV
              </button>

              <div className="mt-6 bg-[#f4f6f8] rounded-2xl p-4 text-sm text-gray-600">
                <p className="font-bold text-[#061c3f] mb-2">Columnas:</p>
                <p>nombre_completo</p>
                <p>placa</p>
                <p>grado</p>
                <p>subsecretaria</p>
                <p>sector</p>
              </div>
            </div>
          </div>

          {preview.length > 0 && (
            <div className="mt-8 bg-white rounded-3xl shadow-lg border border-gray-100 p-6 overflow-x-auto">
              <h2 className="text-xl font-black text-[#061c3f] mb-4">
                Vista previa
              </h2>

              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#061c3f] text-white">
                    <th className="p-3 text-left">Nombre completo</th>
                    <th className="p-3 text-left">Placa</th>
                    <th className="p-3 text-left">Grado</th>
                    <th className="p-3 text-left">Subsecretaría</th>
                    <th className="p-3 text-left">Sector</th>
                  </tr>
                </thead>

                <tbody>
                  {preview.map((policia, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-3">{policia.nombre_completo}</td>
                      <td className="p-3">{policia.placa}</td>
                      <td className="p-3">{policia.grado}</td>
                      <td className="p-3">{policia.subsecretaria}</td>
                      <td className="p-3">{policia.sector}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default ImportarPolicias