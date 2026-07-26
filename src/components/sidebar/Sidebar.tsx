import { useMemo, useState } from 'react'
import { appConfig } from '../../config/appConfig'
import {
  sidebarSections,
  type SidebarSection,
} from '../../config/sidebarSections'
import { AccordionSection } from './AccordionSection'
import footerBrandLogo from '../../assets/branding/perkins-eastman-logo.png'
import './Sidebar.css'

type Props = {
  /** Current search string filters accordion titles and sub-items. */
  searchQuery: string
  onSearchChange: (q: string) => void
}

function matchesSection(section: SidebarSection, q: string): boolean {
  if (!q.trim()) return true
  const needle = q.toLowerCase()
  const inTitle = section.title.toLowerCase().includes(needle)
  const inBody = section.body.toLowerCase().includes(needle)
  const inSubs = section.subItems.some((s) => s.toLowerCase().includes(needle))
  return inTitle || inBody || inSubs
}

export function Sidebar({ searchQuery, onSearchChange }: Props) {
  const visible = useMemo(
    () => sidebarSections.filter((s) => matchesSection(s, searchQuery)),
    [searchQuery],
  )

  const [openId, setOpenId] = useState<string | null>('data-3')

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

        <div className="sidebar-scroll">
          <label className="sidebar-search-label">
            <span className="visually-hidden">Search schools and criteria</span>
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
                placeholder="Search schools, tiers, notes…"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                autoComplete="off"
              />
            </div>
          </label>

          <div className="sidebar-accordion" role="list">
            {visible.map((section) => (
              <AccordionSection
                key={section.id}
                section={section}
                expanded={openId === section.id}
                onToggle={() =>
                  setOpenId((prev) => (prev === section.id ? null : section.id))
                }
              />
            ))}
          </div>
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
