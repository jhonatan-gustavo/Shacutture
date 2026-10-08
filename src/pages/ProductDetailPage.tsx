import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, ChevronDown, Plus, Truck } from 'lucide-react'
import { PRODUCTS, type Product } from '../data/products'
import { useCartStore } from '../store/useCartStore'
import { cn, formatPrice } from '../lib/utils'

type ImageKey = keyof Product['images']
type PanelKey = 'fabric' | 'care'

const GALLERY: { key: ImageKey; label: string }[] = [
  { key: 'front', label: 'Frontal' },
  { key: 'back', label: 'Posterior' },
  { key: 'detail', label: 'Detalle' },
  { key: 'lookbook', label: 'Lookbook' },
]

function ProductDetailView({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem)
  const openDrawer = useCartStore((s) => s.openDrawer)
  const [active, setActive] = useState<ImageKey>('front')
  const [size, setSize] = useState(product.sizes.includes('M') ? 'M' : product.sizes[0])
  const [added, setAdded] = useState(false)
  const [panel, setPanel] = useState<PanelKey | null>('fabric')

  const handleAdd = () => {
    addItem({ id: product.id, name: product.name, price: product.price, size })
    setAdded(true)
    openDrawer()
    window.setTimeout(() => setAdded(false), 1400)
  }

  const togglePanel = (key: PanelKey) => setPanel((current) => (current === key ? null : key))

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 md:px-6 md:py-16">
      <Link
        to="/colecciones"
        className="mb-8 inline-flex items-center gap-2 font-heading text-[11px] font-extrabold uppercase tracking-[0.14em] text-negro/60 transition hover:text-vino"
      >
        <ArrowLeft className="h-4 w-4" /> Volver a colecciones
      </Link>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <div className="card-brutal aspect-[4/5] overflow-hidden bg-crema">
            <img
              src={product.images[active]}
              alt={`${product.name} — vista ${GALLERY.find((g) => g.key === active)?.label ?? ''}`}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="grid grid-cols-4 gap-3">
            {GALLERY.map((shot) => (
              <button
                key={shot.key}
                type="button"
                onClick={() => setActive(shot.key)}
                aria-label={`Ver vista ${shot.label}`}
                aria-pressed={active === shot.key}
                className={cn(
                  'aspect-square overflow-hidden border-[3px] transition-all duration-150',
                  active === shot.key
                    ? 'border-carmesi shadow-brutal'
                    : 'border-negro opacity-60 hover:opacity-100',
                )}
              >
                <img
                  src={product.images[shot.key]}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              {product.badge ? (
                <span className="badge-brutal bg-carmesi text-blanco">{product.badge}</span>
              ) : null}
              <span className="badge-brutal bg-crema">Drop 001</span>
            </div>
            <h1 className="mt-4 font-display text-3xl uppercase leading-none tracking-tight text-negro md:text-5xl">
              {product.name}
            </h1>
            <p className="mt-3 font-heading text-xs font-extrabold uppercase tracking-[0.16em] text-negro/60">
              {product.subtitle}
            </p>
            <p className="mt-4 font-display text-3xl text-vino">{formatPrice(product.price)}</p>
          </div>

          <div>
            <span className="font-heading text-[11px] font-extrabold uppercase tracking-[0.18em] text-negro">
              Talla
            </span>
            <div className="mt-2 flex flex-wrap gap-2">
              {(['S', 'M', 'L', 'XL'] as const)
                .filter((option) => product.sizes.includes(option))
                .map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setSize(option)}
                    aria-pressed={size === option}
                    className={cn(
                      'min-w-[52px] border-[3px] border-negro px-4 py-2.5 font-heading text-xs font-extrabold transition-all duration-100',
                      size === option
                        ? 'translate-x-0.5 translate-y-0.5 bg-negro text-crema shadow-none'
                        : 'bg-blanco text-negro shadow-brutal-sm hover:bg-crema active:translate-x-0.5 active:translate-y-0.5 active:shadow-none',
                    )}
                  >
                    {option}
                  </button>
                ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className={cn('btn-brutal w-full py-4 text-sm', added && 'bg-negro')}
          >
            {added ? (
              <>
                <Check className="h-4 w-4" />
                Añadido al carrito
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Comprar — talla {size}
              </>
            )}
          </button>

          <p className="flex items-center gap-2 text-xs font-semibold text-negro/60">
            <Truck className="h-4 w-4 shrink-0 text-carmesi" />
            Envío gratis desde $999 · entrega estimada 3–5 días
          </p>

          <div className="border-[3px] border-negro bg-negro p-6 text-crema shadow-brutal">
            <h2 className="font-heading text-[11px] font-extrabold uppercase tracking-[0.2em] text-carmesi">
              Por qué existe esta pieza
            </h2>
            <p className="mt-3 font-brush text-2xl leading-snug text-crema md:text-3xl">
              «{product.story.quote}»
            </p>
            <p className="mt-4 text-sm font-medium leading-relaxed text-crema/75">
              {product.story.concept}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="font-heading text-[11px] font-extrabold uppercase tracking-[0.2em] text-negro">
              Fabricación y cuidados
            </h2>

            <div>
              <button
                type="button"
                onClick={() => togglePanel('fabric')}
                aria-expanded={panel === 'fabric'}
                className={cn(
                  'flex w-full items-center justify-between border-[3px] border-negro px-4 py-3 font-heading text-xs font-extrabold uppercase tracking-[0.14em] transition-all duration-100',
                  panel === 'fabric'
                    ? 'translate-x-0.5 translate-y-0.5 bg-negro text-crema shadow-none'
                    : 'bg-blanco text-negro shadow-brutal-sm hover:bg-crema',
                )}
              >
                Fabricación
                <ChevronDown
                  className={cn('h-4 w-4 transition-transform duration-200', panel === 'fabric' && 'rotate-180')}
                />
              </button>
              {panel === 'fabric' ? (
                <div className="space-y-3 border-x-[3px] border-b-[3px] border-negro bg-crema p-4">
                  <p className="text-sm font-semibold text-negro">
                    <span className="font-heading text-[10px] font-extrabold uppercase tracking-[0.18em] text-negro/50">
                      Tejido
                    </span>
                    <br />
                    {product.manufacturing.fabric}
                  </p>
                  <p className="text-sm font-semibold text-negro">
                    <span className="font-heading text-[10px] font-extrabold uppercase tracking-[0.18em] text-negro/50">
                      Fit
                    </span>
                    <br />
                    {product.manufacturing.fit}
                  </p>
                  <ul className="space-y-1.5">
                    {product.manufacturing.craftDetails.map((detail) => (
                      <li key={detail} className="flex items-start gap-2 text-sm font-medium text-negro">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-carmesi" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            <div>
              <button
                type="button"
                onClick={() => togglePanel('care')}
                aria-expanded={panel === 'care'}
                className={cn(
                  'flex w-full items-center justify-between border-[3px] border-negro px-4 py-3 font-heading text-xs font-extrabold uppercase tracking-[0.14em] transition-all duration-100',
                  panel === 'care'
                    ? 'translate-x-0.5 translate-y-0.5 bg-negro text-crema shadow-none'
                    : 'bg-blanco text-negro shadow-brutal-sm hover:bg-crema',
                )}
              >
                Cuidados
                <ChevronDown
                  className={cn('h-4 w-4 transition-transform duration-200', panel === 'care' && 'rotate-180')}
                />
              </button>
              {panel === 'care' ? (
                <div className="border-x-[3px] border-b-[3px] border-negro bg-crema p-4">
                  <ul className="space-y-1.5">
                    {product.manufacturing.careInstructions.map((instruction) => (
                      <li
                        key={instruction}
                        className="flex items-start gap-2 text-sm font-medium text-negro"
                      >
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-carmesi" />
                        {instruction}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>

          <Link
            to="/colecciones"
            className="btn-brutal self-start bg-vino px-6 py-3 text-xs"
          >
            Ver todas las piezas
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default function ProductDetailPage() {
  const { id } = useParams()
  const product = PRODUCTS.find((item) => item.id === id)

  if (!product) {
    return (
      <section className="mx-auto flex min-h-[60vh] w-full max-w-xl flex-col items-center justify-center gap-6 px-4 text-center md:px-6">
        <span className="badge-brutal bg-carmesi text-blanco">404</span>
        <h1 className="font-display text-4xl uppercase leading-none tracking-tight md:text-5xl">
          Pieza no encontrada
        </h1>
        <p className="text-sm font-medium text-negro/60">
          Este Drop no contiene el producto que buscas.
        </p>
        <Link to="/colecciones" className="btn-brutal bg-vino px-6 py-4">
          Ver colecciones
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    )
  }

  return <ProductDetailView product={product} />
}
