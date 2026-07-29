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
  const { defaultLayout, onLayoutChanged } = useDefaultLayout({
    id: 'school-dashboard-split',
    storage: localStorage,
    panelIds: ['sidebar', 'map'],
  })

  return (
    <div className="dashboard-shell">
      <div className="dashboard-map-bleed">
        <div className="dashboard-map-frame">{map}</div>
      </div>

      <Group
        orientation="horizontal"
        id="school-dashboard-split"
        className="dashboard-group"
        defaultLayout={defaultLayout}
        onLayoutChanged={onLayoutChanged}
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
        <Separator className="dashboard-resize-handle" />
        {/* Transparent spacer — map interaction is handled by the bleed layer beneath. */}
        <Panel
          id="map"
          className="dashboard-map-spacer"
          minSize="33%"
        />
      </Group>
    </div>
  )
}
