import { useMemo, useState } from 'react'
import MosaicRevealGrid, {
  type MosaicItem,
  type MosaicLook,
} from '../components/collections/MosaicRevealGrid'
import { cn } from '../lib/utils'

type Product = {
  id: string
  n: string
  name: string
  category: 'Streetwear' | 'Hoodies' | 'Accesorios'
  price: number
  limited: boolean
  soldOut: boolean
  isNew: boolean
}

const PRODUCTS: Product[] = [
  { id: 'void-tee', n: '01', name: 'Playera VOID Oversize', category: 'Streetwear', price: 749, limited: false, soldOut: false, isNew: true },
  { id: 'borgia-hoodie', n: '02', name: 'Hoodie BORGIA Heavy', category: 'Hoodies', price: 1299, limited: true, soldOut: false, isNew: true },
  { id: 'carmesi-suda', n: '03', name: 'Sudadera CARMESÍ 450g', category: 'Hoodies', price: 1199, limited: false, soldOut: false, isNew: false },
  { id: 'tactic-cargo', n: '04', name: 'Cargo TACTIC Wide', category: 'Streetwear', price: 1499, limited: true, soldOut: false, isNew: true },
  { id: 'shac-gorra', n: '05', name: 'Gorra SHAC Rutera', category: 'Accesorios', price: 499, limited: false, soldOut: false, isNew: false },
  { id: 'manifiesto-tee', n: '06', name: 'Camiseta MANIFIESTO Print', category: 'Streetwear', price: 649, limited: false, soldOut: true, isNew: false },
  { id: 'null-hoodie', n: '07', name: 'Hoodie NULL Zen', category: 'Hoodies', price: 1399, limited: false, soldOut: false, isNew: false },
  { id: 'manifiesto-tote', n: '08', name: 'Tote MANIFIESTO', category: 'Accesorios', price: 399, limited: true, soldOut: false, isNew: false },
  { id: 'utility-vest', n: '09', name: 'Chaleco UTILITY Vest', category: 'Streetwear', price: 1899, limited: true, soldOut: true, isNew: false },
]

const LOOKS: MosaicLook[] = [
  { id: 'look-01', label: 'Editorial 01 — CDMX Streets', headline: 'Night', brush: 'shift', theme: 'wine' },
  { id: 'look-02', label: 'Editorial 02 — Studio Raw', headline: 'Raw', brush: 'cut', theme: 'ink' },
  { id: 'look-03', label: 'Editorial 03 — Drop 001', headline: 'Wear', brush: 'it loud', theme: 'red' },
]

const FILTERS = ['TODO', 'STREETWEAR', 'HOODIES', 'DROPS LIMITADOS', 'ACCESORIOS'] as const

const buildItems = (filter: string): MosaicItem[] => {
  const filtered = PRODUCTS.filter((product) => {
    if (filter === 'TODO') return true
    if (filter === 'DROPS LIMITADOS') return product.limited
    return product.category.toUpperCase() === filter
  })

  const items: MosaicItem[] = []
  let lookIndex = 0

  filtered.forEach((product, index) => {
    items.push({ kind: 'product', ...product })
    if ((index + 1) % 3 === 0 && lookIndex < LOOKS.length) {
      items.push({ kind: 'look', ...LOOKS[lookIndex] })
      lookIndex += 1
    }
  })

  while (lookIndex < LOOKS.length) {
    items.push({ kind: 'look', ...LOOKS[lookIndex] })
    lookIndex += 1
  }

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
        <MosaicRevealGrid items={items} />
      </div>
    </section>
  )
}
