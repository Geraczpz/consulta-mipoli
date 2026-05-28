import { supabase } from './supabaseClient'

export async function registrarBitacora({
  accion,
  modulo,
  descripcion,
  policia_id = null,
}) {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return

  const { data: profile } = await supabase
    .from('profiles')
    .select('nombre')
    .eq('id', user.id)
    .single()

  await supabase.from('bitacora').insert({
    usuario_id: user.id,
    usuario_nombre: profile?.nombre || user.email,
    accion,
    modulo,
    descripcion,
    policia_id,
  })
}