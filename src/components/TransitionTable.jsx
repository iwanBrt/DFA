import styles from './TransitionTable.module.css'

export default function TransitionTable({ history, pattern }) {
  if (history.length === 0) {
    return (
      <div className={styles.empty}>
        <span>Tabel transisi akan muncul saat kamu mengetik input</span>
      </div>
    )
  }

  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Step</th>
            <th>Karakter</th>
            <th>State Asal</th>
            <th>δ(q, σ)</th>
            <th>State Berikut</th>
          </tr>
        </thead>
        <tbody>
          {history.map((row, i) => {
            const isLast = i === history.length - 1
            const isTrap = row.to === 'qtrap'
            const isAccept = pattern.acceptingStates.includes(row.to)
            return (
              <tr
                key={i}
                className={[
                  isLast ? styles.lastRow : '',
                  isTrap && isLast ? styles.trapRow : '',
                  isAccept && isLast ? styles.acceptRow : '',
                ].join(' ')}
              >
                <td className={styles.step}>{row.step}</td>
                <td className={styles.char}><code>{row.char}</code></td>
                <td className={styles.state}><code>{row.from}</code></td>
                <td className={styles.func}>
                  <code>δ({row.from}, {row.char})</code>
                </td>
                <td className={styles.state}>
                  <code className={isTrap ? styles.trapState : isAccept ? styles.acceptState : ''}>
                    {row.to}
                  </code>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
