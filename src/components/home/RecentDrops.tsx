import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Check, Plus } from 'lucide-react'
import { PRODUCTS, type Product } from '../../data/products'
import { useCartStore } from '../../store/useCartStore'
import { cn, formatPrice } from '../../lib/utils'

const INFO_THEMES = ['bg-blanco text-negro', 'bg-negro text-crema', 'bg-vino text-crema']

function DropCard({ product, index }: { product: Product; index: number }) {
  const addItem = useCartStore((s) => s.addItem)
  const [size, setSize] = useState(product.sizes.includes('M') ? 'M' : product.sizes[0])
  const [added, setAdded] = useState(false)

  const handleBuy = () => {
    addItem({ id: product.id, name: product.name, price: product.price, size })
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1400)
  }

  return (
    <article className="card-brutal group flex flex-col overflow-hidden">
      <Link
        to={`/producto/${product.id}`}
        className="relative block h-64 overflow-hidden border-b-[3px] border-negro"
        aria-label={`Ver ${product.name}`}
      >
        <img
          src={product.images.front}
          alt={product.name}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500 group-hover:opacity-0"
        />
        <img
          src={product.images.back}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
        {product.badge ? (
          <span className="badge-brutal absolute left-3 top-3 z-10 bg-carmesi text-blanco">
            {product.badge}
          </span>
        ) : null}
      </Link>

      <div
        className={cn(
          'flex flex-1 flex-col gap-2 p-5',
          INFO_THEMES[index % INFO_THEMES.length],
        )}
      >
        <h3 className="font-display text-lg uppercase leading-tight tracking-tight">
          <Link to={`/producto/${product.id}`} className="transition hover:text-carmesi">
            {product.name}
          </Link>
        </h3>
        <p className="line-clamp-2 text-xs font-medium opacity-70">{product.subtitle}</p>

        <div className="mt-1 flex flex-wrap gap-1.5">
          {(['S', 'M', 'L', 'XL'] as const)
            .filter((option) => product.sizes.includes(option))
            .map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setSize(option)}
                aria-pressed={size === option}
                aria-label={`Talla ${option}`}
                className={cn(
                  'border-2 border-negro px-2.5 py-1 font-heading text-[11px] font-extrabold transition',
                  size === option
                    ? 'bg-carmesi text-blanco'
                    : 'bg-blanco text-negro hover:bg-crema',
                )}
              >
                {option}
              </button>
            ))}
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <span className="font-heading text-lg font-extrabold">
            {formatPrice(product.price)}
          </span>
          <button
            type="button"
            onClick={handleBuy}
            className={cn('btn-brutal px-4 py-2 text-[11px]', added && 'bg-negro')}
          >
            {added ? (
              <>
                <Check className="h-3.5 w-3.5" />
                Añadido
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5" />
                Comprar
              </>
            )}
          </button>
        </div>

        <Link
          to={`/producto/${product.id}`}
          className="flex items-center gap-1.5 font-heading text-[11px] font-extrabold uppercase tracking-[0.14em] opacity-70 transition hover:opacity-100"
        >
          Ver detalle
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </article>
  )
}

export default function RecentDrops() {
  return (
    <section className="border-b-[3px] border-negro bg-crema">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 md:px-6 md:py-24">
        <div className="flex flex-col gap-6 border-b-[3px] border-negro pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="badge-brutal bg-negro text-crema">{PRODUCTS.length} piezas</span>
            <h2 className="mt-4 font-display text-4xl uppercase leading-none tracking-tight text-negro md:text-6xl">
              Recent{' '}
              <span className="font-brush lowercase text-vino">drops</span>
            </h2>
          </div>
          <Link to="/colecciones" className="btn-brutal self-start bg-vino px-6 py-3 md:self-auto">
            Ver todo
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.map((product, index) => (
            <DropCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
