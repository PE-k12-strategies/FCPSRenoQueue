import { appConfig } from '../../config/appConfig'
import footerBrandLogo from '../../assets/branding/perkins-eastman-logo.png'
import './Sidebar.css'

type Props = {
  searchQuery: string
  onSearchChange: (q: string) => void
}

export function Sidebar({ searchQuery, onSearchChange }: Props) {
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
            Select a school on the map to view its metrics in the detail popup.
            Map colors show Facility Suitability from FS_Score.
          </p>
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
