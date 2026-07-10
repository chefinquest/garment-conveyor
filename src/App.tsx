import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Showroom } from './Showroom'
import './App.css'

function App() {
  const direction = useRef(0)
  const speed = useRef(0)
  const [displaySpeed, setDisplaySpeed] = useState(0)
  const [ready, setReady] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  const setDrive = useCallback((value: number) => {
    direction.current = value
  }, [])

  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault()
        setDrive(event.key === 'ArrowLeft' ? -1 : 1)
      }
    }
    const up = (event: KeyboardEvent) => {
      if ((event.key === 'ArrowLeft' && direction.current < 0) || (event.key === 'ArrowRight' && direction.current > 0)) setDrive(0)
    }
    const stop = () => setDrive(0)
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    window.addEventListener('blur', stop)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
      window.removeEventListener('blur', stop)
    }
  }, [setDrive])

  const moving = Math.abs(displaySpeed) > 0.006
  const status = !moving ? 'Ready' : displaySpeed < 0 ? 'Moving left' : 'Moving right'
  const percentage = Math.min(100, Math.round(Math.abs(displaySpeed) / (reducedMotion ? 0.08 : 0.22) * 100))

  return (
    <main className="experience">
      <div className={`loading ${ready ? 'loading--hidden' : ''}`} role="status" aria-live="polite">
        <div className="loader-mark"><span /><span /><span /></div>
        <p>Preparing the conveyor</p>
      </div>

      <header className="masthead">
        <div className="brand-mark" aria-hidden="true"><span /><span /><span /></div>
        <div>
          <p className="eyebrow">Automated garment care</p>
          <h1>Studio Rail <span>04</span></h1>
        </div>
      </header>

      <section className="scene-frame" aria-label="Interactive 3D garment conveyor">
        <Showroom direction={direction} speed={speed} onSpeed={setDisplaySpeed} onReady={() => setReady(true)} reducedMotion={reducedMotion} />
        <div className="frame-caption" aria-hidden="true">DRY SYSTEMS · MODULAR LOOP</div>
      </section>

      <aside className="status-card" aria-live="polite">
        <div className={`status-dot ${moving ? 'status-dot--moving' : ''}`} />
        <div>
          <span>{status}</span>
          <small>{moving ? `${percentage}% belt speed` : 'Hold an arrow to begin'}</small>
        </div>
      </aside>

      <div className="hint"><kbd>←</kbd><kbd>→</kbd><span>Hold to move</span><i /> <span>Drag to inspect</span></div>

      <button
        className="drive drive--left" type="button" aria-label="Move conveyor left"
        onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); setDrive(-1) }}
        onPointerUp={() => setDrive(0)} onPointerCancel={() => setDrive(0)} onLostPointerCapture={() => setDrive(0)}
      ><ArrowLeft strokeWidth={1.7} aria-hidden="true" /><span>Reverse</span></button>
      <button
        className="drive drive--right" type="button" aria-label="Move conveyor right"
        onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); setDrive(1) }}
        onPointerUp={() => setDrive(0)} onPointerCancel={() => setDrive(0)} onLostPointerCapture={() => setDrive(0)}
      ><span>Forward</span><ArrowRight strokeWidth={1.7} aria-hidden="true" /></button>
    </main>
  )
}

export default App
