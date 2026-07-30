/**
 * Shared shape for accordion metric cards (used by the school detail popup).
 */
export type SidebarSubItem = {
  /** Row label, or full text when `value` is omitted. */
  label: string
  /** Optional category / value shown as a badge when colored. */
  value?: string
  /** Optional badge fill (e.g. legend color). */
  color?: string
}

export type SidebarSection = {
  id: string
  title: string
  /** Shown next to the title in accent color. */
  statusTag?: string
  /** Optional fill color for the status tag (e.g. legend match). */
  statusTagColor?: string
  /** Visible when the section is collapsed (optional one-liner). */
  collapsedHint?: string
  /** Longer text shown when expanded. */
  body: string
  /** Short list rows when expanded. */
  subItems: SidebarSubItem[]
}
