-- Table principale des fiches de production
create table fiches (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),

  -- Identification
  num_devis text, num_dossier text,
  date_creation date, date_livraison date,

  -- Désignation
  designation text, client text, type_produit text,
  format_ouvert_l numeric, format_ouvert_h numeric,
  format_ferme_l numeric, format_ferme_h numeric,
  coins_ronds boolean, coins_droits boolean,
  couverture_u_imp boolean, couverture_u_trans boolean,
  quantite numeric,
  nb_couvertures numeric, nb_ft_textes numeric, nb_ft_index numeric,
  nb_ft_aspect numeric, nb_ft_transparents numeric, nb_ft_couleurs numeric,
  obs_designation text,

  -- Laboratoire
  nb_couleurs_totales numeric, papier_feuillet_couleur text,
  modele_dispo_oui boolean, modele_dispo_non boolean,
  decoupe_vif_oui boolean, decoupe_vif_non boolean,
  fin_mat boolean, fin_satin boolean, fin_brillant boolean, fin_metallise boolean,
  degre_brillance text, contretypage_xml boolean, contretypage_std boolean,
  formats_couleurs text, -- JSON
  notes_labo text,

  -- Coating
  papier_coating text, laize_papier numeric,
  coat_fin_mat boolean, coat_fin_satin boolean, coat_fin_brillant boolean,
  nouvel_outil boolean, outil_existant text,
  coating_lignes text, -- JSON
  obs_coating text,

  -- Imprimerie (blocs JSON)
  imp_feuillets_couleur text,
  imp_couvertures text,
  imp_feuillet_texte text,
  imp_index text,
  imp_catalogue text,
  obs_imprimerie text,

  -- Finition
  decoupe_format_net boolean, decoupe_forme boolean,
  perf_avec boolean, perf_sans boolean,
  rivet_argent boolean, rivet_noir boolean, rivet_or boolean,
  rivet_plast_blanc boolean, rivet_plast_noir boolean,
  emb_film boolean, emb_film_ex numeric,
  emb_kraft boolean, emb_kraft_ex numeric,
  obs_finition text,

  -- Expédition
  exp_entreprise text, exp_contact text, exp_tel text, exp_email text,
  exp_adr1 text, exp_adr2 text, exp_adr3 text,
  exp_cp text, exp_ville text, exp_pays text,
  obs_expedition text
);

-- Accès public (pas d'authentification utilisateur Supabase)
alter table fiches enable row level security;
create policy "Accès public" on fiches for all using (true) with check (true);
