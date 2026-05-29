import styles from './ResultBadge.module.css'

export default function ResultBadge({ isEmpty, isAccepted, isTrapped, currentState, pattern }) {
  if (isEmpty) {
    return (
      <div className={styles.idle}>
        <span className={styles.dot} />
        <span>Menunggu input...</span>
        <code className={styles.state}>{pattern.startState}</code>
      </div>
    )
  }

  if (isTrapped) {
    return (
      <div className={`${styles.badge} ${styles.rejected}`}>
        <span className={styles.icon}>✗</span>
        <div>
          <p className={styles.title}>String Ditolak</p>
          <p className={styles.sub}>State aktif: <code>{currentState}</code> — bukan accepting state</p>
        </div>
      </div>
    )
  }

  if (isAccepted) {
    return (
      <div className={`${styles.badge} ${styles.accepted}`}>
        <span className={styles.icon}>✓</span>
        <div>
          <p className={styles.title}>String Diterima</p>
          <p className={styles.sub}>State aktif: <code>{currentState}</code> ∈ F (accepting state)</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`${styles.badge} ${styles.processing}`}>
      <span className={styles.icon}>→</span>
      <div>
        <p className={styles.title}>Sedang diproses</p>
        <p className={styles.sub}>State aktif: <code>{currentState}</code> — belum mencapai accepting state</p>
      </div>
    </div>
  )
}
