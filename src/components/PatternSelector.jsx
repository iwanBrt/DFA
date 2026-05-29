import styles from './PatternSelector.module.css'
import { DFA_PATTERNS } from '../lib/dfaDefinitions'

const icons = {
  email: '✉',
  phone: '📱',
  binary: '01',
  password: '🔑',
}

export default function PatternSelector({ selected, onSelect }) {
  return (
    <div className={styles.wrap}>
      <p className={styles.label}>Pilih Pola DFA</p>
      <div className={styles.list}>
        {Object.values(DFA_PATTERNS).map(p => (
          <button
            key={p.id}
            className={[styles.item, selected === p.id ? styles.active : ''].join(' ')}
            onClick={() => onSelect(p.id)}
          >
            <span className={styles.icon}>{icons[p.id]}</span>
            <div className={styles.info}>
              <span className={styles.name}>{p.name}</span>
              <span className={styles.desc}>{p.description}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
