import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Minus, Plus, Shirt, ShoppingBag, Trash, X } from 'lucide-react'
import {
  FLAT_SHIPPING,
  FREE_SHIPPING_FROM,
  selectCount,
  selectShipping,
  selectSubtotal,
  selectTotal,
  useCartStore,
} from '../../store/useCartStore'
import { cn, formatPrice } from '../../lib/utils'

const SIZES = ['S', 'M', 'L', 'XL']

export default function CartDrawer() {
  const open = useCartStore((s) => s.drawerOpen)
  const close = useCartStore((s) => s.closeDrawer)
  const items = useCartStore((s) => s.items)
  const removeItem = useCartStore((s) => s.removeItem)
  const setQuantity = useCartStore((s) => s.setQuantity)
  const setSize = useCartStore((s) => s.setSize)
  const count = useCartStore(selectCount)
  const subtotal = useCartStore(selectSubtotal)
  const shipping = useCartStore(selectShipping)
  const total = useCartStore(selectTotal)
  const navigate = useNavigate()

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, close])

  const handleCheckout = () => {
    close()
    navigate('/checkout')
  }

  const handleBrowse = () => {
    close()
    navigate('/colecciones')
  }

  return (
    <>
      <div
        onClick={close}
        aria-hidden="true"
        className={cn(
          'fixed inset-0 z-[60] bg-negro/60 transition-opacity duration-300',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
        className={cn(
          'fixed right-0 top-0 z-[70] flex h-full w-full max-w-[440px] flex-col border-l-[3px] border-negro bg-crema transition-transform duration-300 ease-out',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <header className="flex items-center justify-between border-b-[3px] border-negro bg-vino px-5 py-4 text-crema">
          <h2 className="font-display text-xl uppercase tracking-tight">
            Tu carrito{' '}
            <span className="font-brush text-lg lowercase text-carmesi">({count})</span>
          </h2>
          <button
            type="button"
            onClick={close}
            aria-label="Cerrar carrito"
            className="border-[3px] border-crema bg-vino-deep p-2 transition hover:bg-carmesi active:translate-x-0.5 active:translate-y-0.5"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
            <span className="grid h-16 w-16 place-items-center border-[3px] border-negro bg-blanco shadow-brutal">
              <ShoppingBag className="h-8 w-8 text-vino" />
            </span>
            <p className="font-brush text-3xl text-vino">tu carrito está vacío</p>
            <p className="max-w-xs text-sm font-medium text-negro/60">
              El Drop 001 se está acabando. Lleva lo que sientes.
            </p>
            <button type="button" onClick={handleBrowse} className="btn-brutal bg-vino px-6">
              Ver colecciones
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
              {items.map((item) => (
                <article
                  key={`${item.id}-${item.size}`}
                  className="flex gap-3 border-[3px] border-negro bg-blanco p-3 shadow-brutal-sm"
                >
                  <div className="grid h-24 w-20 shrink-0 place-items-center border-[3px] border-negro bg-vino-deep">
                    <Shirt className="h-8 w-8 text-crema/70" />
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display text-xs uppercase leading-tight tracking-tight text-negro">
                        {item.name}
                      </h3>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id, item.size)}
                        aria-label={`Eliminar ${item.name}`}
                        className="shrink-0 text-negro/50 transition hover:text-carmesi"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <select
                        value={item.size}
                        onChange={(event) => setSize(item.id, item.size, event.target.value)}
                        aria-label={`Talla de ${item.name}`}
                        className="border-[3px] border-negro bg-crema px-2 py-1 font-heading text-[11px] font-extrabold uppercase text-negro focus:outline-none"
                      >
                        {SIZES.map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>

                      <div className="flex items-center border-[3px] border-negro bg-crema">
                        <button
                          type="button"
                          onClick={() => setQuantity(item.id, item.size, item.qty - 1)}
                          aria-label="Reducir cantidad"
                          className="grid h-8 w-8 place-items-center text-negro transition hover:bg-carmesi hover:text-blanco"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center font-heading text-xs font-extrabold text-negro">
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQuantity(item.id, item.size, item.qty + 1)}
                          aria-label="Aumentar cantidad"
                          className="grid h-8 w-8 place-items-center text-negro transition hover:bg-carmesi hover:text-blanco"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <span className="ml-auto font-heading text-sm font-extrabold text-negro">
                        {formatPrice(item.price * item.qty)}
                      </span>
                    </div>
                  </div>
                </article>
              ))}

              {subtotal < FREE_SHIPPING_FROM ? (
                <p className="border-[3px] border-negro bg-carmesi px-3 py-2 font-heading text-[11px] font-extrabold uppercase tracking-wide text-blanco shadow-brutal-sm">
                  Te faltan {formatPrice(FREE_SHIPPING_FROM - subtotal)} para envío gratis
                </p>
              ) : (
                <p className="border-[3px] border-negro bg-negro px-3 py-2 font-heading text-[11px] font-extrabold uppercase tracking-wide text-crema shadow-brutal-sm">
                  ¡Envío gratis desbloqueado!
                </p>
              )}
            </div>

            <footer className="border-t-[3px] border-negro bg-crema px-5 py-5">
              <dl className="space-y-2 text-sm font-semibold text-negro/80">
                <div className="flex justify-between">
                  <dt>Subtotal</dt>
                  <dd>{formatPrice(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Envío</dt>
                  <dd>{shipping === 0 ? 'Gratis' : formatPrice(FLAT_SHIPPING)}</dd>
                </div>
                <div className="flex justify-between border-t-[3px] border-negro pt-2 font-heading text-lg font-extrabold text-negro">
                  <dt>Total</dt>
                  <dd>{formatPrice(total)}</dd>
                </div>
              </dl>

              <button
                type="button"
                onClick={handleCheckout}
                className="btn-brutal mt-4 w-full py-4 text-sm"
              >
                Proceder al Pago
              </button>

              <Link
                to="/colecciones"
                onClick={close}
                className="mt-3 block text-center font-heading text-[11px] font-extrabold uppercase tracking-[0.14em] text-negro/60 underline-offset-4 hover:text-vino hover:underline"
              >
                Seguir comprando
              </Link>
            </footer>
          </>
        )}
      </aside>
    </>
  )
}
