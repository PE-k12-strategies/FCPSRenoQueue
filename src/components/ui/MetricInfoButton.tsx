import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
} from 'react'
import { createPortal } from 'react-dom'
import {
  setActiveMetricInfoId,
  subscribeMetricInfoOpen,
} from '../../lib/metricInfoOpen'
import './MetricInfoButton.css'

export type MetricInfoItem = {
  label: string
  description: string
}

type Props = {
  label: string
  description: string
  /** Subcategory definitions listed under the parent definition. */
  items?: MetricInfoItem[]
  /** Prefer aligning the popover's right edge to the trigger. */
  align?: 'start' | 'end'
}

type PopoverStyle = CSSProperties & {
  '--metric-info-max-height'?: string
}

function measurePopoverStyle(
  trigger: DOMRect,
  preferEnd: boolean,
  hasItems: boolean,
): PopoverStyle {
  const gap = 6
  const pad = 8
  const width = Math.min(hasItems ? 296 : 264, window.innerWidth - pad * 2)
  let left = preferEnd ? trigger.right - width : trigger.left
  left = Math.max(pad, Math.min(left, window.innerWidth - width - pad))

  const spaceBelow = window.innerHeight - trigger.bottom - gap - pad
  const spaceAbove = trigger.top - gap - pad
  const placeBelow = spaceBelow >= 140 || spaceBelow >= spaceAbove

  if (placeBelow) {
    return {
      top: trigger.bottom + gap,
      left,
      width,
      '--metric-info-max-height': `${Math.max(96, spaceBelow)}px`,
    }
  }

  return {
    bottom: window.innerHeight - trigger.top + gap,
    left,
    width,
    '--metric-info-max-height': `${Math.max(96, spaceAbove)}px`,
  }
}

export function MetricInfoButton({
  label,
  description,
  items,
  align = 'start',
}: Props) {
  const reactId = useId()
  const id = `metric-info-${reactId}`
  const [open, setOpen] = useState(false)
  const [style, setStyle] = useState<PopoverStyle | null>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const panelId = `${id}-panel`
  const hasItems = Boolean(items?.length)

  useEffect(() => {
    return subscribeMetricInfoOpen((activeId) => {
      setOpen(activeId === id)
    })
  }, [id])

  useLayoutEffect(() => {
    if (!open) {
      setStyle(null)
      return
    }

    const update = () => {
      const trigger = wrapRef.current?.querySelector('button')
      if (!trigger) return
      setStyle(
        measurePopoverStyle(
          trigger.getBoundingClientRect(),
          align === 'end',
          hasItems,
        ),
      )
    }

    update()
    window.addEventListener('resize', update)
    // Capture scrolls from the sidebar (or any ancestor) so the popover tracks.
    window.addEventListener('scroll', update, true)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
    }
  }, [open, align, hasItems])

  useEffect(() => {
    if (!open) return

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node
      if (wrapRef.current?.contains(target)) return
      if (panelRef.current?.contains(target)) return
      setActiveMetricInfoId(null)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        setActiveMetricInfoId(null)
      }
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown, true)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown, true)
    }
  }, [open])

  const toggle = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setActiveMetricInfoId(open ? null : id)
  }

  const popover =
    open && style
      ? createPortal(
          <div
            ref={panelRef}
            id={panelId}
            className={`metric-info-popover${hasItems ? ' has-items' : ''}`}
            style={style}
            role="dialog"
            aria-label={`${label} definition`}
          >
            <p className="metric-info-popover-title">{label}</p>
            <p className="metric-info-popover-body">{description}</p>
            {hasItems ? (
              <ul className="metric-info-popover-list">
                {items!.map((item) => (
                  <li key={item.label} className="metric-info-popover-item">
                    <span className="metric-info-popover-item-label">
                      {item.label}
                    </span>
                    <span className="metric-info-popover-item-body">
                      {item.description}
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>,
          document.body,
        )
      : null

  return (
    <div className="metric-info" ref={wrapRef}>
      <button
        type="button"
        className="metric-info-trigger"
        aria-label={`About ${label}`}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={toggle}
      >
        i
      </button>
      {popover}
    </div>
  )
}
