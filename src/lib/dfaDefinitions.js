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
  }
}
