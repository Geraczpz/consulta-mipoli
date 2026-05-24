import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

function DetallePolicia() {
  const { id } = useParams()
  const [policia, setPolicia] = useState(null)

  useEffect(() => {
    async function cargarPolicia() {
      const { data, error } = await supabase
        .from('policias')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error(error)
      } else {
        setPolicia(data)
      }
    }

    cargarPolicia()
  }, [id])

  if (!policia) return <p>Cargando...</p>

  return (
    <div>
      <Link to="/buscar">Volver al buscador</Link>

      <h1>Información del policía</h1>

      <p>Nombre(s): {policia.nombres}</p>
      <p>Apellido paterno: {policia.apellido_paterno}</p>
      <p>Apellido materno: {policia.apellido_materno}</p>
      <p>Placa: {policia.placa}</p>
      <p>Grado: {policia.grado}</p>
      <p>Subsecretaría: {policia.subsecretaria}</p>
      <p>Sector: {policia.sector}</p>
    </div>
  )
}

export default DetallePolicia