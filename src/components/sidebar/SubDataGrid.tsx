import { facilitySuitabilityColors } from '../../config/legend'
import type { SidebarSubItem } from '../../config/sidebarSections'
import './SubDataGrid.css'

type Props = {
  items: SidebarSubItem[]
}

function badgeTextColor(fill: string): string {
  return fill === facilitySuitabilityColors.Fair ? '#422006' : '#ffffff'
}

/**
 * Uses CSS container queries on `.sidebar-body` so column count tracks the live
 * sidebar width while you drag the split handle — no React resize listeners.
 */
export function SubDataGrid({ items }: Props) {
  return (
    <ul className="subdata-grid">
      {items.map((item) => (
        <li key={`${item.label}-${item.value ?? ''}`} className="subdata-item">
          {item.value != null ? (
            <>
              <span className="subdata-item-label">{item.label}</span>
              <span
                className="subdata-item-badge"
                style={
                  item.color
                    ? {
                        background: item.color,
                        color: badgeTextColor(item.color),
                      }
                    : undefined
                }
              >
                {item.value}
              </span>
            </>
          ) : (
            item.label
          )}
        </li>
      ))}
    </ul>
  )
}
