import { useEffect, useRef, useState } from 'react'
import { Check, Flame, Heart, Plus, Shirt } from 'lucide-react'
import { useCartStore } from '../../store/useCartStore'
import { cn, formatPrice } from '../../lib/utils'
import { gsap } from '../../lib/gsap'

export type MosaicProduct = {
  id: string
  n: string
  name: string
  category: 'Streetwear' | 'Hoodies' | 'Accesorios'
  price: number
  limited: boolean
  soldOut: boolean
  isNew: boolean
}

export type MosaicLook = {
  id: string
  label: string
  headline: string
  brush: string
  theme: 'wine' | 'ink' | 'red'
}

export type MosaicItem =
  | ({ kind: 'product' } & MosaicProduct)
  | ({ kind: 'look' } & MosaicLook)

const SPANS = [
  'lg:col-span-2 lg:row-span-2',
  'lg:row-span-1',
  'lg:row-span-2',
  'lg:row-span-1',
  'lg:col-span-2 lg:row-span-1',
  'lg:row-span-1',
  'lg:row-span-2',
  'lg:row-span-1',
  'lg:col-span-2 lg:row-span-2',
  'lg:row-span-1',
  'lg:row-span-1',
  'lg:row-span-1',
]

const CARD_THEMES = {
  Streetwear: {
    card: 'bg-blanco text-negro',
    thumb: 'bg-crema',
    number: 'text-vino/20',
    divider: 'border-b-[3px] border-negro',
  },
  Hoodies: {
    card: 'bg-negro text-crema',
    thumb: 'bg-[#1A1A1A]',
    number: 'text-carmesi/25',
    divider: 'border-b-[3px] border-crema/25',
  },
  Accesorios: {
    card: 'bg-vino text-crema',
    thumb: 'bg-vino-deep',
    number: 'text-crema/15',
    divider: 'border-b-[3px] border-crema/25',
  },
} as const

const LOOK_THEMES = {
  wine: {
    card: 'bg-vino text-crema',
    pattern: 'radial-gradient(rgba(244,240,234,0.28) 1.5px, transparent 1.5px)',
    size: '16px 16px',
    accent: 'text-carmesi',
  },
  ink: {
    card: 'bg-negro text-crema',
    pattern: 'repeating-linear-gradient(45deg, #C81D25 0 10px, transparent 10px 30px)',
    size: 'auto',
    accent: 'text-carmesi',
  },
  red: {
    card: 'bg-carmesi text-blanco',
    pattern: 'repeating-linear-gradient(-45deg, rgba(13,13,13,0.35) 0 8px, transparent 8px 26px)',
    size: 'auto',
    accent: 'text-negro',
  },
} as const

function ProductCell({ product }: { product: MosaicProduct }) {
  const liked = useCartStore((s) => s.wishlist.includes(product.id))
  const toggleWishlist = useCartStore((s) => s.toggleWishlist)
  const addItem = useCartStore((s) => s.addItem)
  const [pop, setPop] = useState(false)
  const [added, setAdded] = useState(false)
  const popTimer = useRef<number | undefined>(undefined)
  const addTimer = useRef<number | undefined>(undefined)

  useEffect(
    () => () => {
      window.clearTimeout(popTimer.current)
      window.clearTimeout(addTimer.current)
    },
    [],
  )

  const theme = CARD_THEMES[product.category]
  const Icon = product.category === 'Hoodies' ? Flame : Shirt

  const handleLike = () => {
    toggleWishlist(product.id)
    setPop(true)
    window.clearTimeout(popTimer.current)
    popTimer.current = window.setTimeout(() => setPop(false), 400)
  }

  const handleAdd = () => {
    if (product.soldOut) return
    addItem({ id: product.id, name: product.name, price: product.price, size: 'M' })
    setAdded(true)
    window.clearTimeout(addTimer.current)
    addTimer.current = window.setTimeout(() => setAdded(false), 1400)
  }

  return (
    <div className="mosaic-inner flex h-full w-full flex-col">
      <div
        className={cn(
          'relative flex min-h-[130px] flex-1 items-center justify-center overflow-hidden',
          theme.thumb,
          theme.divider,
        )}
      >
        <span
          className={cn(
            'font-display text-[6.5rem] leading-none tracking-tighter',
            theme.number,
          )}
          aria-hidden="true"
        >
          {product.n}
        </span>
        <Icon
          className={cn(
            'absolute bottom-3 right-3 h-7 w-7 opacity-50',
            product.soldOut && 'opacity-25',
          )}
          aria-hidden="true"
        />
        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {product.soldOut ? (
            <span className="badge-brutal bg-negro text-crema">Sold Out</span>
          ) : product.limited ? (
            <span className="badge-brutal bg-carmesi text-blanco">Edición limitada</span>
          ) : product.isNew ? (
            <span className="badge-brutal bg-carmesi text-blanco">Nuevo</span>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-1.5 p-4">
        <span className="font-heading text-[10px] font-extrabold uppercase tracking-[0.18em] opacity-60">
          {product.category}
        </span>
        <h3
          className={cn(
            'font-display text-sm uppercase leading-tight tracking-tight line-clamp-2',
            product.soldOut && 'opacity-50 line-through',
          )}
        >
          {product.name}
        </h3>
        <div className="mt-2 flex items-center justify-between gap-2">
          <span
            className={cn(
              'font-heading text-base font-extrabold',
              product.soldOut && 'opacity-50 line-through',
            )}
          >
            {formatPrice(product.price)}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLike}
              aria-label={liked ? 'Quitar de favoritos' : 'Añadir a favoritos'}
              aria-pressed={liked}
              className={cn(
                'grid h-10 w-10 place-items-center border-[3px] border-negro shadow-brutal-sm transition-all duration-150 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none',
                liked ? 'bg-carmesi text-blanco' : 'bg-blanco text-negro hover:bg-crema',
                pop && 'animate-heart-pop',
              )}
            >
              <Heart className={cn('h-4 w-4', liked && 'fill-current')} />
            </button>
            <button
              type="button"
              onClick={handleAdd}
              disabled={product.soldOut}
              className={cn(
                'btn-brutal px-3 py-2 text-[10px]',
                product.soldOut
                  ? 'cursor-not-allowed bg-negro/40 shadow-none hover:translate-x-0 hover:translate-y-0 hover:shadow-none'
                  : added
                    ? 'bg-negro'
                    : 'bg-vino',
              )}
            >
              {added ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  Añadido
                </>
              ) : product.soldOut ? (
                'Agotado'
              ) : (
                <>
                  <Plus className="h-3.5 w-3.5" />
                  Añadir
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function LookCell({ look }: { look: MosaicLook }) {
  const theme = LOOK_THEMES[look.theme]

  return (
    <div
      className={cn('mosaic-inner relative flex h-full w-full flex-col justify-between overflow-hidden p-5', theme.card)}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: theme.pattern, backgroundSize: theme.size }}
        aria-hidden="true"
      />
      <span className="badge-brutal relative w-fit bg-crema text-negro">Lookbook</span>
      <div className="relative">
        <p className="font-display text-4xl uppercase leading-none tracking-tighter md:text-5xl">
          {look.headline}
        </p>
        <p className={cn('mt-2 font-brush text-2xl lowercase md:text-3xl', theme.accent)}>
          {look.brush}
        </p>
      </div>
      <span className="relative font-heading text-[10px] font-extrabold uppercase tracking-[0.2em] opacity-70">
        {look.label}
      </span>
    </div>
  )
}

export default function MosaicRevealGrid({ items }: { items: MosaicItem[] }) {
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return

    const ctx = gsap.context(() => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (reduced) {
        gsap.set('.mosaic-curtain', { display: 'none' })
        return
      }

      const cells = gsap.utils.toArray<HTMLElement>('.mosaic-cell')

      cells.forEach((cell) => {
        const curtain = cell.querySelector<HTMLElement>('.mosaic-curtain')
        const inner = cell.querySelector<HTMLElement>('.mosaic-inner')
        if (!curtain || !inner) return

        gsap
          .timeline({
            scrollTrigger: {
              trigger: cell,
              start: 'top 92%',
              end: 'top 40%',
              scrub: 0.5,
            },
          })
          .fromTo(
            curtain,
            { clipPath: 'inset(0% 0% 0% 0%)' },
            { clipPath: 'inset(0% 0% 100% 0%)', ease: 'none' },
            0,
          )
          .fromTo(inner, { scale: 1.15 }, { scale: 1, ease: 'none' }, 0)
      })
    }, gridRef)

    return () => ctx.revert()
  }, [items])

  return (
    <div
      ref={gridRef}
      className="grid auto-rows-auto grid-flow-dense grid-cols-1 gap-6 sm:auto-rows-[260px] sm:grid-cols-2 lg:grid-cols-4"
    >
      {items.map((item, index) => {
        if (item.kind === 'look') {
          return (
            <div
              key={item.id}
              className={cn(
                'mosaic-cell relative min-h-[240px] overflow-hidden border-[3px] border-negro shadow-brutal',
                SPANS[index % SPANS.length],
                LOOK_THEMES[item.theme].card,
              )}
            >
              <LookCell look={item} />
              <div className="mosaic-curtain pointer-events-none absolute inset-0 z-10 grid place-items-center bg-vino">
                <span className="font-brush text-3xl text-crema/90">shacutture</span>
              </div>
            </div>
          )
        }

        return (
          <div
            key={item.id}
            className={cn(
              'mosaic-cell relative min-h-[240px] overflow-hidden border-[3px] border-negro shadow-brutal',
              SPANS[index % SPANS.length],
              CARD_THEMES[item.category].card,
            )}
          >
            <ProductCell product={item} />
            <div className="mosaic-curtain pointer-events-none absolute inset-0 z-10 grid place-items-center bg-vino">
              <span className="font-brush text-3xl text-crema/90">shacutture</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
