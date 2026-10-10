/* Real Time Traders hire system: public configuration.
   Connected to the live Supabase project (see docs/hire-system-setup.md).

   Only PUBLIC values belong here. The anon key is designed to be public: Row Level
   Security in the database decides what it can read or change.
   NEVER put the service_role key, a Stripe secret key or a webhook secret in this file. */
window.RTT_HIRE_CONFIG = {
  supabaseUrl: "https://qcfszkrwctwsllcivxwo.supabase.co",
  supabaseAnonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjZnN6a3J3Y3R3c2xsY2l2eHdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE2MDg4NjksImV4cCI6MjEwNzE4NDg2OX0.SdYOF3j8Hn-wF3ryRLGhU0Yq4lZDQmJiKf9yjYkpe78"  // anon public key (RLS protects the data)
};
