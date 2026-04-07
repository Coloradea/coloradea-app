import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  console.log('Method:', req.method)
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { status: 200, headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders })
  }

  try {
    const text = await req.text()
    console.log('Raw body:', text)
    
    if (!text || text.trim() === '') {
      return new Response(JSON.stringify({ error: 'Empty body' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const { client, num_dossier, type_produit, date_creation } = JSON.parse(text)
    console.log('Client:', client)
    console.log('RESEND_API_KEY present:', !!RESEND_API_KEY)

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev',
        to: ['antoinecorre@colorboutik.com'],
        subject: `Nouvelle fiche — ${client || 'Client inconnu'} — ${num_dossier || ''}`,
        html: `<h2>Nouvelle fiche de production</h2><p><strong>Client :</strong> ${client || '—'}</p><p><strong>N° dossier :</strong> ${num_dossier || '—'}</p><p><strong>Type :</strong> ${type_produit || '—'}</p><p><strong>Date :</strong> ${date_creation || '—'}</p>`,
      }),
    })

    const data = await res.json()
    console.log('Resend status:', res.status)
    console.log('Resend data:', JSON.stringify(data))

    return new Response(JSON.stringify({ ok: res.ok, data }), {
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
