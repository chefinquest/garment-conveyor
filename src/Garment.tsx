import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

type GarmentKind = 'shirt' | 'jacket' | 'coat' | 'dress' | 'trousers'

type Props = {
  color: string
  kind: GarmentKind
  index: number
  motion: React.RefObject<number>
}

function silhouette(kind: GarmentKind) {
  const shape = new THREE.Shape()
  const long = kind === 'coat' || kind === 'dress'
  const yBottom = long ? -2.05 : -1.42
  const hem = kind === 'dress' ? 0.7 : kind === 'coat' ? 0.57 : 0.49
  shape.moveTo(-0.26, 0.08)
  shape.lineTo(-0.48, -0.18)
  shape.lineTo(-hem, yBottom)
  if (kind === 'dress') shape.quadraticCurveTo(0, yBottom - 0.09, hem, yBottom)
  else shape.lineTo(hem, yBottom)
  shape.lineTo(0.48, -0.18)
  shape.lineTo(0.26, 0.08)
  shape.quadraticCurveTo(0, -0.14, -0.26, 0.08)
  return new THREE.ExtrudeGeometry(shape, {
    depth: kind === 'jacket' || kind === 'coat' ? 0.21 : 0.13,
    bevelEnabled: true, bevelSize: 0.035, bevelThickness: 0.035, bevelSegments: 2,
  }).translate(0, 0, -0.07)
}

function Hanger() {
  return (
    <group position={[0, 0.2, 0]}>
      <mesh castShadow position={[0, 0.23, 0]}>
        <torusGeometry args={[0.11, 0.018, 5, 12, Math.PI * 1.55]} />
        <meshStandardMaterial color="#6c7072" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh castShadow position={[-0.27, -0.04, 0]} rotation={[0, 0, -0.48]}>
        <cylinderGeometry args={[0.018, 0.018, 0.62, 6]} />
        <meshStandardMaterial color="#727678" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh castShadow position={[0.27, -0.04, 0]} rotation={[0, 0, 0.48]}>
        <cylinderGeometry args={[0.018, 0.018, 0.62, 6]} />
        <meshStandardMaterial color="#727678" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  )
}

export function Garment({ color, kind, index, motion }: Props) {
  const cloth = useRef<THREE.Group>(null)
  const body = useRef<THREE.Mesh>(null)
  const leftSleeve = useRef<THREE.Mesh>(null)
  const rightSleeve = useRef<THREE.Mesh>(null)
  const geometry = useMemo(() => silhouette(kind), [kind])
  const restPositions = useMemo(() => Float32Array.from(geometry.attributes.position.array), [geometry])
  const isLong = kind === 'coat' || kind === 'dress'
  const hasSleeves = kind !== 'dress' && kind !== 'trousers'
  const hasCover = kind !== 'trousers' && index % 3 !== 1

  useFrame(({ clock }, delta) => {
    if (!cloth.current) return
    const drive = motion.current ?? 0
    const t = clock.elapsedTime
    const target = drive * 0.12
    cloth.current.rotation.z = THREE.MathUtils.damp(cloth.current.rotation.z, target, 5, delta)
    cloth.current.rotation.x = THREE.MathUtils.damp(cloth.current.rotation.x, Math.sin(t * 1.4 + index) * 0.018 + Math.abs(drive) * 0.025, 4, delta)
    cloth.current.position.x = Math.sin(t * 1.8 + index * 0.73) * (0.014 + Math.abs(drive) * 0.02)

    // The shoulders remain pinned to the hanger while progressively softer
    // vertices toward the hem lag, ripple and fold. This lightweight
    // position-based cloth pass keeps dozens of garments lively without a
    // heavyweight soft-body solver.
    if (body.current) {
      const positions = body.current.geometry.attributes.position as THREE.BufferAttribute
      const live = positions.array as Float32Array
      for (let i = 0; i < live.length; i += 3) {
        const baseX = restPositions[i]
        const baseY = restPositions[i + 1]
        const baseZ = restPositions[i + 2]
        const loose = Math.pow(THREE.MathUtils.clamp((0.08 - baseY) / 2.25, 0, 1), 1.35)
        const hemWave = Math.sin(t * 2.15 + index * 0.71 + baseX * 3.8)
        const crossFold = Math.sin(baseX * 10.5 + index * 0.4)
        live[i] = baseX + loose * (hemWave * (0.018 + Math.abs(drive) * 0.055) + drive * 0.045)
        live[i + 1] = baseY + loose * Math.sin(t * 1.65 + index + baseX * 2.2) * (0.008 + Math.abs(drive) * 0.018)
        live[i + 2] = baseZ + loose * (crossFold * 0.026 + hemWave * Math.abs(drive) * 0.045)
      }
      positions.needsUpdate = true
    }
    if (leftSleeve.current && rightSleeve.current) {
      const wave = Math.sin(t * 2.3 + index) * 0.035 + drive * 0.06
      leftSleeve.current.rotation.z = -1.02 + wave
      rightSleeve.current.rotation.z = 1.02 + wave
    }
  })

  return (
    <group>
      <Hanger />
      <group ref={cloth} position={[0, -0.03, 0]}>
        {kind === 'trousers' ? (
          <group position={[0, -0.17, 0]}>
            <mesh castShadow receiveShadow position={[-0.22, -0.75, 0]} rotation={[0, 0, -0.035]}>
              <capsuleGeometry args={[0.18, 1.35, 5, 8]} />
              <meshStandardMaterial color={color} roughness={0.72} />
            </mesh>
            <mesh castShadow receiveShadow position={[0.22, -0.75, 0]} rotation={[0, 0, 0.035]}>
              <capsuleGeometry args={[0.18, 1.35, 5, 8]} />
              <meshStandardMaterial color={color} roughness={0.72} />
            </mesh>
            <mesh castShadow position={[0, -0.08, 0]}><boxGeometry args={[0.58, 0.35, 0.2]} /><meshStandardMaterial color={color} roughness={0.72} /></mesh>
          </group>
        ) : (
          <>
            <mesh ref={body} castShadow receiveShadow geometry={geometry}>
              <meshStandardMaterial color={color} roughness={0.78} metalness={0.01} side={THREE.DoubleSide} />
            </mesh>
            {hasCover && <mesh geometry={geometry} scale={[1.1, 1.055, 1.45]} position={[0, -0.035, 0.015]} renderOrder={2}>
              <meshPhysicalMaterial
                color="#f5f8f8" transparent opacity={0.16} depthWrite={false}
                roughness={0.18} metalness={0} clearcoat={0.7} clearcoatRoughness={0.22}
                side={THREE.DoubleSide}
              />
            </mesh>}
            {hasSleeves && <>
              <mesh ref={leftSleeve} castShadow position={[-0.61, -0.56, 0]} rotation={[0, 0, -1.02]}>
                <capsuleGeometry args={[kind === 'coat' ? 0.14 : 0.12, isLong ? 0.95 : 0.72, 5, 8]} />
                <meshStandardMaterial color={color} roughness={0.8} />
              </mesh>
              <mesh ref={rightSleeve} castShadow position={[0.61, -0.56, 0]} rotation={[0, 0, 1.02]}>
                <capsuleGeometry args={[kind === 'coat' ? 0.14 : 0.12, isLong ? 0.95 : 0.72, 5, 8]} />
                <meshStandardMaterial color={color} roughness={0.8} />
              </mesh>
            </>}
            {(kind === 'shirt' || kind === 'jacket') && <>
              <mesh position={[0, -0.76, 0.125]}><boxGeometry args={[0.018, 1.25, 0.018]} /><meshStandardMaterial color="#d7d8d5" /></mesh>
              {[-0.34, -0.62, -0.9].map((y) => <mesh key={y} position={[0, y, 0.145]}><sphereGeometry args={[0.025, 6, 5]} /><meshStandardMaterial color="#e4e2dc" /></mesh>)}
            </>}
            {kind === 'jacket' && <>
              <mesh position={[-0.27, -0.86, 0.13]} rotation={[0, 0, -0.5]}><boxGeometry args={[0.34, 0.025, 0.018]} /><meshStandardMaterial color="#cac9c4" /></mesh>
              <mesh position={[0.27, -0.86, 0.13]} rotation={[0, 0, 0.5]}><boxGeometry args={[0.34, 0.025, 0.018]} /><meshStandardMaterial color="#cac9c4" /></mesh>
            </>}
          </>
        )}
      </group>
    </group>
  )
}
