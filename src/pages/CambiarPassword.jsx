import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

function CambiarPassword() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function cambiarPassword(e) {
    e.preventDefault()

    if (password.length < 8) {
      alert('La contraseña debe tener mínimo 8 caracteres')
      return
    }

    setLoading(true)

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      alert('No se pudo obtener el usuario')
      setLoading(false)
      return
    }

    const { error: passwordError } = await supabase.auth.updateUser({
      password,
    })

    if (passwordError) {
      alert(passwordError.message)
      setLoading(false)
      return
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .update({ debe_cambiar_password: false })
      .eq('id', user.id)

    if (profileError) {
      alert(profileError.message)
      setLoading(false)
      return
    }

    alert('Contraseña actualizada correctamente')
    navigate('/buscar')
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#f4f6f8] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10">
        <h1 className="text-3xl font-black text-[#061c3f]">
          Cambiar contraseña
        </h1>

        <p className="text-gray-500 mt-3">
          Debes cambiar tu contraseña antes de continuar.
        </p>

        <form onSubmit={cambiarPassword} className="mt-8 space-y-5">
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-2xl px-5 py-4"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#d70b1c] text-white py-4 rounded-2xl font-black"
          >
            {loading ? 'Actualizando...' : 'Actualizar contraseña'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CambiarPassword