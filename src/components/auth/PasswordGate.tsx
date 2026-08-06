import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { accessConfig } from '../../config/accessConfig'
import { appConfig } from '../../config/appConfig'
import './PasswordGate.css'

type Props = {
  children: ReactNode
}

function readUnlocked(): boolean {
  try {
    return sessionStorage.getItem(accessConfig.storageKey) === '1'
  } catch {
    return false
  }
}

function writeUnlocked() {
  try {
    sessionStorage.setItem(accessConfig.storageKey, '1')
  } catch {
    // Ignore storage failures; unlock still works for this page load.
  }
}

export function PasswordGate({ children }: Props) {
  const [unlocked, setUnlocked] = useState(readUnlocked)
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const titleId = useId()
  const errorId = useId()

  useEffect(() => {
    if (!unlocked) inputRef.current?.focus()
  }, [unlocked])

  if (unlocked) return children

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (password === accessConfig.password) {
      writeUnlocked()
      setError(null)
      setUnlocked(true)
      return
    }
    setError('Incorrect password. Try again.')
    setPassword('')
    inputRef.current?.focus()
  }

  return (
    <div className="password-gate">
      <div
        className="password-gate-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <img
          className="password-gate-logo"
          src={appConfig.logoUrl}
          alt={appConfig.logoAlt}
          decoding="async"
        />
        <h1 id={titleId} className="password-gate-title">
          {appConfig.title}
        </h1>
        <p className="password-gate-copy">
          Enter the access password to open this internal draft dashboard.
        </p>
        <form className="password-gate-form" onSubmit={onSubmit}>
          <label className="password-gate-label" htmlFor="access-password">
            Password
          </label>
          <input
            ref={inputRef}
            id="access-password"
            className="password-gate-input"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              if (error) setError(null)
            }}
            aria-invalid={error != null}
            aria-describedby={error ? errorId : undefined}
          />
          {error ? (
            <p id={errorId} className="password-gate-error" role="alert">
              {error}
            </p>
          ) : null}
          <button type="submit" className="password-gate-submit">
            Continue
          </button>
        </form>
      </div>
    </div>
  )
}
