import { useState } from 'react'
import { DFA_PATTERNS } from './lib/dfaDefinitions'
import { useDFA } from './lib/useDFA'
import DFAGraph from './components/DFAGraph'
import TransitionTable from './components/TransitionTable'
import PatternSelector from './components/PatternSelector'
import ResultBadge from './components/ResultBadge'
import styles from './App.module.css'

export default function App() {
  const [patternId, setPatternId] = useState('email')
  const pattern = DFA_PATTERNS[patternId]

  const {
    currentState,
    history,
    inputValue,
    isAccepted,
    isTrapped,
    isEmpty,
    handleInput,
    reset,
    loadExample,
  } = useDFA(pattern)

  const handlePatternChange = (id) => {
    setPatternId(id)
  }

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>δ</span>
            <div>
              <h1 className={styles.title}>DFA Pattern Recognition</h1>
              <p className={styles.subtitle}>Pengantar Sains Komputasi — Simulasi Deterministic Finite Automata</p>
            </div>
          </div>
          <div className={styles.headerMeta}>
            <span className={styles.chip}>Q = {pattern.states.length} states</span>
            <span className={styles.chip}>Σ = {pattern.alphabet}</span>
            <span className={styles.chip}>F = {pattern.acceptingStates.join(', ')}</span>
          </div>
        </div>
      </header>

      <div className={styles.body}>
        <aside className={styles.sidebar}>
          <PatternSelector selected={patternId} onSelect={handlePatternChange} />

          <div className={styles.formalDef}>
            <p className={styles.sectionLabel}>Definisi Formal</p>
            <div className={styles.defBox}>
              <p><span className={styles.sym}>M</span> = (Q, Σ, δ, q₀, F)</p>
              <p><span className={styles.sym}>Q</span> = {`{${pattern.states.join(', ')}}`}</p>
              <p><span className={styles.sym}>Σ</span> = {`{${pattern.alphabet}}`}</p>
              <p><span className={styles.sym}>q₀</span> = {pattern.startState}</p>
              <p><span className={styles.sym}>F</span> = {`{${pattern.acceptingStates.join(', ')}}`}</p>
            </div>
          </div>

          <div className={styles.legend}>
            <p className={styles.sectionLabel}>Legenda</p>
            <div className={styles.legendItems}>
              <div className={styles.legendItem}>
                <span className={`${styles.legendDot} ${styles.lgStart}`}></span>
                <span>State awal (q₀)</span>
              </div>
              <div className={styles.legendItem}>
                <span className={`${styles.legendDot} ${styles.lgAccept}`}></span>
                <span>Accepting state (F)</span>
              </div>
              <div className={styles.legendItem}>
                <span className={`${styles.legendDot} ${styles.lgCurrent}`}></span>
                <span>State aktif saat ini</span>
              </div>
              <div className={styles.legendItem}>
                <span className={`${styles.legendDot} ${styles.lgTrap}`}></span>
                <span>Trap state</span>
              </div>
            </div>
          </div>
        </aside>

        <main className={styles.main}>
          <section className={styles.graphSection}>
            <div className={styles.sectionHeader}>
              <p className={styles.sectionLabel}>Diagram State DFA</p>
              <span className={styles.patternBadge}>{pattern.name}</span>
            </div>
            <DFAGraph pattern={pattern} currentState={currentState} history={history} />
          </section>

          <section className={styles.inputSection}>
            <div className={styles.sectionHeader}>
              <p className={styles.sectionLabel}>Input String</p>
            </div>
            <div className={styles.inputRow}>
              <div className={styles.inputWrap}>
                <input
                  className={styles.input}
                  type="text"
                  value={inputValue}
                  onChange={e => handleInput(e.target.value)}
                  placeholder={`Contoh: ${pattern.example}`}
                  spellCheck={false}
                  autoComplete="off"
                />
                {inputValue && (
                  <span className={styles.inputLen}>{inputValue.length} char</span>
                )}
              </div>
              <button className={styles.btnExample} onClick={loadExample}>
                Coba Contoh
              </button>
              <button className={styles.btnReset} onClick={reset} disabled={isEmpty}>
                Reset
              </button>
            </div>

            <ResultBadge
              isEmpty={isEmpty}
              isAccepted={isAccepted}
              isTrapped={isTrapped}
              currentState={currentState}
              pattern={pattern}
            />
          </section>

          <section className={styles.tableSection}>
            <div className={styles.sectionHeader}>
              <p className={styles.sectionLabel}>Tabel Transisi δ(q, σ)</p>
              {history.length > 0 && (
                <span className={styles.stepCount}>{history.length} langkah</span>
              )}
            </div>
            <TransitionTable history={history} pattern={pattern} />
          </section>
        </main>
      </div>

      <footer className={styles.footer}>
        <span>DFA Pattern Recognition · Pengantar Sains Komputasi</span>
        <span>M = (Q, Σ, δ, q₀, F)</span>
      </footer>
    </div>
  )
}
