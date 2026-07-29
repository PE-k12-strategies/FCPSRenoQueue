/**
 * Shared shape for accordion metric cards (used by the school detail popup).
 */
export type SidebarSection = {
  id: string
  title: string
  /** Shown next to the title in accent color. */
  statusTag?: string
  /** Visible when the section is collapsed (optional one-liner). */
  collapsedHint?: string
  /** Longer text shown when expanded. */
  body: string
  /** Short list rows when expanded. */
  subItems: string[]
}
