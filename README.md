# DFA Pattern Recognition — Berbasis Web

Proyek mata kuliah **Pengantar Sains Komputasi**  
Implementasi Deterministic Finite Automata (DFA) untuk pengenalan pola karakter.

---

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Framework | React 18 + Vite 5 |
| Visualisasi | D3.js v7 |
| Styling | CSS Modules |
| Deployment | GitHub Pages / Vercel |

---

## Cara Menjalankan

### Prasyarat
- Node.js versi 18 atau lebih baru
- npm (sudah termasuk bersama Node.js)

### Langkah-langkah

```bash
# 1. Masuk ke folder proyek
cd dfa-pattern-recognition

# 2. Install dependencies
npm install

# 3. Jalankan development server
npm run dev
```

Buka browser dan akses: **http://localhost:5173**

---

## Build untuk Production

```bash
npm run build
```

File hasil build ada di folder `dist/` — bisa langsung di-deploy ke GitHub Pages atau Vercel.

---

## Fitur Aplikasi

- **4 pola DFA** yang bisa dipilih:
  - Email Address (`user@domain.tld`)
  - Nomor Telepon (`08xx-xxxx-xxxx`)
  - Bilangan Biner Genap (berakhir dengan `0`)
  - Password Kuat (huruf besar + kecil + angka, min 8 karakter)

- **Visualisasi diagram state** secara real-time menggunakan D3.js
  - Node aktif berubah warna sesuai state saat ini
  - Accepting state ditandai lingkaran ganda
  - Transisi terakhir di-highlight

- **Tabel transisi δ(q, σ)** yang menampilkan setiap langkah proses DFA

- **Status hasil** — string diterima (accepted) atau ditolak (rejected) beserta penjelasan

---

## Struktur Proyek

```
src/
├── lib/
│   ├── dfaDefinitions.js   # Definisi semua DFA (Q, Σ, δ, q₀, F)
│   └── useDFA.js           # Custom hook — engine DFA
├── components/
│   ├── DFAGraph.jsx        # Visualisasi diagram state (D3.js)
│   ├── TransitionTable.jsx # Tabel riwayat transisi
│   ├── PatternSelector.jsx # Sidebar pilihan pola
│   └── ResultBadge.jsx     # Indikator hasil accepted/rejected
├── App.jsx                 # Komponen utama & layout
├── App.module.css
├── index.css               # Global styles & CSS variables
└── main.jsx                # Entry point React
```

---

## Konsep DFA

DFA didefinisikan sebagai 5-tuple: **M = (Q, Σ, δ, q₀, F)**

| Simbol | Arti |
|--------|------|
| Q | Himpunan state yang berhingga |
| Σ | Alfabet (himpunan simbol input) |
| δ | Fungsi transisi: Q × Σ → Q |
| q₀ | State awal |
| F | Himpunan accepting states |

String diterima jika setelah semua karakter diproses, state akhir ∈ F.

---

## Menambah Pola DFA Baru

Edit file `src/lib/dfaDefinitions.js` dan tambahkan entri baru mengikuti struktur yang sudah ada:

```js
myPattern: {
  id: 'myPattern',
  name: 'Nama Pola',
  description: 'Deskripsi singkat',
  example: 'contoh_input',
  alphabet: 'deskripsi alfabet',
  states: ['q0', 'q1', 'qtrap'],
  startState: 'q0',
  acceptingStates: ['q1'],
  transition(state, char) {
    // implementasi fungsi δ
  },
  getEdges() {
    // daftar edge untuk D3 diagram
  }
}
```
