import { useCallback, useState } from 'react'
import { BootScene } from './components/BootScene'
import { MainGrid } from './components/MainGrid'
import type { AppPhase } from './types'
import './App.css'

function App() {
  const [phase, setPhase] = useState<AppPhase>('boot')

  const enterMain = useCallback(() => setPhase('main'), [])

  return (
    <main className="app">
      {phase === 'boot' && <BootScene onComplete={enterMain} />}
      {phase === 'main' && <MainGrid />}
    </main>
  )
}

export default App
