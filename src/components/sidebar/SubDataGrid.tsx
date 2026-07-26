import './SubDataGrid.css'

type Props = {
  items: string[]
}

/**
 * Uses CSS container queries on `.sidebar-scroll` so column count tracks the live
 * sidebar width while you drag the split handle — no React resize listeners.
 */
export function SubDataGrid({ items }: Props) {
  return (
    <ul className="subdata-grid">
      {items.map((label) => (
        <li key={label} className="subdata-item">
          {label}
        </li>
      ))}
    </ul>
  )
}
