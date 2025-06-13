/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_SUPABASE_URL: string
  readonly VITE_APP_SUPABASE_ANON_KEY: string
  readonly VITE_APP_SITE_URL: string
  readonly VITE_APP_NAME: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
