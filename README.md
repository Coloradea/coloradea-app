# Coloradea — Application Fiches de Production

## Guide de déploiement (30 minutes)

---

## ÉTAPE 1 — Créer la base de données (Supabase)

1. Allez sur **https://supabase.com** → cliquez "Start your project"
2. Créez un compte gratuit (avec GitHub ou email)
3. Cliquez **"New project"**
   - Name: `coloradea`
   - Database Password: choisissez un mot de passe (notez-le)
   - Region: choisissez `West EU (Ireland)`
4. Attendez ~2 minutes que le projet se crée
5. Dans le menu gauche, cliquez **"SQL Editor"**
6. Copiez-collez tout le contenu du fichier `supabase/schema.sql`
7. Cliquez **"Run"** → vous verrez "Success"

8. Allez dans **Settings → API**
   - Copiez **"Project URL"** → c'est votre `SUPABASE_URL`
   - Copiez **"anon public"** → c'est votre `SUPABASE_ANON_KEY`

---

## ÉTAPE 2 — Configurer les emails (Resend)

1. Allez sur **https://resend.com** → créez un compte gratuit
2. Allez dans **"API Keys"** → cliquez "Create API Key"
   - Nom: `coloradea`
   - Copiez la clé (commence par `re_`)

3. Retournez sur Supabase → **"Edge Functions"** dans le menu gauche
4. Cliquez **"Deploy a new function"**
5. Nommez-la `notify`
6. Copiez le contenu du fichier `supabase/functions/notify/index.ts`
7. Dans **"Secrets"**, ajoutez:
   - Key: `RESEND_API_KEY` / Value: votre clé Resend

> **Note**: Sur le plan gratuit de Resend, l'email expéditeur doit être `onboarding@resend.dev`.
> Modifiez la ligne `from:` dans `notify/index.ts` si besoin.

---

## ÉTAPE 3 — Déployer l'application (Vercel)

1. Créez un compte sur **https://github.com** si vous n'en avez pas
2. Créez un **nouveau repository** GitHub nommé `coloradea-app`
3. Uploadez tous les fichiers de ce dossier dans le repository

4. Allez sur **https://vercel.com** → créez un compte (avec GitHub)
5. Cliquez **"Add New Project"** → importez votre repository GitHub
6. Dans **"Environment Variables"**, ajoutez ces 3 variables:

   | Name | Value |
   |------|-------|
   | `REACT_APP_SUPABASE_URL` | `https://VOTRE_ID.supabase.co` |
   | `REACT_APP_SUPABASE_ANON_KEY` | `votre_anon_key` |
   | `REACT_APP_PASSWORD` | `votre_mot_de_passe` (ex: `Coloradea2024!`) |

7. Cliquez **"Deploy"** → attendez ~3 minutes
8. Vercel vous donne une URL type `https://coloradea-app.vercel.app`

**C'est en ligne ! 🎉**

---

## Utilisation quotidienne

- **Accès**: partagez l'URL Vercel aux 4 utilisateurs
- **Connexion**: avec le mot de passe défini dans `REACT_APP_PASSWORD`
- **Nouvelle fiche**: bouton "+ Nouvelle fiche"
- **Sauvegarder**: bouton "💾 Sauvegarder" (email envoyé automatiquement)
- **Modifier**: cliquer "Ouvrir" sur une fiche existante
- **Imprimer/PDF**: bouton "🖨️ Imprimer" en haut de la fiche

---

## Changer le mot de passe

1. Allez sur Vercel → votre projet → **Settings → Environment Variables**
2. Modifiez `REACT_APP_PASSWORD`
3. Redéployez (bouton "Redeploy")

---

## Coûts

| Service | Plan | Prix |
|---------|------|------|
| Supabase | Free | 0€/mois |
| Vercel | Hobby | 0€/mois |
| Resend | Free (100 emails/jour) | 0€/mois |

**Total : 0€/mois** pour un usage normal.
