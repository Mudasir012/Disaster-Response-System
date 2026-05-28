import { useRef, Suspense, useMemo } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import * as THREE from 'three'

const GLOBE_RADIUS = 1

const DISASTER_SITES = [
  [40.7, -73.9], [-22.9, -43.2], [35.7, 139.7], [31.2, 121.5],
  [19.4, -99.1], [28.6, 77.2], [39.9, 116.4], [55.8, 37.6],
  [-33.9, 151.2], [37.6, -122.4], [51.5, -0.1], [48.9, 2.3],
  [35.7, 51.4], [41.0, 28.9], [-6.2, 106.8], [14.6, 121.0],
  [36.2, 138.3], [-0.8, 117.4], [12.9, 121.8], [-35.7, -71.5],
  [39.0, 35.0], [28.4, 84.1], [23.7, 90.4], [32.4, 53.7],
  [18.2, -66.5], [18.5, -72.3], [33.7, 72.9], [-41.6, 173.0],
  [13.7, 100.5], [-1.3, 36.8], [3.1, 101.7], [30.0, 31.2],
]

function toPosition(lat, lng, radius) {
  const phi = (90 - lat) * Math.PI / 180
  const theta = (lng + 180) * Math.PI / 180
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  )
}

const MARKER_DATA = DISASTER_SITES.map(([lat, lng], i) => {
  const pos = toPosition(lat, lng, GLOBE_RADIUS * 1.01)
  return { pos, offset: i * 0.7 + 0.1 }
})

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

function EarthTextures({ dayTexture, nightTexture, brcTexture, scrollRef, mouseRef }) {
  const earthRef = useRef()
  const atmosphereRef = useRef()

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
        <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
      </mesh>
      <mesh ref={atmosphereRef} material={atmosphereMaterial} scale={1.04}>
        <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
      </mesh>
      {MARKER_DATA.map((d, i) => (
        <PulsingMarker key={i} position={d.pos} offset={d.offset} />
      ))}
    </>
  )
}

function Earth({ scrollRef, mouseRef }) {
  const [day, night, brc] = useLoader(THREE.TextureLoader, [
    'https://threejs.org/examples/textures/planets/earth_day_4096.jpg',
    'https://threejs.org/examples/textures/planets/earth_night_4096.jpg',
    'https://threejs.org/examples/textures/planets/earth_bump_roughness_clouds_4096.jpg',
  ])

  return <EarthTextures dayTexture={day} nightTexture={night} brcTexture={brc} scrollRef={scrollRef} mouseRef={mouseRef} />
}

function PulsingMarker({ position, offset }) {
  const ref = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime * 2 + offset
    const s = 0.7 + Math.sin(t) * 0.4
    ref.current.scale.setScalar(s)
  })

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.02, 8, 8]} />
      <meshBasicMaterial color="#e94560" />
    </mesh>
  )
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
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }}>
      <Canvas
        camera={{ position: [0, 0, 2.2], fov: 40 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false }}
        style={{ width: '100%', height: '100%' }}
      >
        <color attach="background" args={['#05080f']} />
        <ambientLight intensity={0.2} />
        <directionalLight position={[0, 0, 3]} intensity={1.5} />
        <Suspense fallback={<SceneFallback />}>
          <Earth scrollRef={scrollRef} mouseRef={mouseRef} />
        </Suspense>
        <Stars />
      </Canvas>
    </div>
  )
}
