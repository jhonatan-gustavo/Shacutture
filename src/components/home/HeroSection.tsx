import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'
import { gsap } from '../../lib/gsap'

function TeeGraphic() {
  return (
    <svg viewBox="0 0 200 190" className="w-40 md:w-56" aria-hidden="true">
      <path
        d="M62 28 L42 44 L20 78 L46 94 L56 80 L56 168 L144 168 L144 80 L154 94 L180 78 L158 44 L138 28 C130 44 118 52 100 52 C82 52 70 44 62 28 Z"
        fill="#F4F0EA"
        stroke="#0D0D0D"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path d="M84 86 L116 86" stroke="#C81D25" strokeWidth="7" strokeLinecap="round" />
      <path d="M84 100 L106 100" stroke="#4A0E17" strokeWidth="7" strokeLinecap="round" />
    </svg>
  )
}

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const posterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const section = sectionRef.current
    const poster = posterRef.current

    const ctx = gsap.context(() => {
      if (reduced) return

      gsap
        .timeline({ defaults: { ease: 'power4.out' } })
        .from('.hero-line > span', { yPercent: 115, duration: 1.1, stagger: 0.12 })
        .from('.hero-fade', { y: 28, autoAlpha: 0, duration: 0.7, stagger: 0.1 }, '-=0.55')
        .from('.hero-poster', { y: 70, autoAlpha: 0, duration: 1 }, '-=0.95')
    }, sectionRef)

    let removeParallax: (() => void) | undefined

    if (!reduced && section && poster && window.matchMedia('(pointer: fine)').matches) {
      const xTo = gsap.quickTo(poster, 'x', { duration: 0.7, ease: 'power3.out' })
      const yTo = gsap.quickTo(poster, 'y', { duration: 0.7, ease: 'power3.out' })

      const onMove = (event: MouseEvent) => {
        const rect = section.getBoundingClientRect()
        const nx = (event.clientX - rect.left) / rect.width - 0.5
        const ny = (event.clientY - rect.top) / rect.height - 0.5
        xTo(nx * 36)
        yTo(ny * 28)
      }

      const onLeave = () => {
        xTo(0)
        yTo(0)
      }

      section.addEventListener('mousemove', onMove)
      section.addEventListener('mouseleave', onLeave)

      removeParallax = () => {
        section.removeEventListener('mousemove', onMove)
        section.removeEventListener('mouseleave', onLeave)
      }
    }

    return () => {
      removeParallax?.()
      ctx.revert()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-b-[3px] border-negro bg-crema"
    >
      <div className="mx-auto grid w-full max-w-7xl items-center gap-14 px-4 py-16 md:grid-cols-[1.35fr_1fr] md:px-6 md:py-24">
        <div className="flex flex-col items-start gap-7">
          <div className="hero-fade flex flex-wrap gap-2">
            <span className="badge-brutal bg-carmesi text-blanco">Drop 001</span>
            <span className="badge-brutal bg-crema">Edición limitada</span>
            <span className="badge-brutal bg-negro text-crema">CDMX</span>
          </div>

          <h1 className="font-display uppercase tracking-tight text-negro">
            <span className="hero-line block overflow-hidden pb-1">
              <span className="block text-[13vw] leading-[0.92] md:text-8xl">The Art of</span>
            </span>
            <span className="hero-line block overflow-hidden pb-1">
              <span className="block text-[13vw] leading-[0.92] md:text-8xl">Wearing</span>
            </span>
            <span className="hero-line block overflow-hidden pb-2">
              <span className="block -rotate-1 font-brush text-[11.5vw] lowercase leading-[1.05] text-vino md:text-7xl">
                what you feel.
              </span>
            </span>
          </h1>

          <p className="hero-fade max-w-md text-base font-medium leading-relaxed text-negro/70 md:text-lg">
            Streetwear neobrutalista de edición limitada. Siluetas pesadas, tintas densas y cero
            permiso: lleva lo que sientes.
          </p>

          <div className="hero-fade flex flex-wrap items-center gap-5">
            <Link to="/colecciones" className="btn-brutal px-8 py-4 text-sm">
              Comprar ahora
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/colecciones"
              className="border-b-2 border-negro font-heading text-xs font-extrabold uppercase tracking-[0.14em] text-negro transition hover:text-vino"
            >
              Ver el drop
            </Link>
          </div>

          <div className="hero-fade flex w-full items-center gap-3 border-t-[3px] border-negro pt-5 font-heading text-[11px] font-extrabold uppercase tracking-[0.2em] text-negro/60">
            <Sparkles className="h-4 w-4 shrink-0 text-carmesi" />
            <span>Shacutture — The Art of Wearing What You Feel</span>
          </div>
        </div>

        <div ref={posterRef} className="hero-poster relative mx-auto w-full max-w-sm">
          <div className="rotate-3 border-[3px] border-negro bg-vino shadow-brutal-xl">
            <div className="flex items-center justify-between border-b-[3px] border-negro bg-crema px-4 py-2 font-heading text-[11px] font-extrabold uppercase tracking-[0.16em] text-negro">
              <span>Drop 001</span>
              <span>Shacutture</span>
            </div>
            <div className="grid place-items-center px-6 py-10">
              <TeeGraphic />
            </div>
            <div className="flex items-center justify-between border-t-[3px] border-negro bg-carmesi px-4 py-2 font-heading text-[11px] font-extrabold uppercase tracking-[0.16em] text-blanco">
              <span>Oversize Tee</span>
              <span>$749 MXN</span>
            </div>
          </div>
          <span className="badge-brutal absolute -left-4 -top-4 -rotate-2 bg-carmesi text-blanco">
            Nuevo
          </span>
          <span className="badge-brutal absolute -bottom-4 -right-4 rotate-3 bg-crema">
            Envío gratis +$999
          </span>
        </div>
      </div>
    </section>
  )
}
