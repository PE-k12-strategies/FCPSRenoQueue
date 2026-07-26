import Papa from 'papaparse'
import type { CsvRow } from '../types/data'

export function parseCsv(text: string): CsvRow[] {
  const parsed = Papa.parse<CsvRow>(text, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
  })

  if (parsed.errors.length > 0) {
    const msg = parsed.errors.map((e) => e.message).join('; ')
    throw new Error(`CSV parse error: ${msg}`)
  }

  return parsed.data.map((row) => {
    const next: CsvRow = {}
    for (const [k, v] of Object.entries(row)) {
      next[k] = v == null ? '' : String(v).trim()
    }
    return next
  })
}
