import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Heart, Plus } from 'lucide-react'
import type { Product } from '../../data/products'
import { useCartStore } from '../../store/useCartStore'
import { cn, formatPrice } from '../../lib/utils'
import { gsap } from '../../lib/gsap'

export type MosaicItem =
  | { kind: 'product'; id: string; product: Product }
  | { kind: 'look'; id: string; product: Product }

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

const INFO_THEMES = ['bg-blanco text-negro', 'bg-negro text-crema', 'bg-vino text-crema']

function ProductCell({ product, index }: { product: Product; index: number }) {
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

  const handleLike = () => {
    toggleWishlist(product.id)
    setPop(true)
    window.clearTimeout(popTimer.current)
    popTimer.current = window.setTimeout(() => setPop(false), 400)
  }

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      size: product.sizes.includes('M') ? 'M' : product.sizes[0],
    })
    setAdded(true)
    window.clearTimeout(addTimer.current)
    addTimer.current = window.setTimeout(() => setAdded(false), 1400)
  }

  return (
    <div
      className={cn(
        'mosaic-inner flex h-full w-full flex-col',
        INFO_THEMES[index % INFO_THEMES.length],
      )}
    >
      <Link
        to={`/producto/${product.id}`}
        className="group/img relative block min-h-[130px] flex-1 overflow-hidden border-b-[3px] border-negro"
        aria-label={`Ver ${product.name}`}
      >
        <img
          src={product.images.front}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover/img:scale-105"
        />
        {product.badge ? (
          <span className="badge-brutal absolute left-3 top-3 z-10 bg-carmesi text-blanco">
            {product.badge}
          </span>
        ) : null}
      </Link>

      <div className="flex flex-col gap-1 p-3.5">
        <span className="line-clamp-1 font-heading text-[10px] font-extrabold uppercase tracking-[0.16em] opacity-60">
          {product.subtitle}
        </span>
        <h3 className="line-clamp-1 font-display text-sm uppercase leading-tight tracking-tight">
          <Link to={`/producto/${product.id}`} className="transition hover:text-carmesi">
            {product.name}
          </Link>
        </h3>
        <div className="mt-1.5 flex items-center justify-between gap-2">
          <span className="font-heading text-sm font-extrabold">
            {formatPrice(product.price)}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLike}
              aria-label={liked ? 'Quitar de favoritos' : 'Añadir a favoritos'}
              aria-pressed={liked}
              className={cn(
                'grid h-9 w-9 place-items-center border-[3px] border-negro shadow-brutal-sm transition-all duration-150 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none',
                liked ? 'bg-carmesi text-blanco' : 'bg-blanco text-negro hover:bg-crema',
                pop && 'animate-heart-pop',
              )}
            >
              <Heart className={cn('h-4 w-4', liked && 'fill-current')} />
            </button>
            <button
              type="button"
              onClick={handleAdd}
              className={cn(
                'btn-brutal px-3 py-2 text-[10px]',
                added ? 'bg-negro' : 'bg-vino',
              )}
            >
              {added ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  Añadido
                </>
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

function LookCell({ product }: { product: Product }) {
  return (
    <Link
      to={`/producto/${product.id}`}
      className="mosaic-inner relative block h-full min-h-[240px] w-full overflow-hidden"
      aria-label={`Lookbook de ${product.name}`}
    >
      <img
        src={product.images.lookbook}
        alt={`Lookbook de ${product.name}`}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-negro/75 via-negro/10 to-transparent"
        aria-hidden="true"
      />
      <span className="badge-brutal absolute left-3 top-3 z-10 bg-crema text-negro">
        Lookbook
      </span>
      <span className="absolute bottom-4 left-4 right-4 font-brush text-2xl leading-tight text-crema">
        {product.name}
      </span>
    </Link>
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
      {items.map((item, index) => (
        <div
          key={item.id}
          className={cn(
            'mosaic-cell relative min-h-[240px] overflow-hidden border-[3px] border-negro bg-blanco shadow-brutal',
            SPANS[index % SPANS.length],
          )}
        >
          {item.kind === 'product' ? (
            <ProductCell product={item.product} index={index} />
          ) : (
            <LookCell product={item.product} />
          )}
          <div className="mosaic-curtain pointer-events-none absolute inset-0 z-10 grid place-items-center bg-vino">
            <span className="font-brush text-3xl text-crema/90">shacutture</span>
          </div>
        </div>
      ))}
    </div>
  )
}
