# Vendored libraries

| File | Library | Version | Licence |
|---|---|---|---|
| `supabase-js-2.117.3.min.js` | [@supabase/supabase-js](https://github.com/supabase/supabase-js) UMD build (`dist/umd/supabase.js`) | 2.117.3 | MIT, Copyright (c) 2020 Supabase |

Served from this site so the hire pages don't depend on a third-party CDN. It is only
downloaded when `js/hire-config.js` has been filled in; the unconfigured site never loads it.
To upgrade: `npm pack @supabase/supabase-js@<version>`, copy `package/dist/umd/supabase.js`
here under the new versioned name and update `SUPABASE_JS` in `js/hire-common.js`.
