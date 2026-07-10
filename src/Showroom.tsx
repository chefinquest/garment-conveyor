import { ContactShadows, OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import * as THREE from 'three'
import { Conveyor } from './Conveyor'

type Props = {
  direction: React.RefObject<number>
  speed: React.RefObject<number>
  onSpeed: (speed: number) => void
  onReady: () => void
  reducedMotion: boolean
}

export function Showroom({ direction, speed, onSpeed, onReady, reducedMotion }: Props) {
  return (
    <Canvas
      shadows="basic"
      dpr={[1, 1.75]}
      camera={{ position: [9.4, 6.5, 9.6], fov: 34, near: 0.1, far: 60 }}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.outputColorSpace = THREE.SRGBColorSpace
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.12
        onReady()
      }}
    >
      <color attach="background" args={['#f5f5f3']} />
      <fog attach="fog" args={['#f5f5f3', 17, 28]} />
      <ambientLight intensity={1.45} color="#eef2f5" />
      <hemisphereLight intensity={1.4} color="#ffffff" groundColor="#b8bdc2" />
      <directionalLight
        castShadow position={[-5, 10, 7]} intensity={3.2} color="#fffdf8"
        shadow-mapSize={[2048, 2048]} shadow-camera-left={-9} shadow-camera-right={9}
        shadow-camera-top={7} shadow-camera-bottom={-5} shadow-bias={-0.0003}
      />
      <directionalLight position={[7, 5, -6]} intensity={1.6} color="#dce8f3" />
      <Suspense fallback={null}>
        <group position={[0, 0, 0]}>
          <Conveyor direction={direction} speed={speed} onSpeed={onSpeed} reducedMotion={reducedMotion} />
        </group>
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
          <planeGeometry args={[32, 24]} />
          <meshStandardMaterial color="#f5f5f3" roughness={0.92} />
        </mesh>
        <ContactShadows position={[0, 0.015, 0]} opacity={0.38} scale={18} blur={2.4} far={8} resolution={1024} color="#667079" />
      </Suspense>
      <OrbitControls
        makeDefault enablePan={false} enableZoom={false}
        minPolarAngle={Math.PI * 0.27} maxPolarAngle={Math.PI * 0.42}
        minAzimuthAngle={Math.PI * 0.11} maxAzimuthAngle={Math.PI * 0.39}
        target={[0, 1.65, 0]} rotateSpeed={0.35} dampingFactor={0.08} enableDamping
      />
    </Canvas>
  )
}
