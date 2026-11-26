import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as
  | string
  | undefined

let client: SupabaseClient | null = null

export function getSupabaseConfigError(): string | null {
  if (!url?.trim() || !publishableKey?.trim()) {
    return 'Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY in .env'
  }
  return null
}

/** Browser Supabase client (publishable key only — never use the secret key here). */
export function getSupabase(): SupabaseClient {
  const configError = getSupabaseConfigError()
  if (configError) throw new Error(configError)
  if (!client) {
    client = createClient(url!.trim(), publishableKey!.trim())
  }
  return client
}

export const supabaseStorage = {
  bucket: 'GeoJson',
  sitesObject: 'FCPS_Sites.geojson',
  regionsObject: 'FCPS_School_Regions.geojson',
} as const

export function publicStorageUrl(objectPath: string): string {
  if (!url?.trim()) {
    throw new Error('Missing VITE_SUPABASE_URL in .env')
  }
  return `${url!.replace(/\/$/, '')}/storage/v1/object/public/${supabaseStorage.bucket}/${objectPath}`
}
