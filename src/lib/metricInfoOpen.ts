/** Coordinates exclusive open state across MetricInfoButton instances. */

type Listener = (activeId: string | null) => void

let activeId: string | null = null
const listeners = new Set<Listener>()

export function getActiveMetricInfoId() {
  return activeId
}

export function subscribeMetricInfoOpen(listener: Listener) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function setActiveMetricInfoId(id: string | null) {
  activeId = id
  for (const listener of listeners) listener(activeId)
}
