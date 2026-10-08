import { useMemo, useState } from 'react'
import MosaicRevealGrid, { type MosaicItem } from '../components/collections/MosaicRevealGrid'
import { PRODUCTS, type Product } from '../data/products'
import { cn } from '../lib/utils'

type Category = 'Streetwear' | 'Hoodies' | 'Accesorios'

const CATEGORIES: Record<string, Category> = {
  'the-feeling-hoodie': 'Hoodies',
  'emotion-tee': 'Streetwear',
  'passion-bomber-jacket': 'Streetwear',
  'raw-statement-pants': 'Streetwear',
}

const FILTERS = ['TODO', 'STREETWEAR', 'HOODIES', 'DROPS LIMITADOS', 'ACCESORIOS'] as const

const isLimited = (product: Product) => /LIMITADA|PIEZAS/i.test(product.badge ?? '')

const buildItems = (filter: string): MosaicItem[] => {
  const filtered = PRODUCTS.filter((product) => {
    if (filter === 'TODO') return true
    if (filter === 'DROPS LIMITADOS') return isLimited(product)
    return CATEGORIES[product.id] === filter
  })

  const items: MosaicItem[] = []
  filtered.forEach((product) => {
    items.push({ kind: 'product', id: product.id, product })
    items.push({ kind: 'look', id: `${product.id}-look`, product })
  })
  return items
}

export default function CollectionsPage() {
  const [filter, setFilter] = useState<string>('TODO')
  const items = useMemo(() => buildItems(filter), [filter])
  const productCount = items.filter((item) => item.kind === 'product').length

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 md:px-6 md:py-24">
      <div className="flex flex-col gap-6 border-b-[3px] border-negro pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="badge-brutal bg-negro text-crema">
            {productCount} {productCount === 1 ? 'pieza' : 'piezas'}
          </span>
          <h1 className="mt-4 font-display text-5xl uppercase leading-none tracking-tight text-negro md:text-7xl">
            Colecciones
          </h1>
          <p className="mt-4 max-w-xl text-base font-medium text-negro/70">
            Grilla editorial con cortinillas de revelado. Filtra por categoría y descubre las
            piezas del Drop 001.
          </p>
        </div>
        <p className="font-brush text-3xl text-vino md:text-4xl">pick your feel</p>
      </div>

      <div className="mt-10 flex flex-wrap gap-3" role="group" aria-label="Filtros de colección">
        {FILTERS.map((option) => {
          const active = filter === option
          return (
            <button
              key={option}
              type="button"
              onClick={() => setFilter(option)}
              aria-pressed={active}
              className={cn(
                'border-[3px] border-negro px-5 py-3 font-heading text-xs font-extrabold uppercase tracking-[0.14em] shadow-brutal transition-all duration-100',
                active
                  ? 'translate-x-1 translate-y-1 bg-negro text-crema shadow-none'
                  : 'bg-blanco text-negro hover:bg-crema active:translate-x-1 active:translate-y-1 active:shadow-none',
              )}
            >
              {option}
            </button>
          )
        })}
      </div>

      <div className="mt-10">
        {items.length > 0 ? (
          <MosaicRevealGrid items={items} />
        ) : (
          <div className="border-[3px] border-negro bg-blanco p-10 text-center shadow-brutal">
            <p className="font-brush text-3xl text-vino">aún no hay nada aquí</p>
            <p className="mt-2 text-sm font-medium text-negro/60">
              El filtro «{filter}» no tiene piezas en el Drop 001 — sigue explorando.
            </p>
            <button
              type="button"
              onClick={() => setFilter('TODO')}
              className="btn-brutal mt-5 bg-vino"
            >
              Ver todo
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
