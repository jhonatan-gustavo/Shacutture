import { Link } from 'react-router-dom'
import { ArrowRight, Flame, Shirt } from 'lucide-react'
import { cn, formatPrice } from '../../lib/utils'

type DropTheme = 'white' | 'black' | 'wine'

type Drop = {
  n: string
  name: string
  category: string
  price: number
  badge: string | null
  theme: DropTheme
  icon: typeof Shirt
}

const DROPS: Drop[] = [
  {
    n: '01',
    name: 'Playera VOID Oversize',
    category: 'Streetwear',
    price: 749,
    badge: 'NUEVO',
    theme: 'white',
    icon: Shirt,
  },
  {
    n: '02',
    name: 'Hoodie BORGIA Heavy',
    category: 'Hoodies',
    price: 1299,
    badge: 'NUEVO',
    theme: 'black',
    icon: Flame,
  },
  {
    n: '03',
    name: 'Sudadera CARMESÍ 450g',
    category: 'Hoodies',
    price: 1199,
    badge: null,
    theme: 'wine',
    icon: Shirt,
  },
  {
    n: '04',
    name: 'Gorra SHAC Rutera',
    category: 'Accesorios',
    price: 499,
    badge: null,
    theme: 'black',
    icon: Flame,
  },
  {
    n: '05',
    name: 'Cargo TACTIC Wide',
    category: 'Streetwear',
    price: 1499,
    badge: 'NUEVO',
    theme: 'wine',
    icon: Shirt,
  },
  {
    n: '06',
    name: 'Tote MANIFIESTO',
    category: 'Accesorios',
    price: 399,
    badge: null,
    theme: 'white',
    icon: Flame,
  },
]

const THEMES: Record<
  DropTheme,
  { card: string; thumb: string; divider: string; number: string }
> = {
  white: {
    card: 'bg-blanco text-negro',
    thumb: 'bg-crema text-vino',
    divider: 'border-b-[3px] border-negro',
    number: 'text-vino/20',
  },
  black: {
    card: 'bg-negro text-crema',
    thumb: 'bg-[#1A1A1A] text-carmesi',
    divider: 'border-b-[3px] border-crema/25',
    number: 'text-carmesi/25',
  },
  wine: {
    card: 'bg-vino text-crema',
    thumb: 'bg-vino-deep text-crema',
    divider: 'border-b-[3px] border-crema/25',
    number: 'text-crema/15',
  },
}

export default function RecentDrops() {
  return (
    <section className="border-b-[3px] border-negro bg-crema">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 md:px-6 md:py-24">
        <div className="flex flex-col gap-6 border-b-[3px] border-negro pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="badge-brutal bg-negro text-crema">06 piezas</span>
            <h2 className="mt-4 font-display text-4xl uppercase leading-none tracking-tight text-negro md:text-6xl">
              Recent{' '}
              <span className="font-brush lowercase text-vino">drops</span>
            </h2>
          </div>
          <Link
            to="/colecciones"
            className="btn-brutal self-start bg-vino px-6 py-3 md:self-auto"
          >
            Ver todo
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {DROPS.map((drop) => {
            const theme = THEMES[drop.theme]
            const Icon = drop.icon

            return (
              <article
                key={drop.n}
                className={cn(
                  'card-brutal group flex flex-col transition-transform duration-200 hover:-translate-x-1 hover:-translate-y-1',
                  theme.card,
                )}
              >
                <div
                  className={cn(
                    'relative flex h-52 items-center justify-center overflow-hidden',
                    theme.thumb,
                    theme.divider,
                  )}
                >
                  <span
                    className={cn(
                      'font-display text-[7rem] leading-none tracking-tighter',
                      theme.number,
                    )}
                  >
                    {drop.n}
                  </span>
                  <Icon className="absolute bottom-4 right-4 h-8 w-8 opacity-60" />
                  {drop.badge ? (
                    <span className="badge-brutal absolute left-3 top-3 bg-carmesi text-blanco">
                      {drop.badge}
                    </span>
                  ) : null}
                </div>

                <div className="flex flex-1 flex-col gap-2 p-5">
                  <span className="font-heading text-[11px] font-extrabold uppercase tracking-[0.18em] opacity-60">
                    {drop.category}
                  </span>
                  <h3 className="font-display text-lg uppercase leading-tight tracking-tight">
                    {drop.name}
                  </h3>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <span className="font-heading text-lg font-extrabold">
                      {formatPrice(drop.price)}
                    </span>
                    <Link
                      to="/colecciones"
                      className={cn(
                        'btn-brutal px-4 py-2 text-[11px]',
                        drop.theme === 'white' && 'bg-vino',
                      )}
                    >
                      Ver pieza
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
