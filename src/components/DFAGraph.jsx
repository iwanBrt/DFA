import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

const W = 700
const H = 340

function getStatePositions(states, pattern) {
  const count = states.filter(s => s !== 'qtrap').length
  const mainStates = states.filter(s => s !== 'qtrap')
  const positions = {}

  if (mainStates.length <= 4) {
    mainStates.forEach((s, i) => {
      positions[s] = {
        x: 80 + i * ((W - 140) / (mainStates.length - 1 || 1)),
        y: H / 2
      }
    })
  } else if (mainStates.length <= 6) {
    const top = mainStates.slice(0, Math.ceil(mainStates.length / 2))
    const bot = mainStates.slice(Math.ceil(mainStates.length / 2))
    top.forEach((s, i) => {
      positions[s] = { x: 80 + i * ((W - 140) / (top.length - 1 || 1)), y: H / 3 }
    })
    bot.forEach((s, i) => {
      positions[s] = { x: 80 + i * ((W - 140) / (bot.length - 1 || 1)), y: (H * 2) / 3 }
    })
  } else {
    const perRow = Math.ceil(mainStates.length / 2)
    const top = mainStates.slice(0, perRow)
    const bot = mainStates.slice(perRow)
    top.forEach((s, i) => {
      positions[s] = { x: 60 + i * ((W - 100) / (top.length - 1 || 1)), y: H / 3 }
    })
    bot.forEach((s, i) => {
      positions[s] = { x: 60 + i * ((W - 100) / (bot.length - 1 || 1)), y: (H * 2) / 3 }
    })
  }

  positions['qtrap'] = { x: W - 60, y: H - 50 }
  return positions
}

export default function DFAGraph({ pattern, currentState, history }) {
  const svgRef = useRef(null)

  useEffect(() => {
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const positions = getStatePositions(pattern.states, pattern)
    const edges = pattern.getEdges()
    const R = 28

    svg.attr('viewBox', `0 0 ${W} ${H}`)

    const defs = svg.append('defs')
    const makeMarker = (id, color) => {
      defs.append('marker')
        .attr('id', id)
        .attr('viewBox', '0 0 10 10')
        .attr('refX', 9).attr('refY', 5)
        .attr('markerWidth', 5).attr('markerHeight', 5)
        .attr('orient', 'auto-start-reverse')
        .append('path')
        .attr('d', 'M1 1L9 5L1 9')
        .attr('fill', 'none')
        .attr('stroke', color)
        .attr('stroke-width', 2)
        .attr('stroke-linecap', 'round')
    }
    makeMarker('arrow-default', '#3a3a4e')
    makeMarker('arrow-active', '#7c6af7')
    makeMarker('arrow-trap', '#f25c5c')

    const lastStep = history.length > 0 ? history[history.length - 1] : null

    edges.forEach(edge => {
      const from = positions[edge.from]
      const to = positions[edge.to]
      if (!from || !to) return

      const isRecent = lastStep && lastStep.from === edge.from && lastStep.to === edge.to
      const isTrap = edge.to === 'qtrap'
      const color = isRecent ? (isTrap ? '#f25c5c' : '#7c6af7') : '#2a2a3a'
      const markerId = isRecent ? (isTrap ? 'arrow-trap' : 'arrow-active') : 'arrow-default'
      const strokeW = isRecent ? 2 : 1

      if (edge.self) {
        const cx = from.x
        const cy = from.y - R - 10
        const r = 16
        svg.append('path')
          .attr('d', `M ${cx - r * 0.7} ${cy + r * 0.5} A ${r} ${r} 0 1 1 ${cx + r * 0.7} ${cy + r * 0.5}`)
          .attr('fill', 'none')
          .attr('stroke', color)
          .attr('stroke-width', strokeW)
          .attr('marker-end', `url(#${markerId})`)

        svg.append('text')
          .attr('x', cx)
          .attr('y', cy - r - 2)
          .attr('text-anchor', 'middle')
          .attr('fill', isRecent ? '#a594f9' : '#5a5a70')
          .attr('font-size', 10)
          .attr('font-family', 'JetBrains Mono, monospace')
          .text(edge.label)
        return
      }

      const dx = to.x - from.x
      const dy = to.y - from.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      const nx = dx / dist
      const ny = dy / dist

      const sx = from.x + nx * R
      const sy = from.y + ny * R
      const ex = to.x - nx * (R + 2)
      const ey = to.y - ny * (R + 2)

      const reverse = edges.find(e => e.from === edge.to && e.to === edge.from && !e.self)
      const curve = reverse ? 25 : 0
      const mx = (sx + ex) / 2 - ny * curve
      const my = (sy + ey) / 2 + nx * curve

      let pathD
      if (curve !== 0) {
        pathD = `M ${sx} ${sy} Q ${mx} ${my} ${ex} ${ey}`
      } else {
        pathD = `M ${sx} ${sy} L ${ex} ${ey}`
      }

      svg.append('path')
        .attr('d', pathD)
        .attr('fill', 'none')
        .attr('stroke', color)
        .attr('stroke-width', strokeW)
        .attr('marker-end', `url(#${markerId})`)

      const lx = curve !== 0 ? mx : (sx + ex) / 2
      const ly = curve !== 0 ? my : (sy + ey) / 2

      if (edge.label && edge.to !== 'qtrap') {
        svg.append('text')
          .attr('x', lx)
          .attr('y', ly - 6)
          .attr('text-anchor', 'middle')
          .attr('fill', isRecent ? '#a594f9' : '#3a3a4e')
          .attr('font-size', 10)
          .attr('font-family', 'JetBrains Mono, monospace')
          .text(edge.label)
      }
    })

    pattern.states.forEach(state => {
      const pos = positions[state]
      if (!pos) return

      const isStart = state === pattern.startState
      const isAccept = pattern.acceptingStates.includes(state)
      const isCurrent = state === currentState
      const isTrap = state === 'qtrap'

      let fillColor = '#1a1a24'
      let strokeColor = '#2a2a3a'
      let strokeW = 1.5
      let textColor = '#5a5a70'

      if (isCurrent) {
        if (isTrap) { fillColor = 'rgba(242,92,92,0.15)'; strokeColor = '#f25c5c'; textColor = '#f25c5c'; strokeW = 2.5 }
        else if (isAccept) { fillColor = 'rgba(45,212,160,0.15)'; strokeColor = '#2dd4a0'; textColor = '#2dd4a0'; strokeW = 2.5 }
        else { fillColor = 'rgba(124,106,247,0.15)'; strokeColor = '#7c6af7'; textColor = '#a594f9'; strokeW = 2.5 }
      } else if (isAccept) {
        strokeColor = '#1D9E75'
        textColor = '#2dd4a0'
      } else if (isTrap) {
        strokeColor = '#993C1D'
        textColor = '#f25c5c'
        fillColor = 'rgba(242,92,92,0.05)'
      }

      if (isStart && !isCurrent) {
        svg.append('line')
          .attr('x1', pos.x - R - 22).attr('y1', pos.y)
          .attr('x2', pos.x - R - 2).attr('y2', pos.y)
          .attr('stroke', '#3a3a4e').attr('stroke-width', 1.5)
          .attr('marker-end', 'url(#arrow-default)')
        svg.append('text')
          .attr('x', pos.x - R - 26).attr('y', pos.y + 4)
          .attr('text-anchor', 'end')
          .attr('fill', '#3a3a4e').attr('font-size', 10)
          .attr('font-family', 'JetBrains Mono, monospace')
          .text('start')
      }

      const g = svg.append('g')

      if (isAccept) {
        g.append('circle')
          .attr('cx', pos.x).attr('cy', pos.y)
          .attr('r', R + 5)
          .attr('fill', 'none')
          .attr('stroke', isCurrent ? '#2dd4a0' : '#1D9E75')
          .attr('stroke-width', 1)
          .attr('stroke-dasharray', '3,2')
          .attr('opacity', 0.6)
      }

      g.append('circle')
        .attr('cx', pos.x).attr('cy', pos.y).attr('r', R)
        .attr('fill', fillColor)
        .attr('stroke', strokeColor)
        .attr('stroke-width', strokeW)

      const label = pattern.stateLabels[state] || state
      const lines = label.split(' ')

      if (lines.length === 1) {
        g.append('text')
          .attr('x', pos.x).attr('y', pos.y - 6)
          .attr('text-anchor', 'middle').attr('dominant-baseline', 'central')
          .attr('fill', textColor).attr('font-size', 11)
          .attr('font-family', 'JetBrains Mono, monospace')
          .attr('font-weight', isCurrent ? '700' : '400')
          .text(state)

        g.append('text')
          .attr('x', pos.x).attr('y', pos.y + 10)
          .attr('text-anchor', 'middle').attr('dominant-baseline', 'central')
          .attr('fill', isCurrent ? textColor : '#3a3a4e').attr('font-size', 9)
          .attr('font-family', 'Space Grotesk, sans-serif')
          .text(label)
      } else {
        g.append('text')
          .attr('x', pos.x).attr('y', pos.y - 8)
          .attr('text-anchor', 'middle').attr('dominant-baseline', 'central')
          .attr('fill', textColor).attr('font-size', 11)
          .attr('font-family', 'JetBrains Mono, monospace')
          .attr('font-weight', isCurrent ? '700' : '400')
          .text(state)

        lines.slice(0, 2).forEach((line, i) => {
          g.append('text')
            .attr('x', pos.x).attr('y', pos.y + 5 + i * 10)
            .attr('text-anchor', 'middle').attr('dominant-baseline', 'central')
            .attr('fill', isCurrent ? textColor : '#3a3a4e').attr('font-size', 8)
            .attr('font-family', 'Space Grotesk, sans-serif')
            .text(line)
        })
      }
    })
  }, [pattern, currentState, history])

  return (
    <div style={{ width: '100%', background: '#0e0e16', borderRadius: 12, border: '1px solid #1e1e2e', overflow: 'hidden' }}>
      <svg ref={svgRef} style={{ width: '100%', display: 'block' }} />
    </div>
  )
}
