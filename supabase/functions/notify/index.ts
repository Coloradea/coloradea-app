serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json()
    console.log('Body recu:', JSON.stringify(body))
    console.log('RESEND_API_KEY present:', !!RESEND_API_KEY)

    const { client, num_dossier, type_produit, date_creation } = body

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev',
        to: ['antoinecorre@colorboutik.com'],
        subject: `Nouvelle fiche — ${client || 'Client inconnu'}`,
        html: `<p>Nouvelle fiche créée par ${client}</p>`,
      }),
    })

    const data = await res.json()
    console.log('Resend status:', res.status)
    console.log('Resend response:', JSON.stringify(data))

    return new Response(JSON.stringify({ ok: res.ok }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.log('ERREUR:', err.message)
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
