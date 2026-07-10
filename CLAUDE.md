# Garment Conveyor

## Goal
Build a polished, detailed, interactive Three.js recreation of the supplied overhead garment conveyor reference image at `/Users/chef/.hermes/image_cache/img_1b29e355a0c9.jpg`.

## Product requirements
- Vite + React + TypeScript + React Three Fiber / Three.js.
- Full-viewport near-white showroom presentation with a rounded inset frame, matching the reference's clean product-render composition.
- Highly detailed suspended industrial garment conveyor: long oval/rounded track, raised return loop at right, layered rails, trolley chain, repeated hooks/hangers, support columns, foot plates, brushed metal materials, red accent stripe.
- Many distinct 3D hanging garments in varied colors and silhouettes, including shirts, jackets, coats, dresses, and trousers. They must look volumetric and cloth-like rather than flat cards.
- Fabric drape and physically inspired motion: hems/sleeves should deform and sway, and garment/hanger movement should have spring/inertia behavior when belt starts/stops. A performant vertex-shader or procedural simulation is acceptable; describe it accurately in the README.
- Large bottom-left and bottom-right arrow buttons plus keyboard Left/Right arrows move the conveyor around its route. Press-and-hold works; movement eases in/out; direction is obvious; clothing travels around straight and curved sections.
- Pointer drag should orbit the camera slightly, but the initial view must closely match the supplied three-quarter product shot.
- Responsive mobile/desktop behavior, accessible controls, loading/progress state, reduced-motion support, polished typography and micro-UI.
- No external fragile model/CDN dependencies; procedural geometry is preferred.
- Add a concise info/status overlay showing direction/speed and instructions without obscuring the product.
- Configure GitHub Pages project-path deployment for repository `garment-conveyor`.

## Quality bar
The first frame must clearly look like the reference: a silver overhead dry-cleaning conveyor densely packed with individually hung garments. Prioritize silhouette, track detail, garment density, realistic shadows, white studio lighting, and clear arrow interaction. Do not settle for primitive boxes or a generic carousel.

## Commands
- `npm run dev`
- `npm run build`
- `npm run lint`

## Code standards
- TypeScript strict mode; no `any` unless unavoidable and justified.
- Keep reusable 3D pieces in components/modules.
- Avoid runtime console errors and excessive per-frame allocations.
- Use asset URLs through `import.meta.env.BASE_URL` if adding public assets.
