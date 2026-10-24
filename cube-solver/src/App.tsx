import { useEffect, useRef, useState } from 'react'
import { experimentalSolve3x3x3IgnoringCenters, setSearchDebug } from 'cubing/search'
import { randomScrambleForEvent } from 'cubing/scramble'
import { TwistyPlayer } from 'cubing/twisty'
import { ArrowRight, Check, CircleHelp, RotateCcw, Shuffle, Sparkles } from 'lucide-react'
import './App.css'

setSearchDebug({
  allowLegacyPatternsForWorkerInstantiation: true,
  prioritizeEsbuildWorkaroundForWorkerInstantiation: true,
})

function App() {
  const stageRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<TwistyPlayer | null>(null)
  const [scramble, setScramble] = useState('')
  const [solution, setSolution] = useState<string[]>([])
  const [movesMade, setMovesMade] = useState(0)
  const [status, setStatus] = useState('Ready when you are')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    const player = new TwistyPlayer({
      puzzle: '3x3x3',
      controlPanel: 'none',
      background: 'none',
      alg: '',
      experimentalSetupAlg: '',
      cameraLatitude: 26,
      cameraLongitude: 34,
      cameraDistance: 6.5,
    })
    playerRef.current = player
    stageRef.current?.append(player)

    return () => {
      player.remove()
      playerRef.current = null
    }
  }, [])

  async function scrambleCube() {
    const player = playerRef.current
    if (!player || busy) return
    setBusy(true)
    setStatus('Mixing the cube...')
    setSolution([])
    setMovesMade(0)

    try {
      const nextScramble = await randomScrambleForEvent('333')
      player.experimentalSetupAlg = nextScramble
      player.alg = ''
      setScramble(nextScramble.toString())
      setStatus('Scrambled and ready')
    } catch (error) {
      console.error('Could not create a scramble:', error)
      setStatus('Could not create a scramble. Try again.')
    } finally {
      setBusy(false)
    }
  }

  async function findSolution() {
    const player = playerRef.current
    if (!player || busy) return
    setBusy(true)
    setStatus('Finding a solution...')

    try {
      const pattern = await player.experimentalModel.currentPattern.get()
      const alg = await experimentalSolve3x3x3IgnoringCenters(pattern)
      const nextSolution = alg.toString().trim().split(/\s+/).filter(Boolean)
      setSolution(nextSolution)
      setStatus(nextSolution.length ? `${nextSolution.length} moves to solve` : 'Already solved')
    } catch (error) {
      console.error('Could not solve this position:', error)
      setStatus('Could not solve this position. Try resetting the cube.')
    } finally {
      setBusy(false)
    }
  }

  function turnFace(move: string) {
    const player = playerRef.current
    if (!player || busy) return
    player.experimentalAddMove(move)
    setMovesMade((count) => count + 1)
    setSolution([])
    setStatus('Your move')
  }

  function playNextMove() {
    const player = playerRef.current
    if (!player || solution.length === 0) return
    player.experimentalAddMove(solution[0])
    setSolution((remaining) => remaining.slice(1))
    setMovesMade((count) => count + 1)
    setStatus(solution.length === 1 ? 'Cube solved' : `${solution.length - 1} moves remaining`)
  }

  function resetCube() {
    const player = playerRef.current
    if (!player) return
    player.experimentalSetupAlg = ''
    player.alg = ''
    setScramble('')
    setSolution([])
    setMovesMade(0)
    setStatus('Cube reset')
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Twist Lab home">
          <span className="brand-mark" aria-hidden="true"><i /><i /><i /><i /></span>
          <span>twist<span className="brand-light">lab</span></span>
        </a>
        <div className="topbar-meta"><span className="live-dot" /> 3 × 3 × 3 <span className="meta-divider">/</span> PRACTICE MODE</div>
        <button className="icon-button help-button" type="button" title="About this cube practice" aria-label="About this cube practice">
          <CircleHelp size={18} strokeWidth={1.8} />
        </button>
      </header>

      <section className="intro" id="top">
        <div>
          <p className="eyebrow">YOUR CUBE, YOUR PACE <span>01 — 03</span></p>
          <h1>Make a move.<br /><em>Find your way.</em></h1>
        </div>
        <p className="intro-copy">A little space to play with the cube, get unstuck, and see how the pieces come back together.</p>
      </section>

      <section className="workspace" aria-label="Cube practice area">
        <div className="cube-column">
          <div className="stage-heading">
            <div><span className="section-index">01</span><h2>The cube</h2></div>
            <span className="drag-hint">DRAG TO ROTATE</span>
          </div>
          <div className="cube-stage" ref={stageRef} aria-label="Interactive 3D Rubik's Cube" />
          <div className="stage-footer">
            <span><span className="live-dot" /> {status}</span>
            <span>{movesMade.toString().padStart(2, '0')} <small>MOVES</small></span>
          </div>
          <div className="scramble-row">
            <span className="scramble-label">SCRAMBLE</span>
            <p>{scramble || 'Your next scramble will appear here.'}</p>
          </div>
        </div>

        <aside className="control-column">
          <div className="control-section">
            <div className="section-title"><span className="section-index">02</span><h2>Take a turn</h2></div>
            <p className="section-note">Choose a face. Tap again for the reverse turn.</p>
            <div className="turn-grid" aria-label="Cube face turns">
              {['U', 'D', 'L', 'R', 'F', 'B'].map((face) => (
                <button className="turn-button" type="button" key={face} onClick={() => turnFace(face)} disabled={busy} aria-label={`Turn ${face} face clockwise`}>
                  <span>{face}</span><small>+</small>
                </button>
              ))}
              {['U', 'D', 'L', 'R', 'F', 'B'].map((face) => (
                <button className="turn-button reverse-turn" type="button" key={`${face}-reverse`} onClick={() => turnFace(`${face}'`)} disabled={busy} aria-label={`Turn ${face} face counterclockwise`}>
                  <span>{face}</span><small>−</small>
                </button>
              ))}
            </div>
            <div className="turn-legend"><span><b>+</b> clockwise</span><span><b>−</b> counterclockwise</span></div>
          </div>

          <div className="control-section solve-section">
            <div className="section-title"><span className="section-index">03</span><h2>Need a hand?</h2></div>
            <p className="section-note">Get a solution, then follow it one turn at a time.</p>
            <button className="solve-button" type="button" onClick={findSolution} disabled={busy}>
              <Sparkles size={17} /> {busy ? 'Working...' : 'Find a solution'} <ArrowRight size={17} />
            </button>
            {solution.length > 0 && (
              <div className="next-move">
                <div><span className="next-label">NEXT TURN</span><strong>{solution[0]}</strong><span className="remaining-count">{solution.length} left</span></div>
                <button className="next-button" type="button" onClick={playNextMove} aria-label="Play next solution move" title="Play next solution move"><ArrowRight size={19} /></button>
              </div>
            )}
          </div>

          <div className="utility-actions">
            <button type="button" onClick={scrambleCube} disabled={busy}><Shuffle size={15} /> New scramble</button>
            <button type="button" onClick={resetCube} disabled={busy}><RotateCcw size={15} /> Reset cube</button>
          </div>
          {status === 'Cube solved' && <p className="solved-note"><Check size={15} /> Nice work. Cube solved.</p>}
        </aside>
      </section>

      <footer className="page-footer"><span>TWIST LAB <span className="footer-star">✳</span> LEARN BY TURNING</span><span>TAKE YOUR TIME. THE CUBE ISN'T GOING ANYWHERE.</span></footer>
    </main>
  )
}

export default App