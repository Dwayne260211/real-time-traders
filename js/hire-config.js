/* Real Time Traders hire system: public configuration.
   EMPTY by default, so the hire pages show honest "coming soon" states and make no
   network requests. To switch the online hire system on, follow docs/hire-system-setup.md
   and paste in your Supabase Project URL and anon (public) key.

   Only PUBLIC values belong here. The anon key is designed to be public: Row Level
   Security in the database decides what it can read or change.
   NEVER put the service_role key, a Stripe secret key or a webhook secret in this file. */
window.RTT_HIRE_CONFIG = {
  supabaseUrl: "",      // e.g. "https://abcdefghijklmnop.supabase.co"
  supabaseAnonKey: ""   // the "anon public" key from Project Settings > API
};
