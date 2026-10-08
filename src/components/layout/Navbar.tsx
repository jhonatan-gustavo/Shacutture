import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Heart, Menu, ShoppingBag, X, type LucideIcon } from 'lucide-react'
import { cn } from '../../lib/utils'
import { logoUrl } from '../../lib/assets'
import { selectCount, useCartStore } from '../../store/useCartStore'

type NavItem = {
  to: string
  label: string
  icon?: LucideIcon
}

const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Home' },
  { to: '/colecciones', label: 'Colecciones' },
  { to: '/wishlist', label: 'Wishlist', icon: Heart },
]

const CountBadge = ({ count }: { count: number }) =>
  count > 0 ? (
    <span className="absolute -right-2 -top-2 grid h-5 min-w-[20px] place-items-center border-2 border-negro bg-carmesi px-1 font-heading text-[10px] font-extrabold leading-none text-blanco">
      {count}
    </span>
  ) : null

const linkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'relative inline-flex items-center gap-1.5 border-[3px] px-3 py-1.5 font-heading text-xs font-extrabold uppercase tracking-[0.14em] transition-all duration-150',
    isActive
      ? 'border-negro bg-vino text-crema shadow-brutal-sm'
      : 'border-transparent text-negro hover:border-negro hover:bg-blanco hover:shadow-brutal-sm',
  )

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const cartCount = useCartStore(selectCount)
  const wishCount = useCartStore((s) => s.wishlist.length)
  const openDrawer = useCartStore((s) => s.openDrawer)

  return (
    <header className="sticky top-0 z-50 border-b-[3px] border-negro bg-crema shadow-[0_5px_0px_#0D0D0D]">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 md:h-20 md:px-6">
        <NavLink to="/" className="group flex items-center gap-1" aria-label="Shacutture — inicio">
          <img
            src={logoUrl}
            alt=""
            className="h-7 w-7 border-2 border-negro object-cover transition-transform duration-150 group-hover:-rotate-2 md:h-8 md:w-8"
          />
          <span className="font-display text-xl uppercase leading-none tracking-tight text-negro md:text-2xl">
            ha
          </span>
          <span className="font-brush text-xl leading-none text-vino md:text-2xl">cut</span>
          <span className="font-display text-xl uppercase leading-none tracking-tight text-negro md:text-2xl">
            ture
          </span>
        </NavLink>

        <nav className="hidden items-center gap-2 md:flex" aria-label="Navegación principal">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} className={linkClass}>
              {item.icon ? <item.icon className="h-3.5 w-3.5" /> : null}
              {item.label}
              {item.to === '/wishlist' ? <CountBadge count={wishCount} /> : null}
            </NavLink>
          ))}
          <button
            type="button"
            onClick={openDrawer}
            className="btn-brutal relative ml-2 bg-vino px-4 py-2"
            aria-label="Abrir carrito"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden lg:inline">Carrito</span>
            <CountBadge count={cartCount} />
          </button>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={openDrawer}
            className="relative border-[3px] border-negro bg-vino p-2 text-crema shadow-brutal-sm transition active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            aria-label="Abrir carrito"
          >
            <ShoppingBag className="h-5 w-5" />
            <CountBadge count={cartCount} />
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="border-[3px] border-negro bg-blanco p-2 text-negro shadow-brutal-sm transition active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <nav
          className="flex flex-col gap-3 border-t-[3px] border-negro bg-crema px-4 py-4 md:hidden"
          aria-label="Navegación móvil"
        >
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={linkClass}
              onClick={() => setMenuOpen(false)}
            >
              {item.icon ? <item.icon className="h-4 w-4" /> : null}
              {item.label}
              {item.to === '/wishlist' ? <CountBadge count={wishCount} /> : null}
            </NavLink>
          ))}
        </nav>
      ) : null}
    </header>
  )
}
