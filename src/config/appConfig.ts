/**
 * Copy this file’s shape when you want to change branding text.
 * Keeps UI strings out of layout components so edits stay obvious.
 */
export const appConfig = {
  /** Served from `public/fcps-logo.png` */
  logoUrl: '/fcps-logo.png',
  logoAlt: 'FCPS',
  /** Alt text for footer brand mark (image URL is bundled via import in Sidebar). */
  footerLogoAlt: 'Perkins Eastman',
  title: 'Fairfax County Public Schools: Renovation Queue Criteria',
  intro:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
} as const
