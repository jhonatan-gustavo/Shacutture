import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CartItem = {
  id: string
  name: string
  price: number
  size: string
  qty: number
}

type CartState = {
  items: CartItem[]
  wishlist: string[]
  drawerOpen: boolean
  addItem: (item: Omit<CartItem, 'qty'>) => void
  removeItem: (id: string, size: string) => void
  setQuantity: (id: string, size: string, qty: number) => void
  setSize: (id: string, currentSize: string, newSize: string) => void
  clearCart: () => void
  toggleWishlist: (id: string) => void
  openDrawer: () => void
  closeDrawer: () => void
}

export const FREE_SHIPPING_FROM = 999
export const FLAT_SHIPPING = 99

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      wishlist: [],
      drawerOpen: false,

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find(
            (i) => i.id === item.id && i.size === item.size,
          )
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id && i.size === item.size ? { ...i, qty: i.qty + 1 } : i,
              ),
            }
          }
          return { items: [...state.items, { ...item, qty: 1 }] }
        }),

      removeItem: (id, size) =>
        set((state) => ({
          items: state.items.filter((i) => !(i.id === id && i.size === size)),
        })),

      setQuantity: (id, size, qty) =>
        set((state) => ({
          items:
            qty <= 0
              ? state.items.filter((i) => !(i.id === id && i.size === size))
              : state.items.map((i) =>
                  i.id === id && i.size === size ? { ...i, qty } : i,
                ),
        })),

      setSize: (id, currentSize, newSize) =>
        set((state) => {
          if (currentSize === newSize) return state

          const current = state.items.find(
            (i) => i.id === id && i.size === currentSize,
          )
          if (!current) return state

          const target = state.items.find((i) => i.id === id && i.size === newSize)
          if (target) {
            return {
              items: state.items
                .filter((i) => !(i.id === id && i.size === currentSize))
                .map((i) =>
                  i.id === id && i.size === newSize ? { ...i, qty: i.qty + current.qty } : i,
                ),
            }
          }

          return {
            items: state.items.map((i) =>
              i.id === id && i.size === currentSize ? { ...i, size: newSize } : i,
            ),
          }
        }),

      clearCart: () => set({ items: [] }),

      toggleWishlist: (id) =>
        set((state) => ({
          wishlist: state.wishlist.includes(id)
            ? state.wishlist.filter((w) => w !== id)
            : [...state.wishlist, id],
        })),

      openDrawer: () => set({ drawerOpen: true }),
      closeDrawer: () => set({ drawerOpen: false }),
    }),
    {
      name: 'shacutture-store',
      partialize: (state) => ({ items: state.items, wishlist: state.wishlist }),
    },
  ),
)

export const selectCount = (state: CartState) =>
  state.items.reduce((total, item) => total + item.qty, 0)

export const selectSubtotal = (state: CartState) =>
  state.items.reduce((total, item) => total + item.price * item.qty, 0)

export const selectShipping = (state: CartState) => {
  const subtotal = selectSubtotal(state)
  return subtotal === 0 || subtotal >= FREE_SHIPPING_FROM ? 0 : FLAT_SHIPPING
}

export const selectTotal = (state: CartState) =>
  selectSubtotal(state) + selectShipping(state)
