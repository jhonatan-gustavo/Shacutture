import { useEffect, useRef } from 'react'
import { Plus } from 'lucide-react'
import { gsap, ScrollTrigger } from '../../lib/gsap'

const ITEMS = [
  'SHACUTTURE',
  'THE ART OF WEARING WHAT YOU FEEL',
  'DROP 001 — EN VIVO',
  'EDICIÓN LIMITADA',
  'ENVÍOS A TODO MÉXICO',
]

export default function MarqueeTicker() {
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const tween = gsap.to(track, {
      xPercent: -50,
      ease: 'none',
      duration: 24,
      repeat: -1,
    })

    const speed = { value: 1 }
    let idleTimer: number | undefined

    const setSpeed = (target: number) => {
      gsap.to(speed, {
        value: target,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: true,
        onUpdate: () => tween.timeScale(speed.value),
      })
    }

    const trigger = ScrollTrigger.create({
      onUpdate: (self) => {
        const velocity = self.getVelocity()
        if (Math.abs(velocity) < 80) return

        const direction = velocity > 0 ? 1 : -1
        const boost = 1 + Math.min(Math.abs(velocity) / 900, 5)
        setSpeed(direction * boost)

        window.clearTimeout(idleTimer)
        idleTimer = window.setTimeout(() => setSpeed(1), 180)
      },
    })

    return () => {
      window.clearTimeout(idleTimer)
      trigger.kill()
      tween.kill()
    }
  }, [])

  return (
    <div className="overflow-hidden border-b-[3px] border-negro bg-vino py-4 md:py-5">
      <div ref={trackRef} className="flex w-max">
        {[0, 1].map((copy) => (
          <div
            key={copy}
            className="flex shrink-0 items-center"
            aria-hidden={copy === 1 ? 'true' : undefined}
          >
            {ITEMS.map((item, index) => (
              <span key={`${copy}-${item}`} className="flex items-center">
                <span
                  className={
                    index % 2 === 0
                      ? 'whitespace-nowrap font-display text-xl uppercase tracking-tight text-crema md:text-3xl'
                      : 'whitespace-nowrap font-brush text-xl lowercase text-carmesi md:text-3xl'
                  }
                >
                  {item}
                </span>
                <Plus className="mx-6 h-5 w-5 shrink-0 text-crema/70 md:mx-8 md:h-6 md:w-6" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
