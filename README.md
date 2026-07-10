# Garment Conveyor

An interactive, procedural 3D study of an overhead dry-cleaning conveyor, built with React, TypeScript, React Three Fiber, Drei, and Three.js.

## Interaction

- Hold the on-screen arrows or keyboard **Left / Right** arrows to drive the chain.
- Drag the scene to inspect the machine from a constrained product-view orbit.
- The belt eases into motion and coasts to a stop. Reduced-motion preferences automatically lower the drive speed and suppress UI animation.

## Rendering and motion

The installation is generated entirely in code: a closed Catmull–Rom rail drives layered tubular steel geometry, chain carriers, supports, fasteners, hangers, and 42 individually colored garments. Shirts, jackets, coats, dresses, and trousers use beveled extruded silhouettes, volumetric sleeves and legs, seams, buttons, and pockets rather than image cards. Every hanger is sampled along the route each frame and aligned to its tangent.

The controls feed a damped belt velocity rather than changing position directly. A second damped motion value gives each suspended garment spring-like lag when the belt starts, reverses, or stops. Every garment body also runs a lightweight position-based cloth pass: shoulder vertices stay pinned while progressively softer vertices toward the hem lag, ripple, form cross-folds, and react to belt acceleration. Phase-offset hanger oscillation and articulated sleeves complete the effect without the cost of a full soft-body solver. Most garments have a subtly reflective translucent dry-cleaning cover, matching the reference's layered fabric-and-plastic appearance.

## Development

```bash
npm run dev
npm run lint
npm run build
```

Vite uses the `/garment-conveyor/` base path for GitHub Pages project deployment.
