export const DFA_PATTERNS = {
  email: {
    id: 'email',
    name: 'Email Address',
    description: 'Validasi format email: user@domain.tld',
    example: 'user@mail.com',
    alphabet: 'huruf, angka, @, .',
    states: ['q0', 'q1', 'q2', 'q3', 'q4', 'q5', 'qtrap'],
    startState: 'q0',
    acceptingStates: ['q5'],
    stateLabels: {
      q0: 'Start',
      q1: 'Username',
      q2: 'After @',
      q3: 'Domain',
      q4: 'After dot',
      q5: 'Valid ✓',
      qtrap: 'Invalid ✗',
    },
    transition(state, char) {
      const isAlphaNum = /[a-zA-Z0-9_\-]/.test(char)
      const isDot = char === '.'
      const isAt = char === '@'
      switch (state) {
        case 'q0': return isAlphaNum ? 'q1' : 'qtrap'
        case 'q1':
          if (isAlphaNum) return 'q1'
          if (isAt) return 'q2'
          return 'qtrap'
        case 'q2': return isAlphaNum ? 'q3' : 'qtrap'
        case 'q3':
          if (isAlphaNum) return 'q3'
          if (isDot) return 'q4'
          return 'qtrap'
        case 'q4': return isAlphaNum ? 'q5' : 'qtrap'
        case 'q5':
          if (isAlphaNum) return 'q5'
          if (isDot) return 'q4'
          return 'qtrap'
        default: return 'qtrap'
      }
    },
    getEdges() {
      return [
        { from: 'q0', to: 'q1', label: 'a-z,0-9' },
        { from: 'q1', to: 'q1', label: 'a-z,0-9', self: true },
        { from: 'q1', to: 'q2', label: '@' },
        { from: 'q2', to: 'q3', label: 'a-z,0-9' },
        { from: 'q3', to: 'q3', label: 'a-z,0-9', self: true },
        { from: 'q3', to: 'q4', label: '.' },
        { from: 'q4', to: 'q5', label: 'a-z,0-9' },
        { from: 'q5', to: 'q5', label: 'a-z,0-9', self: true },
        { from: 'q5', to: 'q4', label: '.' },
        { from: 'q0', to: 'qtrap', label: 'lainnya' },
        { from: 'q1', to: 'qtrap', label: 'lainnya' },
        { from: 'q2', to: 'qtrap', label: 'lainnya' },
        { from: 'q3', to: 'qtrap', label: 'lainnya' },
        { from: 'q4', to: 'qtrap', label: 'lainnya' },
        { from: 'q5', to: 'qtrap', label: 'lainnya' },
        { from: 'qtrap', to: 'qtrap', label: '*', self: true },
      ]
    }
  },

  phone: {
    id: 'phone',
    name: 'Nomor Telepon',
    description: 'Format: 08xx-xxxx-xxxx (10–13 digit)',
    example: '081234567890',
    alphabet: 'digit 0-9',
    states: ['q0', 'q1', 'q2', 'q3', 'q4', 'q5', 'qtrap'],
    startState: 'q0',
    acceptingStates: ['q4', 'q5'],
    stateLabels: {
      q0: 'Start',
      q1: 'Digit 0',
      q2: 'Digit 8/9',
      q3: '3 digit',
      q4: '10-11 digit ✓',
      q5: '12-13 digit ✓',
      qtrap: 'Invalid ✗',
    },
    _count: 0,
    transition(state, char, history) {
      const isDigit = /[0-9]/.test(char)
      const len = (history ? history.length : 0) + 1
      switch (state) {
        case 'q0': return char === '0' ? 'q1' : 'qtrap'
        case 'q1': return (char === '8' || char === '9') ? 'q2' : 'qtrap'
        case 'q2': return isDigit ? 'q3' : 'qtrap'
        case 'q3':
          if (!isDigit) return 'qtrap'
          if (len >= 10 && len <= 11) return 'q4'
          if (len >= 12 && len <= 13) return 'q5'
          return 'q3'
        case 'q4':
          if (!isDigit) return 'qtrap'
          if (len <= 13) return 'q5'
          return 'qtrap'
        case 'q5':
          if (!isDigit || len > 13) return 'qtrap'
          return 'q5'
        default: return 'qtrap'
      }
    },
    getEdges() {
      return [
        { from: 'q0', to: 'q1', label: '0' },
        { from: 'q1', to: 'q2', label: '8 / 9' },
        { from: 'q2', to: 'q3', label: '0-9' },
        { from: 'q3', to: 'q3', label: '0-9', self: true },
        { from: 'q3', to: 'q4', label: '≥10 digit' },
        { from: 'q4', to: 'q5', label: '0-9' },
        { from: 'q5', to: 'q5', label: '0-9', self: true },
        { from: 'q0', to: 'qtrap', label: 'lainnya' },
        { from: 'q1', to: 'qtrap', label: 'lainnya' },
        { from: 'q2', to: 'qtrap', label: 'lainnya' },
        { from: 'qtrap', to: 'qtrap', label: '*', self: true },
      ]
    }
  },

  binary: {
    id: 'binary',
    name: 'Bilangan Biner Genap',
    description: 'String biner yang nilainya genap (berakhir dengan 0)',
    example: '1010',
    alphabet: '0, 1',
    states: ['q0', 'q1', 'qtrap'],
    startState: 'q0',
    acceptingStates: ['q0'],
    stateLabels: {
      q0: 'Genap ✓',
      q1: 'Ganjil',
      qtrap: 'Invalid ✗',
    },
    transition(state, char) {
      if (char !== '0' && char !== '1') return 'qtrap'
      switch (state) {
        case 'q0': return char === '0' ? 'q0' : 'q1'
        case 'q1': return char === '0' ? 'q0' : 'q1'
        default: return 'qtrap'
      }
    },
    getEdges() {
      return [
        { from: 'q0', to: 'q0', label: '0', self: true },
        { from: 'q0', to: 'q1', label: '1' },
        { from: 'q1', to: 'q0', label: '0' },
        { from: 'q1', to: 'q1', label: '1', self: true },
        { from: 'q0', to: 'qtrap', label: 'lainnya' },
        { from: 'q1', to: 'qtrap', label: 'lainnya' },
        { from: 'qtrap', to: 'qtrap', label: '*', self: true },
      ]
    }
  },

  password: {
    id: 'password',
    name: 'Password Kuat',
    description: 'Min 8 karakter, ada huruf besar, kecil, dan angka',
    example: 'Hello123',
    alphabet: 'huruf besar, kecil, angka',
    states: ['q0', 'q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'qtrap'],
    startState: 'q0',
    acceptingStates: ['q7'],
    stateLabels: {
      q0: 'Start',
      q1: 'Ada huruf kecil',
      q2: 'Ada huruf besar',
      q3: 'Ada angka',
      q4: 'Kecil+Besar',
      q5: 'Kecil+Angka',
      q6: 'Besar+Angka',
      q7: 'Semua terpenuhi ✓',
      qtrap: 'Karakter invalid ✗',
    },
    transition(state, char, history) {
      const isLower = /[a-z]/.test(char)
      const isUpper = /[A-Z]/.test(char)
      const isDigit = /[0-9]/.test(char)
      if (!isLower && !isUpper && !isDigit) return 'qtrap'

      const len = (history ? history.length : 0) + 1
      const hasMinLen = len >= 8

      const stateMap = {
        hasLower: false, hasUpper: false, hasDigit: false
      }
      if (history) {
        history.forEach(h => {
          if (/[a-z]/.test(h.char)) stateMap.hasLower = true
          if (/[A-Z]/.test(h.char)) stateMap.hasUpper = true
          if (/[0-9]/.test(h.char)) stateMap.hasDigit = true
        })
      }
      if (isLower) stateMap.hasLower = true
      if (isUpper) stateMap.hasUpper = true
      if (isDigit) stateMap.hasDigit = true

      const { hasLower, hasUpper, hasDigit } = stateMap
      const allTypes = hasLower && hasUpper && hasDigit

      if (allTypes && hasMinLen) return 'q7'
      if (hasLower && hasUpper && !hasDigit) return 'q4'
      if (hasLower && !hasUpper && hasDigit) return 'q5'
      if (!hasLower && hasUpper && hasDigit) return 'q6'
      if (hasLower && !hasUpper && !hasDigit) return 'q1'
      if (!hasLower && hasUpper && !hasDigit) return 'q2'
      if (!hasLower && !hasUpper && hasDigit) return 'q3'
      return 'q0'
    },
    getEdges() {
      return [
        { from: 'q0', to: 'q1', label: 'a-z' },
        { from: 'q0', to: 'q2', label: 'A-Z' },
        { from: 'q0', to: 'q3', label: '0-9' },
        { from: 'q1', to: 'q4', label: 'A-Z' },
        { from: 'q1', to: 'q5', label: '0-9' },
        { from: 'q2', to: 'q4', label: 'a-z' },
        { from: 'q2', to: 'q6', label: '0-9' },
        { from: 'q3', to: 'q5', label: 'a-z' },
        { from: 'q3', to: 'q6', label: 'A-Z' },
        { from: 'q4', to: 'q7', label: '0-9 ≥8' },
        { from: 'q5', to: 'q7', label: 'A-Z ≥8' },
        { from: 'q6', to: 'q7', label: 'a-z ≥8' },
        { from: 'q7', to: 'q7', label: 'semua', self: true },
        { from: 'q0', to: 'qtrap', label: 'lainnya' },
        { from: 'qtrap', to: 'qtrap', label: '*', self: true },
      ]
    }
  },

  url: {
    id: 'url',
    name: 'URL Website',
    description: 'Format sederhana: http://domain.tld atau https://domain.tld',
    example: 'https://dfa.id',
    alphabet: 'huruf, angka, :, /, ., -',
    states: ['q0', 'q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10', 'qtrap'],
    startState: 'q0',
    acceptingStates: ['q10'],
    stateLabels: {
      q0: 'Start',
      q1: 'h',
      q2: 'ht',
      q3: 'htt',
      q4: 'http',
      q5: 'https',
      q6: 'Colon',
      q7: 'Slash 1',
      q8: 'Domain',
      q9: 'After dot',
      q10: 'TLD valid ✓',
      qtrap: 'Invalid ✗',
    },
    transition(state, char) {
      const isDomainChar = /[a-zA-Z0-9-]/.test(char)
      const isLetter = /[a-zA-Z]/.test(char)
      switch (state) {
        case 'q0': return char === 'h' ? 'q1' : 'qtrap'
        case 'q1': return char === 't' ? 'q2' : 'qtrap'
        case 'q2': return char === 't' ? 'q3' : 'qtrap'
        case 'q3': return char === 'p' ? 'q4' : 'qtrap'
        case 'q4':
          if (char === 's') return 'q5'
          if (char === ':') return 'q6'
          return 'qtrap'
        case 'q5': return char === ':' ? 'q6' : 'qtrap'
        case 'q6': return char === '/' ? 'q7' : 'qtrap'
        case 'q7': return char === '/' ? 'q8' : 'qtrap'
        case 'q8':
          if (isDomainChar) return 'q8'
          if (char === '.') return 'q9'
          return 'qtrap'
        case 'q9': return isLetter ? 'q10' : 'qtrap'
        case 'q10':
          if (isLetter) return 'q10'
          if (char === '.') return 'q9'
          return 'qtrap'
        default: return 'qtrap'
      }
    },
    getEdges() {
      return [
        { from: 'q0', to: 'q1', label: 'h' },
        { from: 'q1', to: 'q2', label: 't' },
        { from: 'q2', to: 'q3', label: 't' },
        { from: 'q3', to: 'q4', label: 'p' },
        { from: 'q4', to: 'q5', label: 's' },
        { from: 'q4', to: 'q6', label: ':' },
        { from: 'q5', to: 'q6', label: ':' },
        { from: 'q6', to: 'q7', label: '/' },
        { from: 'q7', to: 'q8', label: '/' },
        { from: 'q8', to: 'q8', label: 'a-z,0-9,-', self: true },
        { from: 'q8', to: 'q9', label: '.' },
        { from: 'q9', to: 'q10', label: 'a-z' },
        { from: 'q10', to: 'q10', label: 'a-z', self: true },
        { from: 'q10', to: 'q9', label: '.' },
        { from: 'q0', to: 'qtrap', label: 'lainnya' },
        { from: 'q4', to: 'qtrap', label: 'lainnya' },
        { from: 'q8', to: 'qtrap', label: 'lainnya' },
        { from: 'q9', to: 'qtrap', label: 'lainnya' },
        { from: 'q10', to: 'qtrap', label: 'lainnya' },
        { from: 'qtrap', to: 'qtrap', label: '*', self: true },
      ]
    }
  },

  identifier: {
    id: 'identifier',
    name: 'Identifier Variabel',
    description: 'Nama variabel: diawali huruf/_ lalu huruf, angka, atau _',
    example: 'nilai_akhir1',
    alphabet: 'huruf, angka, underscore',
    states: ['q0', 'q1', 'qtrap'],
    startState: 'q0',
    acceptingStates: ['q1'],
    stateLabels: {
      q0: 'Start',
      q1: 'Identifier ✓',
      qtrap: 'Invalid ✗',
    },
    transition(state, char) {
      const isFirstChar = /[a-zA-Z_]/.test(char)
      const isNextChar = /[a-zA-Z0-9_]/.test(char)
      switch (state) {
        case 'q0': return isFirstChar ? 'q1' : 'qtrap'
        case 'q1': return isNextChar ? 'q1' : 'qtrap'
        default: return 'qtrap'
      }
    },
    getEdges() {
      return [
        { from: 'q0', to: 'q1', label: 'a-z, _' },
        { from: 'q1', to: 'q1', label: 'a-z,0-9,_', self: true },
        { from: 'q0', to: 'qtrap', label: 'lainnya' },
        { from: 'q1', to: 'qtrap', label: 'lainnya' },
        { from: 'qtrap', to: 'qtrap', label: '*', self: true },
      ]
    }
  },

  lexer: {
    id: 'lexer',
    name: 'Token Lexical Analyzer',
    description: 'Klasifikasi token: identifier, angka, atau operator',
    example: 'total_2026',
    alphabet: 'huruf, angka, _, operator',
    states: ['q0', 'qid', 'qnum', 'qop', 'qop2', 'qtrap'],
    startState: 'q0',
    acceptingStates: ['qid', 'qnum', 'qop', 'qop2'],
    stateLabels: {
      q0: 'Start',
      qid: 'Identifier ✓',
      qnum: 'Number ✓',
      qop: 'Operator ✓',
      qop2: 'Operator 2 ✓',
      qtrap: 'Invalid ✗',
    },
    transition(state, char) {
      const isLetterOrUnderscore = /[a-zA-Z_]/.test(char)
      const isAlphaNumUnderscore = /[a-zA-Z0-9_]/.test(char)
      const isDigit = /[0-9]/.test(char)
      const isOperator = /[+\-*/=<>!]/.test(char)

      switch (state) {
        case 'q0':
          if (isLetterOrUnderscore) return 'qid'
          if (isDigit) return 'qnum'
          if (isOperator) return 'qop'
          return 'qtrap'
        case 'qid': return isAlphaNumUnderscore ? 'qid' : 'qtrap'
        case 'qnum': return isDigit ? 'qnum' : 'qtrap'
        case 'qop': return char === '=' ? 'qop2' : 'qtrap'
        default: return 'qtrap'
      }
    },
    getEdges() {
      return [
        { from: 'q0', to: 'qid', label: 'a-z, _' },
        { from: 'q0', to: 'qnum', label: '0-9' },
        { from: 'q0', to: 'qop', label: '+-*/=<>!' },
        { from: 'qid', to: 'qid', label: 'a-z,0-9,_', self: true },
        { from: 'qnum', to: 'qnum', label: '0-9', self: true },
        { from: 'qop', to: 'qop2', label: '=' },
        { from: 'q0', to: 'qtrap', label: 'lainnya' },
        { from: 'qid', to: 'qtrap', label: 'lainnya' },
        { from: 'qnum', to: 'qtrap', label: 'lainnya' },
        { from: 'qop', to: 'qtrap', label: 'lainnya' },
        { from: 'qop2', to: 'qtrap', label: 'lainnya' },
        { from: 'qtrap', to: 'qtrap', label: '*', self: true },
      ]
    }
  },

  dnaCodon: {
    id: 'dnaCodon',
    name: 'Start & Stop Codon DNA',
    description: 'Bioinformatika: DNA dimulai ATG dan berhenti di TAA/TAG/TGA',
    example: 'ATGAAATAA',
    alphabet: 'A, T, G, C',
    states: ['q0', 'qA', 'qAT', 'qBody0', 'qT1', 'qTA2', 'qTG2', 'qBody1', 'qBody2', 'qstop', 'qtrap'],
    startState: 'q0',
    acceptingStates: ['qstop'],
    stateLabels: {
      q0: 'Start',
      qA: 'A',
      qAT: 'AT',
      qBody0: 'Codon boundary',
      qT1: 'T',
      qTA2: 'TA',
      qTG2: 'TG',
      qBody1: 'Codon pos 1',
      qBody2: 'Codon pos 2',
      qstop: 'Stop codon ✓',
      qtrap: 'Invalid ✗',
    },
    transition(state, char) {
      const isBase = /[ATGC]/.test(char)
      if (!isBase) return 'qtrap'

      switch (state) {
        case 'q0': return char === 'A' ? 'qA' : 'qtrap'
        case 'qA': return char === 'T' ? 'qAT' : 'qtrap'
        case 'qAT': return char === 'G' ? 'qBody0' : 'qtrap'
        case 'qBody0':
          if (char === 'T') return 'qT1'
          return 'qBody1'
        case 'qT1':
          if (char === 'A') return 'qTA2'
          if (char === 'G') return 'qTG2'
          return 'qBody2'
        case 'qTA2':
          if (char === 'A' || char === 'G') return 'qstop'
          return 'qBody0'
        case 'qTG2':
          if (char === 'A') return 'qstop'
          return 'qBody0'
        case 'qBody1': return 'qBody2'
        case 'qBody2': return 'qBody0'
        default: return 'qtrap'
      }
    },
    getEdges() {
      return [
        { from: 'q0', to: 'qA', label: 'A' },
        { from: 'qA', to: 'qAT', label: 'T' },
        { from: 'qAT', to: 'qBody0', label: 'G' },
        { from: 'qBody0', to: 'qT1', label: 'T' },
        { from: 'qBody0', to: 'qBody1', label: 'A/C/G' },
        { from: 'qT1', to: 'qTA2', label: 'A' },
        { from: 'qT1', to: 'qTG2', label: 'G' },
        { from: 'qT1', to: 'qBody2', label: 'C/T' },
        { from: 'qTA2', to: 'qstop', label: 'A/G' },
        { from: 'qTA2', to: 'qBody0', label: 'C/T' },
        { from: 'qTG2', to: 'qstop', label: 'A' },
        { from: 'qTG2', to: 'qBody0', label: 'C/G/T' },
        { from: 'qBody1', to: 'qBody2', label: 'A/T/G/C' },
        { from: 'qBody2', to: 'qBody0', label: 'A/T/G/C' },
        { from: 'qstop', to: 'qtrap', label: 'lanjut' },
        { from: 'qtrap', to: 'qtrap', label: '*', self: true },
      ]
    }
  },

  binaryMultiple3: {
    id: 'binaryMultiple3',
    name: 'Biner Kelipatan 3',
    description: 'Matematika komputasi: nilai biner habis dibagi 3',
    example: '110',
    alphabet: '0, 1',
    states: ['q0', 'q1', 'q2', 'qtrap'],
    startState: 'q0',
    acceptingStates: ['q0'],
    stateLabels: {
      q0: 'Sisa 0 ✓',
      q1: 'Sisa 1',
      q2: 'Sisa 2',
      qtrap: 'Invalid ✗',
    },
    transition(state, char) {
      if (char !== '0' && char !== '1') return 'qtrap'
      const bit = Number(char)
      switch (state) {
        case 'q0': return bit === 0 ? 'q0' : 'q1'
        case 'q1': return bit === 0 ? 'q2' : 'q0'
        case 'q2': return bit === 0 ? 'q1' : 'q2'
        default: return 'qtrap'
      }
    },
    getEdges() {
      return [
        { from: 'q0', to: 'q0', label: '0', self: true },
        { from: 'q0', to: 'q1', label: '1' },
        { from: 'q1', to: 'q2', label: '0' },
        { from: 'q1', to: 'q0', label: '1' },
        { from: 'q2', to: 'q1', label: '0' },
        { from: 'q2', to: 'q2', label: '1', self: true },
        { from: 'q0', to: 'qtrap', label: 'lainnya' },
        { from: 'q1', to: 'qtrap', label: 'lainnya' },
        { from: 'q2', to: 'qtrap', label: 'lainnya' },
        { from: 'qtrap', to: 'qtrap', label: '*', self: true },
      ]
    }
  },

  ipv4: {
    id: 'ipv4',
    name: 'Alamat IPv4',
    description: 'Validasi input: empat oktet 0-255 dipisahkan titik',
    example: '192.168.1.1',
    alphabet: 'digit 0-9 dan titik',
    states: ['q0', 'qOctet', 'qDot', 'qvalid', 'qtrap'],
    startState: 'q0',
    acceptingStates: ['qvalid'],
    stateLabels: {
      q0: 'Start',
      qOctet: 'Membaca oktet',
      qDot: 'Titik',
      qvalid: 'IPv4 valid ✓',
      qtrap: 'Invalid ✗',
    },
    transition(state, char, history) {
      if (state === 'qtrap') return 'qtrap'
      const input = `${history ? history.map(step => step.char).join('') : ''}${char}`
      if (!/^[0-9.]+$/.test(input)) return 'qtrap'
      if (input.startsWith('.') || input.includes('..')) return 'qtrap'

      const parts = input.split('.')
      if (parts.length > 4) return 'qtrap'

      for (const part of parts) {
        if (part === '') continue
        if (part.length > 3) return 'qtrap'
        if (part.length > 1 && part.startsWith('0')) return 'qtrap'
        if (Number(part) > 255) return 'qtrap'
      }

      const lastPart = parts[parts.length - 1]
      if (parts.length === 4 && lastPart !== '') return 'qvalid'
      if (char === '.') return 'qDot'
      return 'qOctet'
    },
    getEdges() {
      return [
        { from: 'q0', to: 'qOctet', label: '0-9' },
        { from: 'qOctet', to: 'qOctet', label: '0-9', self: true },
        { from: 'qOctet', to: 'qDot', label: '.' },
        { from: 'qDot', to: 'qOctet', label: '0-9' },
        { from: 'qOctet', to: 'qvalid', label: 'oktet ke-4' },
        { from: 'qvalid', to: 'qvalid', label: '0-9', self: true },
        { from: 'q0', to: 'qtrap', label: 'lainnya' },
        { from: 'qOctet', to: 'qtrap', label: '>255/format salah' },
        { from: 'qDot', to: 'qtrap', label: 'titik/lainnya' },
        { from: 'qvalid', to: 'qtrap', label: 'titik/lainnya' },
        { from: 'qtrap', to: 'qtrap', label: '*', self: true },
      ]
    }
  },

  tcpHandshake: {
    id: 'tcpHandshake',
    name: 'TCP 3-Way Handshake',
    description: 'Protokol jaringan: S=SYN, C=SYN-ACK, A=ACK',
    example: 'SCA',
    alphabet: 'S, C, A',
    states: ['q0', 'qSyn', 'qSynAck', 'qEstablished', 'qtrap'],
    startState: 'q0',
    acceptingStates: ['qEstablished'],
    stateLabels: {
      q0: 'Closed',
      qSyn: 'SYN sent',
      qSynAck: 'SYN-ACK',
      qEstablished: 'Established ✓',
      qtrap: 'Invalid ✗',
    },
    transition(state, char) {
      switch (state) {
        case 'q0': return char === 'S' ? 'qSyn' : 'qtrap'
        case 'qSyn': return char === 'C' ? 'qSynAck' : 'qtrap'
        case 'qSynAck': return char === 'A' ? 'qEstablished' : 'qtrap'
        default: return 'qtrap'
      }
    },
    getEdges() {
      return [
        { from: 'q0', to: 'qSyn', label: 'SYN (S)' },
        { from: 'qSyn', to: 'qSynAck', label: 'SYN-ACK (C)' },
        { from: 'qSynAck', to: 'qEstablished', label: 'ACK (A)' },
        { from: 'q0', to: 'qtrap', label: 'lainnya' },
        { from: 'qSyn', to: 'qtrap', label: 'lainnya' },
        { from: 'qSynAck', to: 'qtrap', label: 'lainnya' },
        { from: 'qEstablished', to: 'qtrap', label: 'lanjut' },
        { from: 'qtrap', to: 'qtrap', label: '*', self: true },
      ]
    }
  }
}
