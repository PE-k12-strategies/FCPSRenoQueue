import { useEffect, useState } from 'react'
import { loadSchoolDatasetFromSupabase } from '../lib/loadSchoolDatasetFromSupabase'
import { getSupabaseConfigError } from '../lib/supabaseClient'
import type { JoinedDataset } from '../types/data'

type LoadState =
  | { status: 'idle' | 'loading' }
  | { status: 'ready'; data: JoinedDataset }
  | { status: 'error'; message: string }

/** Loads school sites + attribute tables from Supabase and returns enriched GeoJSON. */
export function useSchoolDataset(): LoadState {
  const [state, setState] = useState<LoadState>({ status: 'idle' })

  useEffect(() => {
    let cancelled = false
    setState({ status: 'loading' })

    async function run() {
      try {
        const configError = getSupabaseConfigError()
        if (configError) throw new Error(configError)

        const enriched = await loadSchoolDatasetFromSupabase()
        if (!cancelled) {
          setState({ status: 'ready', data: enriched })
        }
      } catch (e) {
        if (!cancelled) {
          setState({
            status: 'error',
            message: e instanceof Error ? e.message : 'Unknown load error',
          })
        }
      }
    }

    void run()
    return () => {
      cancelled = true
    }
  }, [])

  return state
}
