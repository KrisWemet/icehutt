/* Supabase connection details for the flavour stock board.

   These two values are meant to be public. The publishable key identifies the
   project; it does not grant access. What actually protects the data is the
   row-level security policy on the flavour_status table: anyone may read the
   board, only a signed-in staff account may change it.

   Never put the service_role key in this file — that one bypasses RLS. */
window.ICEHUT_SUPABASE = {
  url: 'https://svyxxcsjvchpqzgijvmw.supabase.co',
  publishableKey: 'sb_publishable_bF_E5MgDa7J9Plf-ihpGeA_fqmWe1Sz'
};
