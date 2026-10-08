import { Link } from 'react-router-dom'
import { Mail, MapPin, Sparkles } from 'lucide-react'

const shopLinks = [
  { label: 'Home', to: '/' },
  { label: 'Colecciones', to: '/colecciones' },
  { label: 'Wishlist', to: '/wishlist' },
]

const helpLinks = [
  { label: 'Envíos y entregas', href: '#' },
  { label: 'Cambios y devoluciones', href: '#' },
  { label: 'Guía de tallas', href: '#' },
  { label: 'Preguntas frecuentes', href: '#' },
]

const socialLinks = [
  { label: 'Instagram', href: '#' },
  { label: 'TikTok', href: '#' },
  { label: 'X / Twitter', href: '#' },
]

export default function Footer() {
  return (
    <footer className="border-t-[3px] border-carmesi bg-negro text-crema">
      <div className="mx-auto w-full max-w-7xl px-4 py-14 md:px-6">
        <div className="border-b-[3px] border-crema/25 pb-10">
          <p className="font-brush text-2xl text-carmesi md:text-3xl">
            The Art of Wearing What You Feel.
          </p>
          <h2 className="mt-3 font-display text-5xl uppercase leading-none tracking-tight text-crema md:text-7xl">
            Shacutture
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-10 pt-10 md:grid-cols-4">
          <div>
            <h3 className="font-heading text-xs font-extrabold uppercase tracking-[0.2em] text-carmesi">
              Tienda
            </h3>
            <ul className="mt-4 space-y-2.5">
              {shopLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="font-heading text-sm font-bold uppercase tracking-wide text-crema/80 transition hover:text-carmesi"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-xs font-extrabold uppercase tracking-[0.2em] text-carmesi">
              Ayuda
            </h3>
            <ul className="mt-4 space-y-2.5">
              {helpLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="font-heading text-sm font-bold uppercase tracking-wide text-crema/80 transition hover:text-carmesi"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-xs font-extrabold uppercase tracking-[0.2em] text-carmesi">
              Contacto
            </h3>
            <ul className="mt-4 space-y-3 text-sm font-semibold text-crema/80">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-carmesi" />
                <a href="mailto:hola@shacutture.com" className="transition hover:text-carmesi">
                  hola@shacutture.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-carmesi" />
                <span>Ciudad de México, MX</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-xs font-extrabold uppercase tracking-[0.2em] text-carmesi">
              Síguenos
            </h3>
            <div className="mt-4 flex flex-col gap-2.5">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="inline-flex w-fit items-center border-2 border-crema/40 px-3 py-1.5 font-heading text-xs font-extrabold uppercase tracking-[0.14em] text-crema transition hover:border-carmesi hover:bg-carmesi hover:text-blanco"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t-[3px] border-crema/25 pt-6 md:flex-row md:items-center">
          <p className="font-heading text-xs font-bold uppercase tracking-[0.14em] text-crema/60">
            © 2026 Shacutture — Todos los derechos reservados
          </p>
          <p className="flex items-center gap-2 font-brush text-lg text-carmesi">
            <Sparkles className="h-4 w-4" />
            wear what you feel
          </p>
        </div>
      </div>
    </footer>
  )
}
