import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { userId } = await req.json()

    if (!userId) {
      throw new Error('Falta userId')
    }

    const supabaseAdmin = createClient(
      Deno.env.get('PROJECT_URL') ?? '',
      Deno.env.get('SERVICE_ROLE_KEY') ?? ''
    )

    const { error: updateError } =
      await supabaseAdmin.auth.admin.updateUserById(userId, {
        password: '12345678',
      })

    if (updateError) throw updateError

    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({ debe_cambiar_password: true })
      .eq('id', userId)

    if (profileError) throw profileError

    return new Response(
      JSON.stringify({ ok: true }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: error.message || String(error),
      }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )
  }
})