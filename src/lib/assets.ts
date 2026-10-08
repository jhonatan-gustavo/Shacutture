const BASE = import.meta.env.BASE_URL

export const logoUrl = `${BASE}images/Logo shacutture.png`

export const productImageUrl = (n: number | string) => `${BASE}images/products/${n}.jpeg`
