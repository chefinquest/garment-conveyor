import * as THREE from 'three'

const routePoints = [
  [-5.65, 2.85, -1.55], [-4.7, 2.85, -1.78], [-2.2, 2.85, -1.82],
  [0.5, 2.85, -1.82], [3.55, 2.85, -1.72], [5.0, 2.85, -1.25],
  [5.55, 2.85, -0.45], [5.55, 2.85, 0.5], [4.95, 2.85, 1.35],
  [3.65, 2.85, 1.72], [1.1, 2.85, 1.78], [-1.5, 2.85, 1.78],
  [-4.55, 2.85, 1.72], [-5.55, 2.85, 1.25], [-5.9, 2.85, 0.35],
  [-5.9, 2.85, -0.65],
] as const

export const conveyorRoute = new THREE.CatmullRomCurve3(
  routePoints.map(([x, y, z]) => new THREE.Vector3(x, y, z)),
  true,
  'catmullrom',
  0.3,
)

export const metal = new THREE.MeshStandardMaterial({
  color: '#a9adb0', metalness: 0.88, roughness: 0.28,
})

export const darkMetal = new THREE.MeshStandardMaterial({
  color: '#45494b', metalness: 0.9, roughness: 0.22,
})
