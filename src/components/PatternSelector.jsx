import styles from './PatternSelector.module.css'
import { DFA_PATTERNS } from '../lib/dfaDefinitions'

const icons = {
  email: '✉',
  phone: '📱',
  binary: '01',
  password: '🔑',
  url: '://',
  identifier: '_x',
  lexer: '{}',
  dnaCodon: 'DNA',
  binaryMultiple3: '%3',
  ipv4: 'IP',
  tcpHandshake: 'TCP',
}

export default function PatternSelector({ selected, onSelect }) {
  const selectedPattern = DFA_PATTERNS[selected]

  return (
    <div className={styles.wrap}>
      <p className={styles.label}>Pilih Pola DFA</p>
      <div className={styles.selectWrap}>
        <select
          className={styles.select}
          value={selected}
          onChange={event => onSelect(event.target.value)}
        >
          {Object.values(DFA_PATTERNS).map(p => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
      <div className={`${styles.item} ${styles.active}`}>
        <span className={styles.icon}>{icons[selected] || 'δ'}</span>
        <div className={styles.info}>
          <span className={styles.name}>{selectedPattern.name}</span>
          <span className={styles.desc}>{selectedPattern.description}</span>
        </div>
      </div>
    </div>
  )
}
