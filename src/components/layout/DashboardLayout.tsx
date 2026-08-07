import { useEffect, useRef } from 'react'
import {
  Group,
  Panel,
  Separator,
  useDefaultLayout,
} from 'react-resizable-panels'
import './DashboardLayout.css'

type Props = {
  sidebar: React.ReactNode
  map: React.ReactNode
}

export function DashboardLayout({ sidebar, map }: Props) {
  const shellRef = useRef<HTMLDivElement>(null)
  const { defaultLayout, onLayoutChanged } = useDefaultLayout({
    id: 'school-dashboard-split',
    storage: localStorage,
    panelIds: ['sidebar', 'map'],
  })

  useEffect(() => {
    const shell = shellRef.current
    if (!shell) return
    const panel = shell.querySelector<HTMLElement>('.dashboard-sidebar-panel')
    if (!panel) return

    const updateInset = () => {
      const shellLeft = shell.getBoundingClientRect().left
      const panelRight = panel.getBoundingClientRect().right
      const inset = Math.max(0, Math.round(panelRight - shellLeft))
      shell.style.setProperty('--main-content-inset', `${inset}px`)
    }

    updateInset()
    const ro = new ResizeObserver(updateInset)
    ro.observe(panel)
    ro.observe(shell)
    window.addEventListener('resize', updateInset)
    window.visualViewport?.addEventListener('resize', updateInset)

    return () => {
      ro.disconnect()
      window.removeEventListener('resize', updateInset)
      window.visualViewport?.removeEventListener('resize', updateInset)
    }
  }, [])

  return (
    <div className="dashboard-shell" ref={shellRef}>
      <main
        id="main-content"
        className="dashboard-map-bleed"
        tabIndex={-1}
        aria-label="Main content"
      >
        <div className="dashboard-map-frame">{map}</div>
      </main>

      <Group
        orientation="horizontal"
        id="school-dashboard-split"
        className="dashboard-group"
        defaultLayout={defaultLayout}
        onLayoutChanged={(layout, ...rest) => {
          // Newer react-resizable-panels passes a meta second arg; forward it.
          ;(
            onLayoutChanged as (
              nextLayout: typeof layout,
              ...args: unknown[]
            ) => void
          )(layout, ...rest)
          // Keep dashboard content aligned after drag-resize.
          const shell = shellRef.current
          const panel = shell?.querySelector<HTMLElement>(
            '.dashboard-sidebar-panel',
          )
          if (!shell || !panel) return
          const inset = Math.max(
            0,
            Math.round(
              panel.getBoundingClientRect().right -
                shell.getBoundingClientRect().left,
            ),
          )
          shell.style.setProperty('--main-content-inset', `${inset}px`)
        }}
      >
        <Panel
          id="sidebar"
          className="dashboard-sidebar-panel"
          defaultSize="33%"
          minSize="33%"
          maxSize="67%"
        >
          <div className="dashboard-sidebar-inset">{sidebar}</div>
        </Panel>
        <Separator
          className="dashboard-resize-handle"
          aria-label="Resize sidebar and map"
        />
        {/* Transparent spacer — map interaction is handled by the bleed layer beneath. */}
        <Panel id="map" className="dashboard-map-spacer" minSize="33%" />
      </Group>
    </div>
  )
}
