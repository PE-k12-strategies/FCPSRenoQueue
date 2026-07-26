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
          {sidebar}
        </Panel>
        <Separator className="dashboard-resize-handle" />
        <Panel id="map" className="dashboard-map-panel" minSize="33%">
          <div className="dashboard-map-frame">{map}</div>
        </Panel>
      </Group>
    </div>
  )
}
