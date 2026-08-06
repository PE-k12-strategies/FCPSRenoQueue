/**
 * Copy this file’s shape when you want to change branding text.
 * Keeps UI strings out of layout components so edits stay obvious.
 */
export const appConfig = {
  /** Served from `public/fcps-logo.png` */
  logoUrl: '/fcps-logo.png',
  logoAlt: 'Fairfax County Public Schools',
  /** Alt text for footer brand mark (image URL is bundled via import in Sidebar). */
  footerLogoAlt: 'Perkins Eastman',
  title: 'Fairfax County Public Schools: Renovation Queue Criteria',
  intro:
    "This dashboard shows the metrics behind each school's place in the district's renovation queue intended to give a clear, transparent view of how priorities are set.",
  introNote:
    'Note: This is a DRAFT webtool, the data and functionality is intended only for internal review.',
} as const
