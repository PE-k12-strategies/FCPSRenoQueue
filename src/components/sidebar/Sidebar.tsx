import { useMemo, useState } from 'react'
import { appConfig } from '../../config/appConfig'
import {
  defaultQueueMetricWeights,
  defaultQueueSubMetricWeights,
  type QueueMetricId,
  type QueueMetricWeights,
  type QueueSubMetricId,
  type QueueSubMetricWeights,
} from '../../config/queueMetrics'
import { summarizeFacilitySuitability } from '../../lib/districtOverview'
import type { SchoolFeatureCollection } from '../../types/data'
import footerBrandLogo from '../../assets/branding/perkins-eastman-logo.png'
import { DistrictOverview } from './DistrictOverview'
import { MetricWeightsTable } from './MetricWeightsTable'
import './Sidebar.css'

type Props = {
  searchQuery: string
  onSearchChange: (q: string) => void
  schoolData: SchoolFeatureCollection | null
}

export function Sidebar({ searchQuery, onSearchChange, schoolData }: Props) {
  const [weights, setWeights] = useState<QueueMetricWeights>(
    defaultQueueMetricWeights,
  )
  const [subWeights, setSubWeights] = useState<QueueSubMetricWeights>(
    defaultQueueSubMetricWeights,
  )

  const suitability = useMemo(
    () => summarizeFacilitySuitability(schoolData),
    [schoolData],
  )

  const onWeightChange = (id: QueueMetricId, value: number) => {
    setWeights((prev) => ({ ...prev, [id]: value }))
  }

  const onSubChange = (
    parent: 'facilitiesCondition' | 'facilitiesSuitability',
    id: QueueSubMetricId,
    value: number,
  ) => {
    setSubWeights((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [id]: value,
      },
    }))
  }

  return (
    <aside className="sidebar" aria-label="Project criteria">
      <div className="sidebar-inner">
        <header className="sidebar-header">
          <div className="sidebar-header-top">
            <img
              className="sidebar-logo"
              src={appConfig.logoUrl}
              alt={appConfig.logoAlt}
              decoding="async"
            />
            <div className="sidebar-title-wrap">
              <h1 className="sidebar-title">{appConfig.title}</h1>
            </div>
          </div>
          <p className="sidebar-intro">{appConfig.intro}</p>
        </header>

        <label className="sidebar-search-label">
          <span className="visually-hidden">Search schools and address</span>
          <div className="sidebar-search-wrap">
            <svg
              className="sidebar-search-icon"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.2-4.2" />
            </svg>
            <input
              className="sidebar-search"
              type="search"
              placeholder="Search schools, address, notes…"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              autoComplete="off"
            />
          </div>
        </label>

        <div className="sidebar-body">
          <h2 className="sidebar-section-title">Renovation Queue Metric</h2>
          <p className="sidebar-section-copy">
            Adjust how each metric contributes to the renovation queue. Expand a
            metric to set its submetric weights.
          </p>
          <MetricWeightsTable
            weights={weights}
            subWeights={subWeights}
            onChange={onWeightChange}
            onSubChange={onSubChange}
          />

          <DistrictOverview suitability={suitability} />
        </div>

        <footer className="sidebar-footer">
          <img
            className="sidebar-footer-logo"
            src={footerBrandLogo}
            alt={appConfig.footerLogoAlt}
            decoding="async"
          />
        </footer>
      </div>
    </aside>
  )
}
