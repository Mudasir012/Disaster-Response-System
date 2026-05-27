import { useEffect, useRef } from 'react'
import * as THREE from 'three'

function generateEarthTexture(width = 1024, height = 512) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')

  const grad = ctx.createLinearGradient(0, 0, 0, height)
  grad.addColorStop(0, '#0a1628')
  grad.addColorStop(0.3, '#0f2847')
  grad.addColorStop(0.5, '#142f52')
  grad.addColorStop(0.7, '#0f2847')
  grad.addColorStop(1, '#0a1628')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, width, height)

  function x(lng) { return (lng + 180) / 360 * width }
  function y(lat) { return (90 - lat) / 180 * height }

  const continents = [
    { color: '#1a4a2e', ellipses: [
      [-100, 45, 28, 22], [-120, 50, 20, 16], [-80, 55, 16, 18],
      [-70, 60, 12, 10], [-130, 60, 14, 10], [-105, 30, 12, 10],
      [-90, 35, 10, 8], [-100, 35, 8, 12], [-85, 55, 10, 8],
      [-75, 45, 8, 12], [-85, 25, 6, 6], [-95, 20, 4, 5],
    ]},
    { color: '#2a5a35', ellipses: [
      [-90, 15, 6, 6], [-85, 12, 4, 4], [-82, 10, 3, 5],
    ]},
    { color: '#1e5a2a', ellipses: [
      [-60, -10, 14, 18], [-55, -20, 12, 16], [-50, -30, 10, 14],
      [-65, -40, 8, 12], [-60, -50, 6, 8], [-70, -5, 4, 6],
      [-75, 0, 5, 4], [-45, -5, 6, 6], [-40, -15, 5, 5],
      [-70, 5, 3, 4], [-55, 5, 4, 4],
    ]},
    { color: '#2d5a2a', ellipses: [
      [5, 50, 12, 14], [15, 55, 14, 12], [25, 58, 12, 10],
      [10, 45, 8, 7], [0, 47, 5, 5], [-5, 40, 4, 4],
      [-8, 43, 3, 4], [5, 60, 5, 8], [10, 62, 6, 6],
      [20, 60, 8, 8], [30, 55, 6, 8],
    ]},
    { color: '#2d5a2a', ellipses: [
      [-4, 54, 3, 5], [-2, 56, 2, 3],
    ]},
    { color: '#2d5a2a', ellipses: [
      [15, 65, 6, 8], [20, 68, 5, 6], [25, 65, 4, 5],
    ]},
    { color: '#4a6a2a', ellipses: [
      [20, 5, 18, 22], [25, -10, 14, 18], [20, -20, 12, 14],
      [15, -30, 8, 10], [30, -15, 8, 8], [35, -25, 6, 6],
      [35, 0, 6, 6], [10, 15, 8, 8], [-5, 10, 6, 6],
      [40, 10, 6, 6], [45, -5, 4, 5], [10, 25, 6, 5],
      [5, 35, 4, 4], [-5, 5, 4, 5],
    ]},
    { color: '#3a5a2a', ellipses: [
      [47, -20, 3, 6],
    ]},
    { color: '#5a6a30', ellipses: [
      [45, 25, 8, 8], [40, 20, 6, 6], [50, 22, 5, 5],
      [55, 25, 4, 4], [35, 28, 4, 3],
    ]},
    { color: '#2a5a2a', ellipses: [
      [77, 20, 8, 12], [75, 12, 6, 6], [80, 15, 5, 8],
      [72, 25, 5, 4], [85, 22, 4, 4],
    ]},
    { color: '#2a5a30', ellipses: [
      [100, 15, 8, 12], [105, 5, 8, 10], [100, -3, 6, 8],
      [95, 22, 5, 5], [110, 10, 5, 6], [115, -5, 4, 6],
      [120, -3, 4, 4],
    ]},
    { color: '#2a5a28', ellipses: [
      [105, 35, 12, 16], [115, 30, 10, 12], [120, 25, 8, 10],
      [95, 30, 8, 8], [110, 40, 8, 8], [100, 42, 6, 6],
      [125, 20, 4, 4],
    ]},
    { color: '#2a4a28', ellipses: [
      [60, 55, 25, 15], [80, 60, 20, 12], [100, 62, 18, 10],
      [120, 60, 15, 10], [140, 58, 12, 8], [50, 50, 10, 8],
      [70, 50, 8, 6], [160, 55, 10, 8],
    ]},
    { color: '#2a5a30', ellipses: [
      [137, 37, 3, 8], [140, 35, 2, 4],
    ]},
    { color: '#5a6a35', ellipses: [
      [133, -25, 14, 10], [145, -28, 8, 6], [125, -20, 6, 5],
      [140, -20, 5, 4], [115, -22, 4, 4], [150, -25, 4, 3],
    ]},
    { color: '#3a5a30', ellipses: [
      [173, -42, 3, 6],
    ]},
    { color: '#3a5a3a', ellipses: [
      [-40, 72, 12, 10], [-30, 76, 8, 6], [-50, 68, 6, 5],
    ]},
    { color: '#2a5a30', ellipses: [
      [115, -5, 8, 4], [105, -5, 4, 3], [110, -8, 5, 3],
      [120, -5, 6, 3], [125, -3, 4, 3], [130, -2, 3, 2],
    ]},
    { color: '#2a5a30', ellipses: [
      [143, -6, 5, 4], [148, -7, 3, 3],
    ]},
    { color: '#4a5a5a', ellipses: [
      [0, -85, 170, 8],
    ]},
  ]

  for (const continent of continents) {
    ctx.fillStyle = continent.color
    for (const [lng, lat, rx, ry] of continent.ellipses) {
      ctx.beginPath()
      ctx.ellipse(x(lng), y(lat), rx / 360 * width, ry / 180 * height, 0, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  ctx.globalCompositeOperation = 'overlay'
  for (const continent of continents) {
    ctx.fillStyle = '#3a8a5a'
    for (const [lng, lat, rx, ry] of continent.ellipses) {
      ctx.beginPath()
      ctx.ellipse(x(lng), y(lat), (rx + 1.5) / 360 * width, (ry + 1.5) / 180 * height, 0, 0, Math.PI * 2)
      ctx.fill()
    }
  }
  ctx.globalCompositeOperation = 'source-over'

  ctx.strokeStyle = 'rgba(60, 100, 140, 0.06)'
  ctx.lineWidth = 1
  for (let lat = -80; lat <= 80; lat += 20) {
    ctx.beginPath()
    ctx.moveTo(0, y(lat))
    ctx.lineTo(width, y(lat))
    ctx.stroke()
  }
  for (let lng = -180; lng <= 160; lng += 20) {
    ctx.beginPath()
    ctx.moveTo(x(lng), 0)
    ctx.lineTo(x(lng), height)
    ctx.stroke()
  }

  return canvas
}

export default function GlobeScene({ className = '' }) {
  const containerRef = useRef(null)
  const visibleRef = useRef(true)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    function initScene() {
      const width = container.clientWidth
      const height = container.clientHeight
      if (width === 0 || height === 0) return false

      const aspect = width / height
      const globeRadius = 1.2
      const vFov = 40
      const vFovRad = vFov * (Math.PI / 180)
      const fillRatio = 0.55
      const camDistance = globeRadius / (fillRatio * Math.tan(vFovRad / 2))

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(vFov, aspect, 0.1, 100)
      camera.position.z = camDistance

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
      renderer.setSize(width, height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.0
      container.appendChild(renderer.domElement)

      const textureCanvas = generateEarthTexture(1024, 512)
      const earthTexture = new THREE.CanvasTexture(textureCanvas)
      earthTexture.wrapS = THREE.RepeatWrapping
      earthTexture.wrapT = THREE.ClampToEdgeWrapping

      const sphereGeo = new THREE.SphereGeometry(globeRadius, 64, 64)
      const sphereMat = new THREE.MeshStandardMaterial({
        map: earthTexture,
        roughness: 0.6,
        metalness: 0.0,
      })
      const sphere = new THREE.Mesh(sphereGeo, sphereMat)
      scene.add(sphere)

      const glowGeo = new THREE.SphereGeometry(globeRadius * 1.025, 48, 48)
      const glowMat = new THREE.MeshBasicMaterial({
        color: 0x4a8aba,
        transparent: true,
        opacity: 0.06,
        side: THREE.BackSide,
      })
      const glow = new THREE.Mesh(glowGeo, glowMat)
      scene.add(glow)

      const hazeGeo = new THREE.SphereGeometry(globeRadius * 1.08, 48, 48)
      const hazeMat = new THREE.MeshBasicMaterial({
        color: 0xe94560,
        transparent: true,
        opacity: 0.02,
        side: THREE.BackSide,
      })
      const haze = new THREE.Mesh(hazeGeo, hazeMat)
      scene.add(haze)

      const ringGeo = new THREE.TorusGeometry(globeRadius * 1.45, 0.005, 32, 100)
      const ringMat = new THREE.MeshBasicMaterial({ color: 0xe94560, transparent: true, opacity: 0.08 })
      const ring = new THREE.Mesh(ringGeo, ringMat)
      ring.rotation.x = Math.PI / 2.8
      ring.rotation.z = 0.3
      scene.add(ring)

      const ring2Geo = new THREE.TorusGeometry(globeRadius * 1.55, 0.003, 32, 100)
      const ring2Mat = new THREE.MeshBasicMaterial({ color: 0x0f7ddb, transparent: true, opacity: 0.05 })
      const ring2 = new THREE.Mesh(ring2Geo, ring2Mat)
      ring2.rotation.x = Math.PI / 3.5
      ring2.rotation.z = -0.5
      scene.add(ring2)

      const dotColors = [0xe94560, 0xd97706, 0x0f7ddb, 0x7c3aed]
      const dotPositions = []
      const dotColorValues = []
      for (let i = 0; i < 60; i++) {
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(2 * Math.random() - 1)
        const r = globeRadius * 1.005
        dotPositions.push(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.cos(phi),
          r * Math.sin(phi) * Math.sin(theta),
        )
        const c = new THREE.Color(dotColors[Math.floor(Math.random() * dotColors.length)])
        dotColorValues.push(c.r, c.g, c.b)
      }
      const dotGeo = new THREE.BufferGeometry()
      dotGeo.setAttribute('position', new THREE.Float32BufferAttribute(dotPositions, 3))
      dotGeo.setAttribute('color', new THREE.Float32BufferAttribute(dotColorValues, 3))
      const dotMat = new THREE.PointsMaterial({
        size: 0.035,
        transparent: true,
        opacity: 0.7,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
      const dots = new THREE.Points(dotGeo, dotMat)
      sphere.add(dots)

      const starPositions = []
      for (let i = 0; i < 250; i++) {
        const r = 5 + Math.random() * 10
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(2 * Math.random() - 1)
        starPositions.push(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.cos(phi),
          r * Math.sin(phi) * Math.sin(theta),
        )
      }
      const starGeo = new THREE.BufferGeometry()
      starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3))
      const starMat = new THREE.PointsMaterial({ color: 0x94a3b8, size: 0.01, transparent: true, opacity: 0.18 })
      const stars = new THREE.Points(starGeo, starMat)
      scene.add(stars)

      const ambient = new THREE.AmbientLight(0x404060, 0.4)
      scene.add(ambient)
      const keyLight = new THREE.DirectionalLight(0xffffff, 2.0)
      keyLight.position.set(5, 3, 5)
      scene.add(keyLight)
      const rimLight = new THREE.DirectionalLight(0xe94560, 0.2)
      rimLight.position.set(-3, -1, -5)
      scene.add(rimLight)
      const fillLight = new THREE.DirectionalLight(0x6a9aba, 0.25)
      fillLight.position.set(-2, 4, 3)
      scene.add(fillLight)

      // — IntersectionObserver: pause animation when off-screen —
      let animationId
      const animate = () => {
        if (!visibleRef.current) return
        sphere.rotation.y += 0.002
        glow.rotation.y += 0.001
        ring.rotation.z += 0.001
        ring2.rotation.z -= 0.0008
        stars.rotation.y += 0.0003
        renderer.render(scene, camera)
        animationId = requestAnimationFrame(animate)
      }

      const io = new IntersectionObserver(
        ([entry]) => {
          visibleRef.current = entry.isIntersecting
          if (entry.isIntersecting) animate()
        },
        { threshold: 0.1 }
      )
      io.observe(container)

      animate()

      const onResize = () => {
        const w = container.clientWidth
        const h = container.clientHeight
        if (w === 0 || h === 0) return
        camera.aspect = w / h
        const dist = globeRadius / (fillRatio * Math.tan(vFovRad / 2))
        camera.position.z = dist
        camera.updateProjectionMatrix()
        renderer.setSize(w, h)
      }
      const ro = new ResizeObserver(onResize)
      ro.observe(container)

      return () => {
        cancelAnimationFrame(animationId)
        io.disconnect()
        ro.disconnect()
        renderer.dispose()
        earthTexture.dispose()
        sphere.geometry.dispose()
        sphere.material.dispose()
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement)
        }
      }
    }

    const cleanup = initScene()
    if (cleanup === false) {
      const ro = new ResizeObserver(() => {
        if (container.clientWidth > 0 && container.clientHeight > 0 && !container.querySelector('canvas')) {
          const c = initScene()
          if (c) ro.disconnect()
        }
      })
      ro.observe(container)
      return () => ro.disconnect()
    }

    return cleanup
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <div ref={containerRef} className={className} aria-hidden="true" />
}
