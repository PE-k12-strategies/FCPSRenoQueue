import { facilitySuitabilityColors } from '../../config/legend'
import {
  facilitySuitabilityTree,
  type SuitabilityMetricNode,
} from '../../config/facilitySuitabilityTree'
import {
  parseFsScore,
  scoreToFacilitySuitability,
  type FacilitySuitabilityRating,
} from '../../lib/facilitySuitability'
import './FacilitySuitabilityTable.css'

type Props = {
  properties: Record<string, unknown>
}

function badgeTextColor(fill: string): string {
  return fill === facilitySuitabilityColors.Fair ? '#422006' : '#ffffff'
}

function categoryFor(
  props: Record<string, unknown>,
  field: string,
): FacilitySuitabilityRating | null {
  const score = parseFsScore(props[field])
  if (score == null) return null
  return scoreToFacilitySuitability(score)
}

function CategoryBadge({
  category,
}: {
  category: FacilitySuitabilityRating | null
}) {
  if (!category) return <span className="fs-table-na">—</span>
  const color = facilitySuitabilityColors[category]
  return (
    <span
      className="fs-table-badge"
      style={{ background: color, color: badgeTextColor(color) }}
    >
      {category}
    </span>
  )
}

function SubcategoryCard({
  node,
  props,
}: {
  node: SuitabilityMetricNode
  props: Record<string, unknown>
}) {
  const category = categoryFor(props, node.field)
  const leaves = node.children ?? []

  return (
    <article className="fs-card" aria-labelledby={`fs-card-${node.id}`}>
      <header className="fs-card-header">
        <h4 id={`fs-card-${node.id}`} className="fs-card-title">
          {node.label}
        </h4>
        <CategoryBadge category={category} />
      </header>

      <table className="fs-table">
        <tbody>
          {leaves.map((leaf) => (
            <tr key={leaf.id} className="fs-table-row">
              <th scope="row">{leaf.label}</th>
              <td>
                <CategoryBadge category={categoryFor(props, leaf.field)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  )
}

export function FacilitySuitabilityTable({ properties }: Props) {
  const overall = categoryFor(properties, facilitySuitabilityTree.field)
  const subcategories = facilitySuitabilityTree.children ?? []

  return (
    <section className="fs-table-panel" aria-labelledby="fs-table-heading">
      <header className="fs-table-header">
        <h3 id="fs-table-heading" className="fs-table-title">
          {facilitySuitabilityTree.label}
        </h3>
        <CategoryBadge category={overall} />
      </header>

      <div className="fs-card-grid">
        {subcategories.map((node) => (
          <SubcategoryCard key={node.id} node={node} props={properties} />
        ))}
      </div>
    </section>
  )
}
