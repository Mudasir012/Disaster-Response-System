import { useRef, Suspense, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import * as THREE from 'three'

const GLOBE_RADIUS = 1

const STAR_POSITIONS = (() => {
  const arr = new Float32Array(3000)
  for (let i = 0; i < 1000; i++) {
    const r = 30 + Math.random() * 70
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    arr[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    arr[i * 3 + 2] = r * Math.cos(phi)
  }
  return arr
})()

const earthVertexShader = `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;

void main() {
  vUv = uv;
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPos.xyz;
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const earthFragmentShader = `
uniform sampler2D dayTexture;
uniform sampler2D nightTexture;
uniform sampler2D brcTexture;
uniform vec3 sunDirection;
uniform float brightness;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;

void main() {
  vec3 dayColor = texture2D(dayTexture, vUv).rgb;
  vec3 nightColor = texture2D(nightTexture, vUv).rgb;
  vec3 brc = texture2D(brcTexture, vUv).rgb;

  float clouds = brc.b;
  float bump = brc.r;

  vec3 normal = normalize(vNormal);
  float NdotL = dot(normal, normalize(sunDirection));

  float dayFactor = smoothstep(-0.25, 0.5, NdotL);
  vec3 color = mix(nightColor, dayColor, dayFactor);

  float cloudFactor = smoothstep(0.2, 1.0, clouds);
  color = mix(color, vec3(1.0), cloudFactor * 2.0 * max(dayFactor, 0.0));

  vec3 viewDir = normalize(cameraPosition - vWorldPosition);
  float rim = 1.0 - max(dot(viewDir, normal), 0.0);
  float atmosphereDay = smoothstep(-0.5, 1.0, NdotL);
  vec3 atmosphereDayColor = vec3(0.3, 0.7, 1.0);
  vec3 atmosphereTwilightColor = vec3(0.74, 0.29, 0.04);
  vec3 atmosphereColor = mix(atmosphereTwilightColor, atmosphereDayColor, atmosphereDay);
  float atmosphereStrength = atmosphereDay * pow(rim, 2.0);
  color = mix(color, atmosphereColor, atmosphereStrength * 0.25);

  gl_FragColor = vec4(color * brightness, 1.0);
}
`

const atmosphereVertexShader = `
varying vec3 vNormal;
varying vec3 vWorldPosition;

void main() {
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPos.xyz;
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const atmosphereFragmentShader = `
uniform vec3 sunDirection;
uniform vec3 atmosphereDayColor;
uniform vec3 atmosphereTwilightColor;

varying vec3 vNormal;
varying vec3 vWorldPosition;

void main() {
  vec3 normal = normalize(vNormal);
  vec3 viewDir = normalize(cameraPosition - vWorldPosition);
  vec3 sunDir = normalize(sunDirection);

  float NdotL = dot(normal, sunDir);
  float fresnel = 1.0 - max(dot(viewDir, normal), 0.0);

  float atmosphereDay = smoothstep(-0.5, 1.0, NdotL);
  vec3 atmosphereColor = mix(atmosphereTwilightColor, atmosphereDayColor, atmosphereDay);

  float alpha = pow(max(fresnel, 0.0), 3.0);
  alpha *= smoothstep(-0.5, 1.0, NdotL);
  alpha = clamp(alpha, 0.0, 1.0);

  gl_FragColor = vec4(atmosphereColor, alpha * 0.28);
}
`

function EarthTextures({ dayTexture, nightTexture, brcTexture, scrollRef, mouseRef, active }) {
  const earthRef = useRef()
  const atmosphereRef = useRef()
  const activeRef = useRef(active)
  useEffect(() => { activeRef.current = active }, [active])

  const sunDirection = useMemo(() => new THREE.Vector3(0, 0, 1), [])

  const earthMaterial = useMemo(() => {
    const day = dayTexture.clone()
    const night = nightTexture.clone()
    const brc = brcTexture.clone()

    day.anisotropy = 8
    day.colorSpace = THREE.SRGBColorSpace
    night.anisotropy = 8
    night.colorSpace = THREE.SRGBColorSpace
    brc.anisotropy = 8

    return new THREE.ShaderMaterial({
      uniforms: {
        dayTexture: { value: day },
        nightTexture: { value: night },
        brcTexture: { value: brc },
        sunDirection: { value: sunDirection },
        brightness: { value: 0.45 },
      },
      vertexShader: earthVertexShader,
      fragmentShader: earthFragmentShader,
    })
  }, [dayTexture, nightTexture, brcTexture, sunDirection])

  const atmosphereMaterial = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      sunDirection: { value: sunDirection },
      atmosphereDayColor: { value: new THREE.Color('#4db2ff') },
      atmosphereTwilightColor: { value: new THREE.Color('#bc490b') },
    },
    vertexShader: atmosphereVertexShader,
    fragmentShader: atmosphereFragmentShader,
    side: THREE.BackSide,
    transparent: true,
    depthWrite: false,
  }), [sunDirection])

  useFrame((state, delta) => {
    if (!activeRef.current) return
    const s = Math.min(Math.max(scrollRef.current, 0), 1)
    const speed = 0.04 + s * 0.2
    const t = state.clock.elapsedTime

    const mx = ((mouseRef.current?.x ?? window.innerWidth / 2) / window.innerWidth) * 2 - 1
    const my = -((mouseRef.current?.y ?? window.innerHeight / 2) / window.innerHeight) * 2 + 1

    earthRef.current.rotation.y += delta * speed + mx * 0.0008
    atmosphereRef.current.rotation.y += delta * speed * 0.9 + mx * 0.0006
    earthRef.current.rotation.x += (my * 0.02 + Math.sin(t * 0.06) * 0.03 - earthRef.current.rotation.x) * 0.008
    atmosphereRef.current.rotation.x += (my * 0.02 + Math.sin(t * 0.06) * 0.03 - atmosphereRef.current.rotation.x) * 0.008

    const targetZ = 2.2 + s * 7
    const targetY = Math.sin(s * Math.PI * 0.5) * 0.3
    state.camera.position.z += (targetZ - state.camera.position.z) * 0.02
    state.camera.position.y += (targetY - state.camera.position.y) * 0.02
    state.camera.lookAt(0, 0, 0)
  })

  return (
    <>
      <mesh ref={earthRef} material={earthMaterial}>
        <sphereGeometry args={[GLOBE_RADIUS, 48, 48]} />
      </mesh>
      <mesh ref={atmosphereRef} material={atmosphereMaterial} scale={1.04}>
        <sphereGeometry args={[GLOBE_RADIUS, 48, 48]} />
      </mesh>
    </>
  )
}

function Earth({ scrollRef, mouseRef, active }) {
  const [day, night, brc] = useLoader(THREE.TextureLoader, [
    'https://threejs.org/examples/textures/planets/earth_day_4096.jpg',
    'https://threejs.org/examples/textures/planets/earth_night_4096.jpg',
    'https://threejs.org/examples/textures/planets/earth_bump_roughness_clouds_4096.jpg',
  ])

  return <EarthTextures dayTexture={day} nightTexture={night} brcTexture={brc} scrollRef={scrollRef} mouseRef={mouseRef} active={active} />
}

function Stars() {
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={1000}
          array={STAR_POSITIONS}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.06} color="#94a3b8" transparent opacity={0.5} sizeAttenuation />
    </points>
  )
}

function SceneFallback() {
  return (
    <mesh>
      <sphereGeometry args={[GLOBE_RADIUS, 32, 32]} />
      <meshBasicMaterial color="#0a1628" wireframe />
    </mesh>
  )
}

export default function HeroScene({ scrollRef, mouseRef }) {
  const containerRef = useRef(null)
  const [inView, setInView] = useState(true)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: '-200px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={containerRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }}>
      <Canvas
        frameloop={inView ? 'always' : 'never'}
        camera={{ position: [0, 0, 2.2], fov: 40 }}
        dpr={[1, 1.25]}
        gl={{ antialias: true, alpha: false }}
        style={{ width: '100%', height: '100%' }}
      >
        <color attach="background" args={['#05080f']} />
        <ambientLight intensity={0.2} />
        <directionalLight position={[0, 0, 3]} intensity={1.5} />
        <Suspense fallback={<SceneFallback />}>
          <Earth scrollRef={scrollRef} mouseRef={mouseRef} active={inView} />
        </Suspense>
        <Stars />
      </Canvas>
    </div>
  )
}
