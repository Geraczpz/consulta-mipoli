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
    const body = await req.json()

    console.log('BODY:', body)

    const { email, password, nombre, rol } = body

    const supabaseAdmin = createClient(
      Deno.env.get('PROJECT_URL') ?? '',
      Deno.env.get('SERVICE_ROLE_KEY') ?? ''
    )

    console.log('ENV OK')

    const { data, error } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      })

    console.log('CREATE USER:', data)

    if (error) {
      console.log('ERROR CREATE USER:', error)
      throw error
    }

    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: data.user.id,
        nombre,
        rol,
      })

    if (profileError) {
      console.log('PROFILE ERROR:', profileError)
      throw profileError
    }

    return new Response(
      JSON.stringify({
        ok: true,
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )
  } catch (error) {
    console.log('FINAL ERROR:', error)

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