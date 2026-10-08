import { useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { Float, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { Link } from 'react-router-dom'
import { ArrowRight, RotateCcw } from 'lucide-react'

function ShirtMesh() {
  const geometry = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(-0.35, 1.3)
    shape.quadraticCurveTo(0, 0.95, 0.35, 1.3)
    shape.lineTo(1, 0.95)
    shape.lineTo(1.3, 0.35)
    shape.lineTo(0.78, 0.12)
    shape.lineTo(0.6, 0.4)
    shape.lineTo(0.6, -1.3)
    shape.lineTo(-0.6, -1.3)
    shape.lineTo(-0.6, 0.4)
    shape.lineTo(-0.78, 0.12)
    shape.lineTo(-1.3, 0.35)
    shape.lineTo(-1, 0.95)
    shape.closePath()

    const neck = new THREE.Path()
    neck.absellipse(0, 1.16, 0.26, 0.15, 0, Math.PI * 2)
    shape.holes.push(neck)

    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.16,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.05,
      bevelSegments: 4,
      curveSegments: 16,
    })
    geo.center()
    return geo
  }, [])

  return (
    <Float speed={1.6} rotationIntensity={0.5} floatIntensity={0.7}>
      <mesh geometry={geometry}>
        <meshStandardMaterial color="#C81D25" roughness={0.38} metalness={0.06} />
      </mesh>
    </Float>
  )
}

export default function Product3DViewer() {
  return (
    <section className="border-b-[3px] border-negro bg-negro text-crema">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 md:px-6 md:py-24">
        <div className="flex flex-col gap-6 border-b-[3px] border-crema/25 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="badge-brutal bg-carmesi text-blanco">Visor 3D</span>
            <h2 className="mt-4 font-display text-4xl uppercase leading-none tracking-tight md:text-6xl">
              La pieza{' '}
              <span className="font-brush lowercase text-carmesi">en 3D</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm font-medium leading-relaxed text-crema/70 md:text-base">
            Gira, acerca y revisa el corte desde todo ángulo antes de llevarlo. Visor WebGL
            interactivo, sin recargas.
          </p>
        </div>

        <div className="relative mt-10 border-[3px] border-crema bg-[#151515] shadow-[6px_6px_0px_#C81D25]">
          <div className="h-[420px] w-full md:h-[560px]">
            <Canvas
              camera={{ position: [0, 0, 5.2], fov: 42 }}
              gl={{ antialias: true, alpha: true }}
              dpr={[1, 2]}
            >
              <ambientLight intensity={0.75} />
              <directionalLight position={[4, 6, 5]} intensity={2.2} color="#FFF6EA" />
              <directionalLight position={[-5, -2, -4]} intensity={1.1} color="#C81D25" />
              <pointLight position={[0, -3, 3]} intensity={18} color="#F4F0EA" distance={14} />
              <ShirtMesh />
              <OrbitControls
                enablePan={false}
                minDistance={3.4}
                maxDistance={8}
                autoRotate
                autoRotateSpeed={1.1}
                minPolarAngle={Math.PI / 5}
                maxPolarAngle={(Math.PI * 4) / 5}
              />
            </Canvas>
          </div>

          <span className="badge-brutal pointer-events-none absolute left-4 top-4 bg-crema">
            Drop 001 — Oversize Tee
          </span>
          <span className="badge-brutal pointer-events-none absolute right-4 top-4 bg-carmesi text-blanco">
            $749 MXN
          </span>
          <span className="badge-brutal pointer-events-none absolute bottom-4 left-4 flex items-center gap-2 bg-crema">
            <RotateCcw className="h-3.5 w-3.5" />
            Arrastra para rotar 360°
          </span>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="flex flex-wrap items-center gap-4">
            <span className="badge-brutal bg-crema">100% algodón pesado</span>
            <span className="badge-brutal bg-crema">Tallaje oversize</span>
            <span className="badge-brutal bg-crema">Hecho en México</span>
          </div>
          <Link to="/colecciones" className="btn-brutal px-8 py-4 text-sm">
            Comprar ahora
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
