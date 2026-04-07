import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const TO_EMAIL = 'antoinecorre@colorboutik.com'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const { client, num_dossier, type_produit, date_creation } = await req.json()

  const html = `
    <h2>Nouvelle fiche de production — Coloradea</h2>
    <table style="border-collapse:collapse; font-family:Arial; font-size:14px;">
      <tr><td style="padding:6px 12px; font-weight:bold; color:#444;">Client</td><td style="padding:6px 12px;">${client || '—'}</td></tr>
      <tr><td style="padding:6px 12px; font-weight:bold; color:#444;">N° dossier</td><td style="padding:6px 12px;">${num_dossier || '—'}</td></tr>
      <tr><td style="padding:6px 12px; font-weight:bold; color:#444;">Type de produit</td><td style="padding:6px 12px;">${type_produit || '—'}</td></tr>
      <tr><td style="padding:6px 12px; font-weight:bold; color:#444;">Date de création</td><td style="padding:6px 12px;">${date_creation || '—'}</td></tr>
    </table>
    <p style="color:#888; font-size:12px; margin-top:20px;">Connectez-vous pour voir la fiche complète.</p>
  `

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'onboarding@resend.dev',
      to: [TO_EMAIL],
      subject: `Nouvelle fiche — ${client || 'Client inconnu'} — ${num_dossier || ''}`,
      html,
    }),
  })

  const data = await res.json()
  console.log('Resend response:', JSON.stringify(data))

  return new Response(JSON.stringify({ ok: res.ok, data }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
})
