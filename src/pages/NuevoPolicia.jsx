import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

function NuevoPolicia() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    nombres: '',
    apellido_paterno: '',
    apellido_materno: '',
    placa: '',
    grado: '',
    subsecretaria: '',
    sector: ''
  })

  function cambiar(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  async function guardar(e) {
    e.preventDefault()

    const { error } = await supabase.from('policias').insert([form])

    if (error) {
      alert(error.message)
    } else {
      alert('Policía creado correctamente')
      navigate('/admin/policias')
    }
  }

  return (
    <div>
      <h1>Nuevo policía</h1>

      <form onSubmit={guardar}>
        <input name="nombres" placeholder="Nombre(s)" onChange={cambiar} />
        <input name="apellido_paterno" placeholder="Apellido paterno" onChange={cambiar} />
        <input name="apellido_materno" placeholder="Apellido materno" onChange={cambiar} />
        <input name="placa" placeholder="Placa" onChange={cambiar} />
        <input name="grado" placeholder="Grado" onChange={cambiar} />
        <input name="subsecretaria" placeholder="Subsecretaría" onChange={cambiar} />
        <input name="sector" placeholder="Sector" onChange={cambiar} />

        <button type="submit">Guardar</button>
      </form>
    </div>
  )
}

export default NuevoPolicia