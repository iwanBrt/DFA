import { useState, useCallback, useEffect } from 'react'

export function useDFA(pattern) {
  const [currentState, setCurrentState] = useState(pattern.startState)
  const [history, setHistory] = useState([])
  const [inputValue, setInputValue] = useState('')

  const isAccepted = pattern.acceptingStates.includes(currentState)
  const isTrapped = currentState === 'qtrap'
  const isEmpty = inputValue.length === 0

  useEffect(() => {
    setCurrentState(pattern.startState)
    setHistory([])
    setInputValue('')
  }, [pattern])

  const processChar = useCallback((char, prevState, prevHistory) => {
    const nextState = pattern.transition(prevState, char, prevHistory)
    return {
      step: prevHistory.length + 1,
      char,
      from: prevState,
      to: nextState,
      accepted: pattern.acceptingStates.includes(nextState),
    }
  }, [pattern])

  const handleInput = useCallback((value) => {
    setInputValue(value)
    if (value.length === 0) {
      setCurrentState(pattern.startState)
      setHistory([])
      return
    }

    let state = pattern.startState
    const newHistory = []
    for (const char of value) {
      const step = processChar(char, state, newHistory)
      newHistory.push(step)
      state = step.to
    }
    setCurrentState(state)
    setHistory(newHistory)
  }, [pattern, processChar])

  const reset = useCallback(() => {
    setCurrentState(pattern.startState)
    setHistory([])
    setInputValue('')
  }, [pattern])

  const loadExample = useCallback(() => {
    handleInput(pattern.example)
  }, [pattern, handleInput])

  return {
    currentState,
    history,
    inputValue,
    isAccepted,
    isTrapped,
    isEmpty,
    handleInput,
    reset,
    loadExample,
  }
}
