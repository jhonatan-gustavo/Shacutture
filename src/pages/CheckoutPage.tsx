import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  CreditCard,
  Landmark,
  LoaderCircle,
  Lock,
  PartyPopper,
  ShoppingBag,
  Truck,
  Wallet,
  type LucideIcon,
} from 'lucide-react'
import {
  FLAT_SHIPPING,
  FREE_SHIPPING_FROM,
  selectShipping,
  selectSubtotal,
  selectTotal,
  useCartStore,
  type CartItem,
} from '../store/useCartStore'
import { cn, formatPrice } from '../lib/utils'

type Step = 'shipping' | 'payment' | 'processing' | 'done'
type Method = 'card' | 'spei' | 'mp'

type ShippingForm = {
  name: string
  email: string
  phone: string
  address: string
  city: string
  zip: string
}

type Order = {
  id: string
  date: string
  method: string
  email: string
  address: string
  items: CartItem[]
  subtotal: number
  shipping: number
  total: number
}

const EMPTY_FORM: ShippingForm = {
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  zip: '',
}

const METHOD_LABELS: Record<Method, string> = {
  card: 'Tarjeta',
  spei: 'Transferencia / SPEI',
  mp: 'Mercado Pago',
}

const METHODS: { key: Method; label: string; icon: LucideIcon }[] = [
  { key: 'card', label: 'Tarjeta', icon: CreditCard },
  { key: 'spei', label: 'Transferencia / SPEI', icon: Landmark },
  { key: 'mp', label: 'Mercado Pago', icon: Wallet },
]

const STEPS: { key: Step; label: string }[] = [
  { key: 'shipping', label: 'Envío' },
  { key: 'payment', label: 'Pago' },
  { key: 'done', label: 'Confirmación' },
]

const onlyDigits = (value: string) => value.replace(/\D/g, '')

const groupCard = (raw: string) => raw.match(/.{1,4}/g)?.join(' ') ?? ''

const formatExpiry = (digits: string) =>
  digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2, 4)}` : digits

function Stepper({ current }: { current: Step }) {
  const activeIndex = STEPS.findIndex(
    (step) => step.key === (current === 'processing' ? 'payment' : current),
  )

  return (
    <ol className="mb-8 flex flex-wrap gap-3">
      {STEPS.map((step, index) => (
        <li
          key={step.key}
          className={cn(
            'flex items-center gap-2 border-[3px] border-negro px-4 py-2 font-heading text-[11px] font-extrabold uppercase tracking-[0.14em]',
            index <= activeIndex
              ? 'bg-negro text-crema shadow-brutal-sm'
              : 'bg-blanco text-negro/50',
          )}
        >
          <span>0{index + 1}</span>
          {step.label}
        </li>
      ))}
    </ol>
  )
}

function Field({
  label,
  error,
  className,
  ...props
}: { label: string; error?: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={cn('flex flex-col gap-1.5', className)}>
      <span className="font-heading text-[11px] font-extrabold uppercase tracking-[0.16em] text-negro">
        {label}
      </span>
      <input {...props} className={cn('input-brutal', error && 'border-carmesi')} />
      {error ? (
        <span className="font-heading text-[11px] font-bold uppercase text-carmesi">{error}</span>
      ) : null}
    </label>
  )
}

function OrderSummary({ payButton }: { payButton?: ReactNode }) {
  const items = useCartStore((s) => s.items)
  const subtotal = useCartStore(selectSubtotal)
  const shipping = useCartStore(selectShipping)
  const total = useCartStore(selectTotal)

  return (
    <aside className="card-brutal h-fit bg-crema p-6">
      <h2 className="font-display text-lg uppercase tracking-tight text-negro">Resumen</h2>

      <ul className="mt-4 space-y-3 border-b-[3px] border-negro pb-4">
        {items.map((item) => (
          <li
            key={`${item.id}-${item.size}`}
            className="flex items-start justify-between gap-3 text-sm"
          >
            <div>
              <p className="font-heading text-xs font-extrabold uppercase text-negro">
                {item.name}
              </p>
              <p className="font-heading text-[11px] font-bold uppercase text-negro/50">
                Talla {item.size} × {item.qty}
              </p>
            </div>
            <span className="font-heading text-sm font-extrabold text-negro">
              {formatPrice(item.price * item.qty)}
            </span>
          </li>
        ))}
      </ul>

      <dl className="mt-4 space-y-2 text-sm font-semibold text-negro/80">
        <div className="flex justify-between">
          <dt>Subtotal</dt>
          <dd>{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="flex items-center gap-1.5">
            <Truck className="h-3.5 w-3.5" /> Envío
          </dt>
          <dd>{shipping === 0 ? 'Gratis' : formatPrice(FLAT_SHIPPING)}</dd>
        </div>
        <div className="flex justify-between border-t-[3px] border-negro pt-2 font-heading text-lg font-extrabold text-negro">
          <dt>Total</dt>
          <dd>{formatPrice(total)}</dd>
        </div>
      </dl>

      {subtotal < FREE_SHIPPING_FROM ? (
        <p className="mt-3 font-heading text-[10px] font-extrabold uppercase tracking-wide text-carmesi">
          Envío gratis desde {formatPrice(FREE_SHIPPING_FROM)}
        </p>
      ) : null}

      {payButton}
    </aside>
  )
}

function CardPlastic({
  number,
  name,
  expiry,
  cvv,
  flipped,
}: {
  number: string
  name: string
  expiry: string
  cvv: string
  flipped: boolean
}) {
  const digitCount = onlyDigits(number).length
  const numberLine = groupCard(number + '•'.repeat(16 - digitCount))

  return (
    <div className="relative h-44 w-full [perspective:1000px] md:h-48">
      <div
        className={cn(
          'relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d]',
          flipped && '[transform:rotateY(180deg)]',
        )}
      >
        <div className="absolute inset-0 flex flex-col justify-between border-[3px] border-negro bg-vino p-5 text-crema shadow-brutal-xl [backface-visibility:hidden]">
          <div className="flex items-start justify-between">
            <span className="font-display text-xs uppercase tracking-widest">Shacutture Pay</span>
            <span className="h-7 w-10 border-2 border-negro bg-[#F0C75E]" aria-hidden="true" />
          </div>
          <p className="font-heading text-lg font-bold tracking-[0.16em] md:text-xl">{numberLine}</p>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="font-heading text-[9px] font-extrabold uppercase tracking-[0.2em] text-crema/60">
                Titular
              </p>
              <p className="font-heading text-xs font-extrabold uppercase tracking-widest">
                {name || 'Tu nombre'}
              </p>
            </div>
            <div className="text-right">
              <p className="font-heading text-[9px] font-extrabold uppercase tracking-[0.2em] text-crema/60">
                Vence
              </p>
              <p className="font-heading text-xs font-extrabold tracking-widest">
                {expiry || 'MM/AA'}
              </p>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 flex flex-col justify-between border-[3px] border-negro bg-vino-deep p-5 text-crema shadow-brutal-xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div className="-mx-5 mt-1 h-12 border-y-2 border-negro bg-negro" />
          <div className="flex items-center justify-end gap-3">
            <span className="font-heading text-[9px] font-extrabold uppercase tracking-[0.2em] text-crema/60">
              CVV
            </span>
            <span className="min-w-[70px] border-2 border-negro bg-crema px-3 py-1.5 text-center font-heading text-sm font-extrabold tracking-[0.3em] text-negro">
              {cvv || '•••'}
            </span>
          </div>
          <p className="font-heading text-[9px] font-extrabold uppercase tracking-[0.2em] text-crema/60">
            Shacutture — The Art of Wearing What You Feel
          </p>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items)
  const total = useCartStore(selectTotal)

  const [step, setStep] = useState<Step>('shipping')
  const [method, setMethod] = useState<Method>('card')

  const [form, setForm] = useState<ShippingForm>(EMPTY_FORM)
  const [errors, setErrors] = useState<Partial<Record<keyof ShippingForm, string>>>({})

  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' })
  const [cardErrors, setCardErrors] = useState<Record<string, string>>({})
  const [flipped, setFlipped] = useState(false)

  const [copied, setCopied] = useState<string | null>(null)
  const [speiRef] = useState(
    () => `SHC-${Math.floor(100000 + Math.random() * 900000)}`,
  )
  const [order, setOrder] = useState<Order | null>(null)

  useEffect(() => {
    if (step !== 'processing') return

    const timer = window.setTimeout(() => {
      const state = useCartStore.getState()
      const subtotal = state.items.reduce((sum, item) => sum + item.price * item.qty, 0)
      const shipping =
        subtotal === 0 || subtotal >= FREE_SHIPPING_FROM ? 0 : FLAT_SHIPPING

      setOrder({
        id: `SHC-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toLocaleString('es-MX', { dateStyle: 'long', timeStyle: 'short' }),
        method: METHOD_LABELS[method],
        email: form.email,
        address: `${form.address}, ${form.city}, C.P. ${form.zip}`,
        items: state.items,
        subtotal,
        shipping,
        total: subtotal + shipping,
      })
      state.clearCart()
      setStep('done')
    }, 2000)

    return () => window.clearTimeout(timer)
  }, [step, method, form.email, form.address, form.city, form.zip])

  const setField = (key: keyof ShippingForm) => (event: ChangeEvent<HTMLInputElement>) =>
    setForm((current) => ({ ...current, [key]: event.target.value }))

  const validateShipping = () => {
    const next: Partial<Record<keyof ShippingForm, string>> = {}
    if (!form.name.trim()) next.name = 'Escribe tu nombre completo'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Email inválido'
    if (onlyDigits(form.phone).length < 10) next.phone = 'Mínimo 10 dígitos'
    if (!form.address.trim()) next.address = 'Calle y número requeridos'
    if (!form.city.trim()) next.city = 'Ciudad requerida'
    if (!/^\d{5}$/.test(form.zip.trim())) next.zip = 'Código postal de 5 dígitos'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleShippingSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (validateShipping()) setStep('payment')
  }

  const validateCard = () => {
    const next: Record<string, string> = {}
    if (onlyDigits(card.number).length !== 16) next.number = 'Tarjeta de 16 dígitos'
    if (!card.name.trim()) next.name = 'Nombre del titular requerido'
    const expiryMatch = /^(\d{2})\/(\d{2})$/.test(card.expiry)
    if (!expiryMatch || Number(card.expiry.slice(0, 2)) < 1 || Number(card.expiry.slice(0, 2)) > 12)
      next.expiry = 'Fecha MM/AA válida'
    if (!/^\d{3}$/.test(card.cvv)) next.cvv = 'CVV de 3 dígitos'
    setCardErrors(next)
    return Object.keys(next).length === 0
  }

  const handlePay = () => {
    if (method === 'card' && !validateCard()) return
    setStep('processing')
  }

  const handleCopy = (value: string, key: string) => {
    navigator.clipboard?.writeText(value)
    setCopied(key)
    window.setTimeout(() => setCopied(null), 1200)
  }

  if (step === 'processing') {
    return (
      <section className="mx-auto flex min-h-[70vh] w-full max-w-xl flex-col items-center justify-center gap-6 px-4 text-center md:px-6">
        <LoaderCircle className="h-14 w-14 animate-spin text-carmesi" />
        <h1 className="font-display text-3xl uppercase leading-none tracking-tight md:text-5xl">
          Procesando pago...
        </h1>
        <p className="flex items-center gap-2 text-sm font-semibold text-negro/60">
          <Lock className="h-4 w-4" /> Conexión segura simulada — no se realizan cargos reales
        </p>
        <div className="h-4 w-64 overflow-hidden border-[3px] border-negro bg-crema">
          <div className="h-full w-full animate-pulse bg-carmesi" />
        </div>
      </section>
    )
  }

  if (step === 'done' && order) {
    return (
      <section className="mx-auto w-full max-w-2xl px-4 py-16 md:px-6 md:py-24">
        <div className="card-brutal overflow-hidden bg-blanco">
          <header className="flex items-center justify-between gap-4 border-b-[3px] border-negro bg-negro px-6 py-5 text-crema">
            <div className="flex items-center gap-3">
              <PartyPopper className="h-7 w-7 text-carmesi" />
              <h1 className="font-display text-xl uppercase tracking-tight md:text-2xl">
                Pedido confirmado
              </h1>
            </div>
            <Check className="h-8 w-8 text-carmesi" />
          </header>

          <div className="p-6 md:p-8">
            <div className="flex flex-col gap-4 border-b-[3px] border-negro pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-heading text-[11px] font-extrabold uppercase tracking-[0.2em] text-negro/50">
                  Número de pedido
                </p>
                <p className="font-display text-3xl tracking-tight text-vino md:text-4xl">
                  {order.id}
                </p>
              </div>
              <div className="text-left sm:text-right">
                <p className="font-heading text-[11px] font-extrabold uppercase tracking-[0.2em] text-negro/50">
                  Fecha
                </p>
                <p className="text-sm font-semibold text-negro">{order.date}</p>
              </div>
            </div>

            <ul className="mt-6 space-y-3">
              {order.items.map((item) => (
                <li
                  key={`${item.id}-${item.size}`}
                  className="flex items-start justify-between gap-3 border-b border-negro/15 pb-3 text-sm"
                >
                  <div>
                    <p className="font-heading text-xs font-extrabold uppercase text-negro">
                      {item.name}
                    </p>
                    <p className="font-heading text-[11px] font-bold uppercase text-negro/50">
                      Talla {item.size} × {item.qty}
                    </p>
                  </div>
                  <span className="font-heading text-sm font-extrabold text-negro">
                    {formatPrice(item.price * item.qty)}
                  </span>
                </li>
              ))}
            </ul>

            <dl className="mt-6 space-y-2 text-sm font-semibold text-negro/80">
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd>{formatPrice(order.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Envío</dt>
                <dd>{order.shipping === 0 ? 'Gratis' : formatPrice(order.shipping)}</dd>
              </div>
              <div className="flex justify-between border-t-[3px] border-negro pt-2 font-heading text-lg font-extrabold text-negro">
                <dt>Total</dt>
                <dd>{formatPrice(order.total)}</dd>
              </div>
            </dl>

            <div className="mt-6 grid gap-3 border-[3px] border-negro bg-crema p-4 text-sm font-semibold text-negro/80 sm:grid-cols-2">
              <div>
                <p className="font-heading text-[10px] font-extrabold uppercase tracking-[0.18em] text-negro/50">
                  Método de pago
                </p>
                <p className="font-heading text-xs font-extrabold uppercase text-negro">
                  {order.method}
                </p>
              </div>
              <div>
                <p className="font-heading text-[10px] font-extrabold uppercase tracking-[0.18em] text-negro/50">
                  Enviado a
                </p>
                <p className="font-heading text-xs font-extrabold uppercase text-negro">
                  {order.address}
                </p>
              </div>
            </div>

            <p className="mt-4 font-brush text-xl text-vino">
              Confirmación enviada a {order.email}
            </p>

            <Link to="/" className="btn-brutal mt-6 w-full py-4 text-sm">
              Volver al inicio
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    )
  }

  if (items.length === 0) {
    return (
      <section className="mx-auto flex min-h-[60vh] w-full max-w-xl flex-col items-center justify-center gap-6 px-4 text-center md:px-6">
        <span className="grid h-16 w-16 place-items-center border-[3px] border-negro bg-crema shadow-brutal">
          <ShoppingBag className="h-8 w-8 text-vino" />
        </span>
        <span className="badge-brutal bg-carmesi text-blanco">Carrito vacío</span>
        <h1 className="font-display text-4xl uppercase leading-none tracking-tight md:text-5xl">
          Nada que pagar
        </h1>
        <p className="text-sm font-medium text-negro/60">
          Agrega piezas del Drop 001 antes de pasar al checkout.
        </p>
        <Link to="/colecciones" className="btn-brutal bg-vino px-6 py-4">
          Explorar colecciones
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    )
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16 md:px-6 md:py-20">
      <div className="mb-8 flex items-end justify-between gap-4 border-b-[3px] border-negro pb-6">
        <div>
          <span className="badge-brutal bg-negro text-crema">Checkout</span>
          <h1 className="mt-3 font-display text-4xl uppercase leading-none tracking-tight md:text-6xl">
            Finaliza tu <span className="font-brush lowercase text-vino">pedido</span>
          </h1>
        </div>
        <span className="hidden items-center gap-2 font-heading text-[11px] font-extrabold uppercase text-negro/60 md:flex">
          <Lock className="h-4 w-4" /> Pago simulado
        </span>
      </div>

      <Stepper current={step} />

      {step === 'shipping' ? (
        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <form onSubmit={handleShippingSubmit} noValidate className="card-brutal space-y-5 bg-blanco p-6">
            <h2 className="font-display text-xl uppercase tracking-tight">Datos de envío</h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Nombre completo"
                className="sm:col-span-2"
                placeholder="Nombre y apellido"
                autoComplete="name"
                value={form.name}
                onChange={setField('name')}
                error={errors.name}
              />
              <Field
                label="Email"
                type="email"
                placeholder="tu@email.com"
                autoComplete="email"
                value={form.email}
                onChange={setField('email')}
                error={errors.email}
              />
              <Field
                label="Teléfono"
                type="tel"
                placeholder="55 1234 5678"
                autoComplete="tel"
                value={form.phone}
                onChange={setField('phone')}
                error={errors.phone}
              />
              <Field
                label="Calle y número"
                className="sm:col-span-2"
                placeholder="Av. Revolución 123, int. 4"
                autoComplete="street-address"
                value={form.address}
                onChange={setField('address')}
                error={errors.address}
              />
              <Field
                label="Ciudad"
                placeholder="Ciudad de México"
                autoComplete="address-level2"
                value={form.city}
                onChange={setField('city')}
                error={errors.city}
              />
              <Field
                label="Código postal"
                inputMode="numeric"
                placeholder="06600"
                autoComplete="postal-code"
                value={form.zip}
                onChange={setField('zip')}
                error={errors.zip}
              />
            </div>

            <button type="submit" className="btn-brutal w-full py-4 text-sm sm:w-auto sm:px-8">
              Continuar al pago
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <OrderSummary />
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div className="card-brutal space-y-6 bg-blanco p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-xl uppercase tracking-tight">Método de pago</h2>
              <button
                type="button"
                onClick={() => setStep('shipping')}
                className="flex items-center gap-1.5 font-heading text-[11px] font-extrabold uppercase tracking-[0.14em] text-negro/60 transition hover:text-vino"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Volver a envío
              </button>
            </div>

            <div className="flex flex-wrap gap-3" role="tablist" aria-label="Métodos de pago">
              {METHODS.map((option) => {
                const active = method === option.key
                const Icon = option.icon
                return (
                  <button
                    key={option.key}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setMethod(option.key)}
                    className={cn(
                      'flex items-center gap-2 border-[3px] border-negro px-4 py-2.5 font-heading text-[11px] font-extrabold uppercase tracking-[0.14em] shadow-brutal transition-all duration-100',
                      active
                        ? 'translate-x-1 translate-y-1 bg-negro text-crema shadow-none'
                        : 'bg-crema text-negro hover:bg-blanco active:translate-x-1 active:translate-y-1 active:shadow-none',
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {option.label}
                  </button>
                )
              })}
            </div>

            {method === 'card' ? (
              <div className="space-y-5">
                <CardPlastic
                  number={card.number}
                  name={card.name}
                  expiry={card.expiry}
                  cvv={card.cvv}
                  flipped={flipped}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Número de tarjeta"
                    className="sm:col-span-2"
                    inputMode="numeric"
                    placeholder="0000 0000 0000 0000"
                    value={groupCard(card.number)}
                    onChange={(event) =>
                      setCard((c) => ({
                        ...c,
                        number: onlyDigits(event.target.value).slice(0, 16),
                      }))
                    }
                    error={cardErrors.number}
                  />
                  <Field
                    label="Titular"
                    className="sm:col-span-2"
                    placeholder="Como aparece en la tarjeta"
                    value={card.name}
                    onChange={(event) => setCard((c) => ({ ...c, name: event.target.value }))}
                    error={cardErrors.name}
                  />
                  <Field
                    label="Vencimiento"
                    inputMode="numeric"
                    placeholder="MM/AA"
                    value={formatExpiry(card.expiry)}
                    onChange={(event) =>
                      setCard((c) => ({
                        ...c,
                        expiry: onlyDigits(event.target.value).slice(0, 4),
                      }))
                    }
                    error={cardErrors.expiry}
                  />
                  <Field
                    label="CVV"
                    inputMode="numeric"
                    placeholder="123"
                    value={card.cvv}
                    onFocus={() => setFlipped(true)}
                    onBlur={() => setFlipped(false)}
                    onChange={(event) =>
                      setCard((c) => ({ ...c, cvv: onlyDigits(event.target.value).slice(0, 3) }))
                    }
                    error={cardErrors.cvv}
                  />
                </div>
              </div>
            ) : null}

            {method === 'spei' ? (
              <div className="space-y-4">
                <div className="border-[3px] border-negro bg-crema p-4">
                  <p className="font-heading text-[11px] font-extrabold uppercase tracking-[0.18em] text-negro/50">
                    CLABE interbancaria (mock)
                  </p>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <span className="font-heading text-sm font-extrabold tracking-[0.12em] text-negro">
                      012 345 678 901 234 567
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy('012345678901234567', 'clabe')}
                      aria-label="Copiar CLABE"
                      className="border-[3px] border-negro bg-blanco p-2 shadow-brutal-sm transition active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                    >
                      {copied === 'clabe' ? (
                        <Check className="h-4 w-4 text-carmesi" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="border-[3px] border-negro bg-crema p-4">
                  <p className="font-heading text-[11px] font-extrabold uppercase tracking-[0.18em] text-negro/50">
                    Referencia de pago
                  </p>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <span className="font-display text-xl tracking-tight text-vino">{speiRef}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(speiRef, 'ref')}
                      aria-label="Copiar referencia"
                      className="border-[3px] border-negro bg-blanco p-2 shadow-brutal-sm transition active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                    >
                      {copied === 'ref' ? (
                        <Check className="h-4 w-4 text-carmesi" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <p className="text-xs font-semibold text-negro/60">
                  Simulación: al confirmar, el pedido se aprueba de inmediato sin transferencia
                  real.
                </p>
              </div>
            ) : null}

            {method === 'mp' ? (
              <div className="space-y-4">
                <div className="border-[3px] border-negro bg-[#FFCB45] p-6 text-negro shadow-brutal">
                  <p className="font-display text-2xl uppercase tracking-tight">Mercado Pago</p>
                  <p className="mt-1 text-sm font-semibold">
                    Paga con tu cuenta, tarjeta o saldo. Entorno mock — sin cargos reales.
                  </p>
                </div>
                <p className="text-xs font-semibold text-negro/60">
                  Al continuar, redirigimos (simulado) a Mercado Pago y aprobamos el pedido al
                  volver.
                </p>
              </div>
            ) : null}
          </div>

          <OrderSummary
            payButton={
              <button type="button" onClick={handlePay} className="btn-brutal mt-5 w-full py-4 text-sm">
                Pagar {formatPrice(total)}
                <ArrowRight className="h-4 w-4" />
              </button>
            }
          />
        </div>
      )}
    </section>
  )
}
