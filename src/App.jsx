import { useState } from 'react'
import { DFA_PATTERNS } from './lib/dfaDefinitions'
import { useDFA } from './lib/useDFA'
import DFAGraph from './components/DFAGraph'
import TransitionTable from './components/TransitionTable'
import PatternSelector from './components/PatternSelector'
import ResultBadge from './components/ResultBadge'
import styles from './App.module.css'
import workflowDiagram from '../dfa_system_workflow.svg'

const conceptCards = [
  {
    title: 'Apa itu DFA?',
    body: 'Deterministic Finite Automata adalah model komputasi berhingga yang membaca input karakter satu per satu. Untuk setiap state dan simbol, DFA hanya punya satu transisi yang pasti.',
  },
  {
    title: 'Mengapa cocok untuk pola karakter?',
    body: 'Pola seperti email, URL, IPv4, sekuens DNA, token program, bilangan biner, dan protokol sederhana dapat dipecah menjadi aturan transisi. Setiap karakter mengubah state sampai string diterima atau ditolak.',
  },
  {
    title: 'Output yang dianalisis',
    body: 'Sistem menampilkan state aktif, riwayat transisi, tabel perhitungan, dan status akhir sehingga proses pengenalan pola bisa dilihat secara bertahap.',
  },
]

const mathSteps = [
  'Definisikan DFA sebagai M = (Q, Σ, δ, q₀, F).',
  'Mulai dari state awal q₀.',
  'Untuk setiap karakter σ pada input, hitung state berikutnya dengan δ(q, σ).',
  'Setelah seluruh input dibaca, string diterima jika state akhir berada di F.',
]

const userFlow = [
  'Pengguna membaca konsep dasar dan definisi matematis DFA.',
  'Pengguna melihat alur kerja sistem dari input sampai hasil validasi.',
  'Pengguna menekan tombol masuk simulasi.',
  'Pengguna memilih jenis pola karakter yang ingin diuji.',
  'Pengguna memasukkan string atau memakai contoh yang tersedia.',
  'Sistem menjalankan transisi DFA per karakter.',
  'Pengguna membaca status akhir, diagram state, dan tabel transisi.',
]

export default function App() {
  const [showSimulator, setShowSimulator] = useState(false)
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

  if (!showSimulator) {
    return <LandingPage onStart={() => setShowSimulator(true)} />
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
            <button className={styles.navButton} onClick={() => setShowSimulator(false)}>
              Landing
            </button>
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

function LandingPage({ onStart }) {
  return (
    <div className={styles.landing}>
      <header className={styles.landingHeader}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>δ</span>
          <div>
            <h1 className={styles.title}>DFA Pattern Recognition</h1>
            <p className={styles.subtitle}>Analisis penerapan DFA dalam pengenalan pola karakter</p>
          </div>
        </div>
        <button className={styles.navButton} onClick={onStart}>
          Buka Simulasi
        </button>
      </header>

      <main>
        <section className={styles.hero}>
          <div className={styles.heroDelta} aria-hidden="true">δ</div>
          <div className={styles.heroContent}>
            <p className={styles.eyebrow}>Pengantar Sains Komputasi</p>
            <h2>Analisis Penerapan Deterministic Finite Automata dalam Pengenalan Pola Karakter</h2>
            <p>
              Landing page ini menjelaskan konsep DFA, bentuk matematis, contoh perhitungan,
              alur kerja sistem, dan user flow sebelum pengguna masuk ke simulator.
            </p>
            <div className={styles.heroActions}>
              <button className={styles.primaryButton} onClick={onStart}>
                Mulai Simulasi
              </button>
              <a className={styles.secondaryButton} href="#konsep">
                Pelajari Konsep
              </a>
            </div>
            <div className={styles.formulaPreview} aria-label="Ringkasan definisi DFA">
              <p>M = (Q, Σ, δ, q₀, F)</p>
              <p>δ(q, σ) → q berikutnya</p>
            </div>
          </div>
        </section>

        <section className={styles.sectionBand} id="konsep">
          <div className={styles.sectionIntro}>
            <p className={styles.sectionLabel}>Konsep DFA</p>
            <h3>Mesin berhingga yang membaca karakter secara deterministik</h3>
          </div>
          <div className={styles.conceptGrid}>
            {conceptCards.map(card => (
              <article className={styles.infoCard} key={card.title}>
                <h4>{card.title}</h4>
                <p>{card.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.twoColumnSection}>
          <div>
            <p className={styles.sectionLabel}>Perhitungan Matematis</p>
            <h3>Definisi formal dan aturan penerimaan string</h3>
            <div className={styles.mathBox}>
              <p><strong>M</strong> = (Q, Σ, δ, q₀, F)</p>
              <p><strong>Q</strong>: himpunan state</p>
              <p><strong>Σ</strong>: alfabet input</p>
              <p><strong>δ</strong>: fungsi transisi Q × Σ → Q</p>
              <p><strong>q₀</strong>: state awal</p>
              <p><strong>F</strong>: himpunan accepting state</p>
            </div>
          </div>
          <div className={styles.stepList}>
            {mathSteps.map((step, index) => (
              <div className={styles.stepItem} key={step}>
                <span>{index + 1}</span>
                <p>{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.exampleSection}>
          <div className={styles.sectionIntro}>
            <p className={styles.sectionLabel}>Contoh Perhitungan</p>
            <h3>Pengenalan bilangan biner genap untuk input 1010</h3>
          </div>
          <div className={styles.calculationGrid}>
            <div className={styles.calcTable}>
              <div><b>Langkah</b><b>Karakter</b><b>Transisi</b></div>
              <div><span>1</span><span>1</span><span>δ(q₀, 1) = q₁</span></div>
              <div><span>2</span><span>0</span><span>δ(q₁, 0) = q₀</span></div>
              <div><span>3</span><span>1</span><span>δ(q₀, 1) = q₁</span></div>
              <div><span>4</span><span>0</span><span>δ(q₁, 0) = q₀</span></div>
            </div>
            <div className={styles.resultBox}>
              <span>State akhir</span>
              <strong>q₀ ∈ F</strong>
              <p>Input 1010 diterima karena berakhir pada accepting state untuk bilangan biner genap.</p>
            </div>
          </div>
        </section>

        <section className={styles.workflowSection}>
          <div className={styles.sectionIntro}>
            <p className={styles.sectionLabel}>Alur Kerja Sistem</p>
            <h3>Dari input karakter sampai keputusan diterima atau ditolak</h3>
          </div>
          <div className={styles.workflowFrame}>
            <img src={workflowDiagram} alt="Alur kerja sistem DFA untuk pengenalan pola karakter" />
          </div>
        </section>

        <section className={styles.userFlowSection}>
          <div className={styles.sectionIntro}>
            <p className={styles.sectionLabel}>User Flow Lengkap</p>
            <h3>Urutan penggunaan dari landing page ke simulator</h3>
          </div>
          <div className={styles.flowGrid}>
            {userFlow.map((flow, index) => (
              <div className={styles.flowItem} key={flow}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <p>{flow}</p>
              </div>
            ))}
          </div>
          <button className={styles.primaryButton} onClick={onStart}>
            Masuk ke Simulator DFA
          </button>
        </section>
      </main>
    </div>
  )
}
