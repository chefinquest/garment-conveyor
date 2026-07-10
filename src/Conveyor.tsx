import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Garment } from './Garment'
import { conveyorRoute, darkMetal, metal } from './route'

type Props = {
  direction: React.RefObject<number>
  speed: React.RefObject<number>
  onSpeed: (speed: number) => void
  reducedMotion: boolean
}

const COLORS = [
  '#252a2c', '#343638', '#1f426f', '#1e5aa0', '#933f43', '#24282b', '#5d666b',
  '#d1c8be', '#d9b9bd', '#3d4243', '#15191b', '#7a343b', '#d8d5d0', '#9a8d80',
  '#332f31', '#e3d9cf', '#9d234d', '#bfcbd0', '#38444a', '#ded8d0', '#b58b32', '#343638',
]
const KINDS = ['coat', 'shirt', 'jacket', 'coat', 'trousers', 'jacket', 'dress'] as const
const COUNT = 42

function Track() {
  const upperCurve = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(2.8, 3.0, -1.55), new THREE.Vector3(4.0, 3.55, -1.42),
    new THREE.Vector3(4.6, 4.25, -0.7), new THREE.Vector3(5.15, 4.18, 0.45),
    new THREE.Vector3(4.2, 4.05, 1.35), new THREE.Vector3(2.9, 3.3, 1.55),
  ]), [])
  return (
    <group>
      <mesh castShadow material={metal}><tubeGeometry args={[conveyorRoute, 240, 0.22, 10, true]} /></mesh>
      <mesh castShadow material={darkMetal}><tubeGeometry args={[conveyorRoute, 240, 0.105, 8, true]} /></mesh>
      <mesh castShadow position={[0, -0.31, 0]} material={metal}><tubeGeometry args={[conveyorRoute, 240, 0.075, 8, true]} /></mesh>
      <mesh castShadow position={[0, 0.13, 0]}><tubeGeometry args={[conveyorRoute, 240, 0.032, 6, true]} /><meshStandardMaterial color="#e7e9e9" metalness={0.95} roughness={0.16} /></mesh>
      <mesh castShadow><tubeGeometry args={[upperCurve, 100, 0.09, 8, false]} /><meshStandardMaterial color="#858a8c" metalness={0.9} roughness={0.25} /></mesh>
      <mesh castShadow position={[0, 0.18, 0.28]}><tubeGeometry args={[upperCurve, 100, 0.055, 8, false]} /><meshStandardMaterial color="#b9bdbe" metalness={0.9} roughness={0.22} /></mesh>
      <mesh castShadow position={[-1.7, 2.7, 0]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.055, 7.2, 0.22]} /><meshStandardMaterial color="#cb2934" metalness={0.35} roughness={0.35} />
      </mesh>
      {Array.from({ length: 72 }, (_, i) => {
        const p = conveyorRoute.getPointAt(i / 72)
        return <group key={i} position={p}>
          <mesh castShadow position={[0, -0.28, 0]}><boxGeometry args={[0.2, 0.12, 0.18]} /><primitive object={darkMetal} attach="material" /></mesh>
          <mesh castShadow position={[0, -0.47, 0]}><cylinderGeometry args={[0.022, 0.022, 0.32, 6]} /><primitive object={darkMetal} attach="material" /></mesh>
        </group>
      })}
    </group>
  )
}

function Support({ x, z, height = 2.72 }: { x: number; z: number; height?: number }) {
  return <group position={[x, 0, z]}>
    <mesh castShadow receiveShadow position={[0, 0.05, 0]}><boxGeometry args={[0.72, 0.1, 0.52]} /><primitive object={darkMetal} attach="material" /></mesh>
    {[[-0.27, -0.18], [0.27, -0.18], [-0.27, 0.18], [0.27, 0.18]].map(([bx, bz], i) =>
      <mesh key={i} position={[bx, 0.12, bz]}><cylinderGeometry args={[0.035, 0.045, 0.1, 8]} /><primitive object={darkMetal} attach="material" /></mesh>)}
    <mesh castShadow receiveShadow position={[0, height / 2, 0]}><boxGeometry args={[0.34, height, 0.3]} /><primitive object={metal} attach="material" /></mesh>
    <mesh castShadow position={[0, height - 0.08, 0]}><boxGeometry args={[1.05, 0.22, 0.28]} /><primitive object={metal} attach="material" /></mesh>
  </group>
}

export function Conveyor({ direction, speed, onSpeed, reducedMotion }: Props) {
  const garmentRefs = useRef<(THREE.Group | null)[]>([])
  const offset = useRef(0)
  const motion = useRef(0)
  const lastReport = useRef(0)
  const target = useMemo(() => new THREE.Vector3(), [])
  const tangent = useMemo(() => new THREE.Vector3(), [])

  useFrame(({ clock }, delta) => {
    const wanted = direction.current * (reducedMotion ? 0.08 : 0.22)
    speed.current = THREE.MathUtils.damp(speed.current, wanted, direction.current === 0 ? 3.4 : 5.2, delta)
    motion.current = THREE.MathUtils.damp(motion.current, speed.current * 5.5, 3.5, delta)
    offset.current = (offset.current + speed.current * delta + 1) % 1
    garmentRefs.current.forEach((group, i) => {
      if (!group) return
      const u = (i / COUNT + offset.current) % 1
      conveyorRoute.getPointAt(u, target)
      conveyorRoute.getTangentAt(u, tangent)
      group.position.copy(target)
      group.position.y -= 0.67
      group.rotation.y = -Math.atan2(tangent.z, tangent.x)
    })
    if (clock.elapsedTime - lastReport.current > 0.12) {
      lastReport.current = clock.elapsedTime
      onSpeed(speed.current)
    }
  })

  return (
    <group>
      <Track />
      <Support x={-3.65} z={0.95} />
      <Support x={2.75} z={0.95} />
      <Support x={4.85} z={-0.7} height={3.1} />
      {Array.from({ length: COUNT }, (_, i) => (
        <group key={i} ref={(node) => { garmentRefs.current[i] = node }} scale={i % 9 === 0 ? 0.7 : 0.63}>
          <Garment color={COLORS[i % COLORS.length]} kind={KINDS[i % KINDS.length]} index={i} motion={motion} />
        </group>
      ))}
    </group>
  )
}
