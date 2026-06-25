import { useRef, useEffect } from 'react'

const DPR = Math.min(window.devicePixelRatio || 1, 2)

function useMatrixRenderer(draw) {
  const canvasRef = useRef(null)
  const stateRef = useRef({ w: 0, h: 0 })
  const animRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const parent = canvas.parentElement
    const ctx = canvas.getContext('2d')
    let running = true

    function resize() {
      const rect = parent.getBoundingClientRect()
      if (rect.width < 1 || rect.height < 1) return
      stateRef.current.w = rect.width
      stateRef.current.h = rect.height
      canvas.width = rect.width * DPR
      canvas.height = rect.height * DPR
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(parent)

    function frame(t) {
      if (!running) return
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
      ctx.clearRect(0, 0, stateRef.current.w, stateRef.current.h)
      draw(ctx, stateRef.current.w, stateRef.current.h, t)
      animRef.current = requestAnimationFrame(frame)
    }
    animRef.current = requestAnimationFrame(frame)

    return () => {
      running = false
      if (animRef.current) cancelAnimationFrame(animRef.current)
      ro.disconnect()
    }
  }, [draw])

  return canvasRef
}

function DotCanvas({ draw, className }) {
  const canvasRef = useMatrixRenderer(draw)
  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: 'block', width: '100%', height: '100%' }}
    />
  )
}

/* ════════════════════════════════════════════
   1. SEISMIC WAVEFORM — 3D dot matrix
   ════════════════════════════════════════════ */

const _seismic = {
  data: [],
  maxCols: 90,
  init() {
    for (let i = 0; i < this.maxCols; i++) this.data.push(this._genWave(i, 0))
  },
  _genWave(i, t) {
    return (
      Math.sin(i * 0.12 + t) * 28 +
      Math.sin(i * 0.37 + t * 1.3) * 14 +
      Math.sin(i * 0.08 - t * 0.7) * 10
    )
  },
}
_seismic.init()

function drawSeismic(ctx, w, h, t) {
  const time = (t / 1000) * 3.6

  _seismic.data.push(_seismic._genWave(_seismic.data.length, time))
  if (_seismic.data.length > _seismic.maxCols) _seismic.data.shift()

  ctx.fillStyle = '#ebe5d4'
  ctx.fillRect(0, 0, w, h)

  const fov = 350
  const cx = w / 2
  const cy = h / 2 + 30
  const colSpacing = 8
  const rowSpacing = 7
  const rows = 28
  const depthStep = 6

  for (let i = _seismic.data.length - 1; i >= 0; i--) {
    const colIndex = _seismic.data.length - 1 - i
    const x3d = (i - _seismic.data.length / 2) * colSpacing
    const z3d = colIndex * depthStep
    const scale = fov / (fov + z3d)
    const px = cx + x3d * scale
    const waveY = _seismic.data[i]

    for (let j = -rows / 2; j < rows / 2; j++) {
      const y3d = j * rowSpacing
      const py = cy + (y3d - waveY * 0.45) * scale
      const dist = Math.abs(y3d - waveY)

      if (dist < 20) {
        const brightness = 1 - dist / 20
        ctx.fillStyle = `rgba(${Math.floor(22 + brightness * 198)}, ${Math.floor(21 + brightness * 234)}, ${Math.floor(15 + brightness * 37)}, ${brightness * scale})`
        ctx.beginPath()
        ctx.arc(px, py, (1.2 + brightness * 2) * scale, 0, Math.PI * 2)
        ctx.fill()
      } else {
        ctx.fillStyle = `rgba(22, 21, 15, ${0.02 * scale})`
        ctx.beginPath()
        ctx.arc(px, py, 1 * scale, 0, Math.PI * 2)
        ctx.fill()
      }
    }
  }

  ctx.fillStyle = 'rgba(22, 21, 15, 0.03)'
  for (let y = 0; y < h; y += 4) ctx.fillRect(0, y, w, 2)
}

export function SeismicWaveform3D({ reduced }) {
  const draw = reduced ? (ctx, w, h) => drawSeismic(ctx, w, h, 0) : drawSeismic
  return <DotCanvas draw={draw} />
}

/* ════════════════════════════════════════════
   2. RADAR — rotating PPI sweep with blips
   ════════════════════════════════════════════ */

const _radar = {
  angle: 0,
  blips: [],
  init() {
    this.spawnBlip()
    this.spawnBlip()
  },
  spawnBlip() {
    const r = 0.2 + Math.random() * 0.75
    const theta = Math.random() * Math.PI * 2
    this.blips.push({
      r,
      theta,
      intensity: 0,
      life: 1,
      hit: false,
      size: 2 + Math.random() * 3,
    })
  },
}
_radar.init()

function drawRadar(ctx, w, h, t) {
  const time = t / 1000
  _radar.angle = (time * 1.32) % (Math.PI * 2)

  if (Math.random() < 0.04) _radar.spawnBlip()

  const cx = w / 2
  const cy = h / 2
  const maxR = Math.min(w, h) / 2 - 18

  ctx.fillStyle = '#ebe5d4'
  ctx.fillRect(0, 0, w, h)

  const vig = ctx.createRadialGradient(cx, cy, maxR * 0.3, cx, cy, maxR)
  vig.addColorStop(0, 'rgba(22,21,15,0)')
  vig.addColorStop(1, 'rgba(22,21,15,0.15)')
  ctx.fillStyle = vig
  ctx.fillRect(0, 0, w, h)

  ctx.fillStyle = 'rgba(22, 21, 15, 0.04)'
  for (let y = 0; y < h; y += 3) ctx.fillRect(0, y, w, 1)

  ctx.strokeStyle = 'rgba(22, 21, 15, 0.12)'
  ctx.lineWidth = 0.5
  for (let i = 1; i <= 4; i++) {
    ctx.beginPath()
    ctx.arc(cx, cy, maxR * i / 4, 0, Math.PI * 2)
    ctx.stroke()
  }

  ctx.beginPath()
  ctx.moveTo(cx - maxR, cy)
  ctx.lineTo(cx + maxR, cy)
  ctx.moveTo(cx, cy - maxR)
  ctx.lineTo(cx, cy + maxR)
  ctx.stroke()

  ctx.fillStyle = 'rgba(22, 21, 15, 0.45)'
  ctx.font = '11px monospace'
  ctx.fillText('N', cx - 4, cy - maxR + 14)
  ctx.fillText('E', cx + maxR - 12, cy + 4)
  ctx.fillText('S', cx - 4, cy + maxR - 6)
  ctx.fillText('W', cx - maxR + 6, cy + 4)

  const trailSteps = 40
  for (let i = 0; i < trailSteps; i++) {
    const a = _radar.angle - (i / trailSteps) * 1.3
    const alpha = 0.35 * (1 - i / trailSteps)
    ctx.strokeStyle = `rgba(22, 21, 15, ${alpha * 0.2})`
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.lineTo(cx + Math.cos(a) * maxR, cy + Math.sin(a) * maxR)
    ctx.stroke()
  }

  ctx.strokeStyle = 'rgba(220, 255, 52, 0.85)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(cx, cy)
  ctx.lineTo(cx + Math.cos(_radar.angle) * maxR, cy + Math.sin(_radar.angle) * maxR)
  ctx.stroke()

  for (let i = _radar.blips.length - 1; i >= 0; i--) {
    const b = _radar.blips[i]
    let diff = (_radar.angle - b.theta + Math.PI * 2) % (Math.PI * 2)
    if (diff < 0.3 && diff > 0) {
      b.intensity = 1
      b.hit = true
    }
    if (b.hit) {
      b.intensity *= 0.965
      b.life -= 0.003
    }
    if (b.life <= 0) {
      _radar.blips.splice(i, 1)
      continue
    }

    const bx = cx + Math.cos(b.theta) * b.r * maxR
    const by = cy + Math.sin(b.theta) * b.r * maxR

    const glow = ctx.createRadialGradient(bx, by, 0, bx, by, b.size * 5)
    glow.addColorStop(0, `rgba(220, 255, 52, ${b.intensity * 0.7})`)
    glow.addColorStop(1, 'rgba(220, 255, 52, 0)')
    ctx.fillStyle = glow
    ctx.beginPath()
    ctx.arc(bx, by, b.size * 5, 0, Math.PI * 2)
    ctx.fill()

    if (b.intensity > 0.1) {
      ctx.fillStyle = `rgba(22, 21, 15, ${b.intensity * 0.85})`
      ctx.beginPath()
      ctx.arc(bx, by, b.size, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  ctx.fillStyle = 'rgba(22, 21, 15, 0.04)'
  for (let i = 0; i < 30; i++) {
    ctx.fillRect(Math.random() * w, Math.random() * h, 1, 1)
  }

  if (Math.random() > 0.95) {
    ctx.fillStyle = 'rgba(0,0,0,0.07)'
    ctx.fillRect(0, 0, w, h)
  }
}

export function RadarSatellite3D({ reduced }) {
  const draw = reduced ? (ctx, w, h) => drawRadar(ctx, w, h, 0) : drawRadar
  return <DotCanvas draw={draw} />
}

/* ════════════════════════════════════════════
   3. AI NETWORK — 3D rotating neural net with pulses
   ════════════════════════════════════════════ */

const _neural = {
  layers: [],
  pulses: [],
  severity: 0,
  init() {
    const counts = [5, 7, 7, 4]
    const xSpacing = 85
    for (let l = 0; l < counts.length; l++) {
      const nodes = []
      const x = (l - counts.length / 2) * xSpacing
      for (let n = 0; n < counts[l]; n++) {
        const y = (n - counts[l] / 2) * 58
        const z = Math.sin(l * 0.8) * 55 + Math.cos(n * 0.5) * 25
        nodes.push({ x, y, z, flash: 0, acc: 0 })
      }
      this.layers.push(nodes)
    }
  },
  spawnPulse(fromLayer, fromNode) {
    if (fromLayer >= this.layers.length - 1) return
    const nextLayer = this.layers[fromLayer + 1]
    const count = 1 + Math.floor(Math.random() * 2)
    const available = Array.from({ length: nextLayer.length }, (_, i) => i)
    for (let i = 0; i < count && available.length > 0; i++) {
      const ti = Math.floor(Math.random() * available.length)
      const t = available.splice(ti, 1)[0]
      this.pulses.push({
        fromLayer,
        fromNode,
        toLayer: fromLayer + 1,
        toNode: t,
        progress: 0,
        speed: 0.012 + Math.random() * 0.018,
      })
    }
  },
}
_neural.init()

function drawNetwork(ctx, w, h, t) {
  const time = t / 1000
  const rotY = time * 0.315

  if (Math.random() < 0.12) {
    const l = Math.floor(Math.random() * (_neural.layers.length - 1))
    const n = Math.floor(Math.random() * _neural.layers[l].length)
    _neural.spawnPulse(l, n)
  }

  ctx.fillStyle = '#ebe5d4'
  ctx.fillRect(0, 0, w, h)

  const fov = 450
  const cx = w / 2
  const cy = h / 2

  function proj(x, y, z) {
    const cos = Math.cos(rotY)
    const sin = Math.sin(rotY)
    const rx = x * cos - z * sin
    const rz = x * sin + z * cos
    const scale = fov / (fov + rz + 260)
    return { x: cx + rx * scale, y: cy + y * scale, scale, z: rz }
  }

  const allNodes = []
  for (let l = 0; l < _neural.layers.length; l++) {
    for (let n = 0; n < _neural.layers[l].length; n++) {
      const node = _neural.layers[l][n]
      const p = proj(node.x, node.y, node.z)
      allNodes.push({ l, n, node, p })
    }
  }
  allNodes.sort((a, b) => b.p.z - a.p.z)

  ctx.lineWidth = 1
  for (let l = 0; l < _neural.layers.length - 1; l++) {
    for (let i = 0; i < _neural.layers[l].length; i++) {
      const a = _neural.layers[l][i]
      const pa = proj(a.x, a.y, a.z)
      for (let j = 0; j < _neural.layers[l + 1].length; j++) {
        const b = _neural.layers[l + 1][j]
        const pb = proj(b.x, b.y, b.z)
        ctx.strokeStyle = `rgba(22, 21, 15, ${0.04 + (a.flash + b.flash) * 0.1})`
        ctx.beginPath()
        ctx.moveTo(pa.x, pa.y)
        ctx.lineTo(pb.x, pb.y)
        ctx.stroke()
      }
    }
  }

  for (let i = _neural.pulses.length - 1; i >= 0; i--) {
    const p = _neural.pulses[i]
    const a = _neural.layers[p.fromLayer][p.fromNode]
    const b = _neural.layers[p.toLayer][p.toNode]
    const pa = proj(a.x, a.y, a.z)
    const pb = proj(b.x, b.y, b.z)

    p.progress += p.speed
    if (p.progress >= 1) {
      b.flash = 1
      b.acc += 1
      if (p.toLayer === _neural.layers.length - 1) _neural.severity = Math.min(1, _neural.severity + 0.12)
      _neural.spawnPulse(p.toLayer, p.toNode)
      _neural.pulses.splice(i, 1)
      continue
    }

    const px = pa.x + (pb.x - pa.x) * p.progress
    const py = pa.y + (pb.y - pa.y) * p.progress
    const pscale = pa.scale + (pb.scale - pa.scale) * p.progress

    ctx.shadowBlur = 14
    ctx.shadowColor = 'rgba(220, 255, 52, 0.8)'
    ctx.fillStyle = '#dcff34'
    ctx.beginPath()
    ctx.arc(px, py, 3 * pscale, 0, Math.PI * 2)
    ctx.fill()
    ctx.shadowBlur = 0
  }

  for (const item of allNodes) {
    const node = item.node
    const p = item.p
    if (node.flash > 0) node.flash *= 0.9

    const size = (5 + node.flash * 6) * p.scale
    const alpha = 0.3 + node.flash * 0.7

    ctx.shadowBlur = 20
    ctx.shadowColor = `rgba(220, 255, 52, ${0.15 + node.flash * 0.35})`
    ctx.fillStyle = `rgba(22, 21, 15, ${alpha * 0.7})`
    ctx.beginPath()
    ctx.arc(p.x, p.y, size, 0, Math.PI * 2)
    ctx.fill()
    ctx.shadowBlur = 0

    ctx.fillStyle = `rgba(220, 255, 52, ${0.4 + node.flash * 0.4})`
    ctx.beginPath()
    ctx.arc(p.x, p.y, size * 0.35, 0, Math.PI * 2)
    ctx.fill()
  }

  _neural.severity *= 0.985
  const meterW = 12
  const meterH = 130
  const meterX = w - 32
  const meterY = h / 2 - meterH / 2

  ctx.fillStyle = 'rgba(22, 21, 15, 0.06)'
  ctx.fillRect(meterX, meterY, meterW, meterH)

  const fillH = meterH * _neural.severity
  const grad = ctx.createLinearGradient(meterX, meterY + meterH, meterX, meterY)
  grad.addColorStop(0, '#16150F')
  grad.addColorStop(0.5, '#F0571F')
  grad.addColorStop(1, '#DCFF34')
  ctx.fillStyle = grad
  ctx.fillRect(meterX, meterY + meterH - fillH, meterW, fillH)

  ctx.strokeStyle = 'rgba(22, 21, 15, 0.15)'
  ctx.lineWidth = 1
  ctx.strokeRect(meterX, meterY, meterW, meterH)

  ctx.fillStyle = 'rgba(22, 21, 15, 0.45)'
  ctx.font = '10px sans-serif'
  ctx.fillText('SEV', meterX - 4, meterY + meterH + 14)
}

export function AINetwork3D({ reduced }) {
  const draw = reduced ? (ctx, w, h) => drawNetwork(ctx, w, h, 0) : drawNetwork
  return <DotCanvas draw={draw} />
}

/* ════════════════════════════════════════════
   4. ALERT BEACON — 3D tower with rings + strobe
   ════════════════════════════════════════════ */

const _beacon = {
  rings: [],
  flash: 0,
  particles: [],
  init() {
    for (let i = 0; i < 40; i++) {
      this.particles.push({
        x: (Math.random() - 0.5) * 350,
        y: Math.random() * 200,
        z: (Math.random() - 0.5) * 350,
        vy: -0.15 - Math.random() * 0.4,
        life: Math.random(),
      })
    }
  },
}
_beacon.init()

function drawBeacon(ctx, w, h, t) {
  const time = t / 1000

  if (Math.floor(time * 8) > Math.floor((time - 0.016) * 8)) {
    _beacon.rings.push({ r: 5, alpha: 1 })
  }
  if (Math.floor(time * 1.2) > Math.floor((time - 0.016) * 1.2)) {
    _beacon.flash = 1
  }
  if (_beacon.flash > 0) _beacon.flash *= 0.9

  ctx.fillStyle = '#ebe5d4'
  ctx.fillRect(0, 0, w, h)

  const cx = w / 2
  const cy = h / 2 + 55
  const fov = 350

  function proj(px, py, pz) {
    const scale = fov / (fov + pz + 160)
    return { x: cx + px * scale, y: cy + py * scale, scale }
  }

  ctx.strokeStyle = 'rgba(240, 87, 31, 0.06)'
  ctx.lineWidth = 1
  for (let i = 0; i < 12; i++) {
    const z = i * 40
    const scale = fov / (fov + z + 160)
    const y = 50 * scale
    ctx.beginPath()
    ctx.moveTo(cx - 260 * scale, cy + y)
    ctx.lineTo(cx + 260 * scale, cy + y)
    ctx.stroke()
  }
  for (let x = -250; x <= 250; x += 50) {
    ctx.beginPath()
    ctx.moveTo(cx + x, cy + 50)
    ctx.lineTo(cx + x * 0.15, cy - 130)
    ctx.stroke()
  }

  const towerH = 140
  const baseW = 48
  const topW = 10
  const segments = 7

  ctx.strokeStyle = `rgba(22, 21, 15, ${0.3 + _beacon.flash * 0.15})`
  ctx.lineWidth = 1.5
  for (let s = 0; s < segments; s++) {
    const y1 = 50 - (s / segments) * towerH
    const y2 = 50 - ((s + 1) / segments) * towerH
    const w1 = baseW - (s / segments) * (baseW - topW)
    const w2 = baseW - ((s + 1) / segments) * (baseW - topW)

    const p1 = proj(-w1, y1, 0)
    const p2 = proj(w1, y1, 0)
    const p3 = proj(w2, y2, 0)
    const p4 = proj(-w2, y2, 0)

    ctx.beginPath()
    ctx.moveTo(p1.x, p1.y)
    ctx.lineTo(p2.x, p2.y)
    ctx.lineTo(p3.x, p3.y)
    ctx.lineTo(p4.x, p4.y)
    ctx.closePath()
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(p1.x, p1.y)
    ctx.lineTo(p3.x, p3.y)
    ctx.moveTo(p2.x, p2.y)
    ctx.lineTo(p4.x, p4.y)
    ctx.stroke()
  }

  for (let i = _beacon.rings.length - 1; i >= 0; i--) {
    const r = _beacon.rings[i]
    r.r += 1.3
    r.alpha -= 0.011
    if (r.alpha <= 0) {
      _beacon.rings.splice(i, 1)
      continue
    }

    const scale = fov / (fov + 160)
    ctx.strokeStyle = `rgba(22, 21, 15, ${r.alpha * 0.25})`
    ctx.lineWidth = 1.5 * scale
    ctx.beginPath()
    ctx.ellipse(cx, cy + 50, r.r * scale, r.r * scale * 0.32, 0, 0, Math.PI * 2)
    ctx.stroke()
  }

  for (let i = _beacon.particles.length - 1; i >= 0; i--) {
    const p = _beacon.particles[i]
    p.y += p.vy
    p.life -= 0.008
    if (p.life <= 0) {
      _beacon.particles[i] = {
        x: (Math.random() - 0.5) * 350,
        y: 120 + Math.random() * 60,
        z: (Math.random() - 0.5) * 350,
        vy: -0.15 - Math.random() * 0.4,
        life: 1,
      }
      continue
    }
    const pp = proj(p.x, p.y, p.z)
    ctx.fillStyle = `rgba(240, 87, 31, ${p.life * 0.35})`
    ctx.beginPath()
    ctx.arc(pp.x, pp.y, 1.5 * pp.scale, 0, Math.PI * 2)
    ctx.fill()
  }

  const topY = 50 - towerH
  const topP = proj(0, topY, 0)

  if (_beacon.flash > 0.05) {
    const glow = ctx.createRadialGradient(topP.x, topP.y, 0, topP.x, topP.y, 55 * topP.scale)
    glow.addColorStop(0, `rgba(220, 255, 52, ${_beacon.flash})`)
    glow.addColorStop(0.5, `rgba(240, 87, 31, ${_beacon.flash * 0.4})`)
    glow.addColorStop(1, 'rgba(240, 87, 31, 0)')
    ctx.fillStyle = glow
    ctx.beginPath()
    ctx.arc(topP.x, topP.y, 55 * topP.scale, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = `rgba(220, 255, 52, ${_beacon.flash * 0.12})`
    ctx.beginPath()
    ctx.moveTo(topP.x, topP.y)
    ctx.lineTo(topP.x - 90 * topP.scale, topP.y - 200 * topP.scale)
    ctx.lineTo(topP.x + 90 * topP.scale, topP.y - 200 * topP.scale)
    ctx.closePath()
    ctx.fill()

    ctx.strokeStyle = `rgba(220, 255, 52, ${_beacon.flash * 0.5})`
    ctx.lineWidth = 2
    for (let a = 0; a < 8; a++) {
      const ang = (a / 8) * Math.PI * 2 + time
      ctx.beginPath()
      ctx.moveTo(topP.x, topP.y)
      ctx.lineTo(topP.x + Math.cos(ang) * 22 * topP.scale, topP.y + Math.sin(ang) * 22 * topP.scale)
      ctx.stroke()
    }
  }

  ctx.fillStyle = '#ebe5d4'
  ctx.beginPath()
  ctx.arc(topP.x, topP.y, 4.5 * topP.scale, 0, Math.PI * 2)
  ctx.fill()
}

export function AlertBeacon3D({ reduced }) {
  const draw = reduced ? (ctx, w, h) => drawBeacon(ctx, w, h, 0) : drawBeacon
  return <DotCanvas draw={draw} />
}
