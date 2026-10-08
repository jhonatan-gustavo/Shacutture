import { lazy, Suspense } from 'react'
import HeroSection from '../components/home/HeroSection'
import MarqueeTicker from '../components/home/MarqueeTicker'
import RecentDrops from '../components/home/RecentDrops'

const Product3DViewer = lazy(() => import('../components/home/Product3DViewer'))

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <MarqueeTicker />
      <Suspense
        fallback={<div className="h-[420px] w-full bg-negro md:h-[560px]" aria-hidden="true" />}
      >
        <Product3DViewer />
      </Suspense>
      <RecentDrops />
    </>
  )
}
