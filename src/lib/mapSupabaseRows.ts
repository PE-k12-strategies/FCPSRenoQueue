import type { CsvRow } from '../types/data'

function schoolId(value: unknown): string {
  if (value == null || value === '') return ''
  const n = typeof value === 'number' ? value : Number(String(value).trim())
  if (Number.isFinite(n)) return String(Math.trunc(n))
  return String(value).trim()
}

function copyMapped(
  row: Record<string, unknown>,
  mapping: Record<string, string>,
): CsvRow {
  const out: CsvRow = {}
  for (const [source, target] of Object.entries(mapping)) {
    const value = row[source]
    if (value == null || value === '') continue
    out[target] = String(value)
  }
  return out
}

/** Facility_List → legacy property keys used across the UI. */
const facilityListMapping: Record<string, string> = {
  'FCPS_School ID': 'FCPS_School ID',
  School: 'School',
  School_Type: 'School Type',
  Region: 'Region',
  Year_Opened: 'Year Opened',
  Building_SF: 'Building SF',
  Acreage: 'Acreage',
  NCES_School_Name: 'NCES School Name',
  NCES_Street_Address: 'NCES Street Address',
  NCES_City: 'NCES City',
  NCES_State: 'NCES State',
  NCES_ZIP: 'NCES ZIP',
  Other_Names: 'Other Names',
  RFP: 'RFP',
  'RFP ID': 'RFP ID',
  Latitude: 'Latitude',
  Longitude: 'Longitude',
}

/** Facility_Suitability → legacy score / label keys. */
const facilitySuitabilityMapping: Record<string, string> = {
  FCPS_School_ID: 'FCPS_School ID',
  School: 'School',
  FS_Score: 'FS_Score',
  DF_Score: 'DF_Score',
  SS_Score: 'SS_Score',
  PA_Score: 'PA_Score',
  Overall_Classroom_Score: 'Overall Classroom Score',
  Presence_Weighted: 'Presence Weighted',
  Assembly_Score_Weighted: 'Assembly Score Weighted',
  Extended_Learning_Score_Weighted: 'Extended Learning Score Weighted',
  Community_Score_Weighted: 'Community Score Weighted',
  Student_Support_Score: 'Student Support Score',
  Curriculum_Support: 'Curriculum Support',
  // FS table Building_SF is a score; keep display SF from Facility_List.
  Building_SF: 'Building SF Score',
  Avg_Class_SF: 'Avg Class SF',
  Admin: 'Admin',
  Gym: 'Gym',
  Suppl: 'Suppl',
  Support: 'Support',
}

/** CIP_Capacity → legacy capacity keys. */
const capacityMapping: Record<string, string> = {
  FCPS_School_ID: 'FCPS_School ID',
  School_Name: 'School Name',
  School_Type: 'School Type',
  Design_Capacity: 'Design Capacity',
  Program_Capacity: 'Program Capacity',
  'SY25-26_Enrollment': 'SY25-26 Enrollment',
  'SY25-26_Program_Capacity_Utilization':
    'SY25-26 Program Capacity Utilization',
  'SY25-26_Design_Capacity_Utilization': 'SY25-26 Design Capacity Utilization',
  School_Name_in_Capacity_PDF: 'School Name in Capacity PDF',
}

export function mapFacilityListRows(
  rows: Record<string, unknown>[],
): CsvRow[] {
  return rows.map((row) => {
    const mapped = copyMapped(row, facilityListMapping)
    const id = schoolId(row['FCPS_School ID'])
    if (id) mapped['FCPS_School ID'] = id
    return mapped
  })
}

export function mapFacilitySuitabilityRows(
  rows: Record<string, unknown>[],
): CsvRow[] {
  return rows.map((row) => {
    const mapped = copyMapped(row, facilitySuitabilityMapping)
    const id = schoolId(row.FCPS_School_ID)
    if (id) mapped['FCPS_School ID'] = id
    return mapped
  })
}

export function mapCapacityRows(rows: Record<string, unknown>[]): CsvRow[] {
  return rows.map((row) => {
    const mapped = copyMapped(row, capacityMapping)
    const id = schoolId(row.FCPS_School_ID)
    if (id) mapped['FCPS_School ID'] = id
    return mapped
  })
}
