import { Link } from 'react-router-dom'
import { ArrowRight, Heart } from 'lucide-react'

export default function WishlistPage() {
  return (
    <section className="mx-auto flex min-h-[60vh] w-full max-w-4xl flex-col items-start justify-center gap-6 px-4 py-20 md:px-6">
      <span className="badge-brutal bg-carmesi text-blanco">Próximamente</span>
      <div className="flex items-center gap-4">
        <span className="grid h-14 w-14 place-items-center border-[3px] border-negro bg-crema shadow-brutal">
          <Heart className="h-7 w-7 text-carmesi" />
        </span>
        <h1 className="font-display text-4xl uppercase leading-none tracking-tight text-negro md:text-6xl">
          Wishlist
        </h1>
      </div>
      <p className="max-w-lg text-base font-medium text-negro/70">
        Tus favoritos con persistencia local. El gesto de “me gusta” con microanimación física se
        conecta en la fase de estado global.
      </p>
      <Link to="/colecciones" className="btn-brutal bg-vino">
        Explorar colecciones
        <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  )
}
