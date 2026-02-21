export const categories = [
  { id: 'tees', name: 'T-Shirts', slug: 'tees' },
  { id: 'hoodies', name: 'Hoodies', slug: 'hoodies' },
  { id: 'caps', name: 'Caps', slug: 'caps' },
  { id: 'accessories', name: 'Accessories', slug: 'accessories' },
]

export const defaultProducts = [
  { id: '1', name: 'Neon Grid Tee', slug: 'neon-grid-tee', category: 'tees', price: 32, description: 'Premium cotton tee with bold neon grid print.', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600', images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600'], sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Black', 'White', 'Cyan'], featured: true },
  { id: '2', name: 'Abstract Wave Tee', slug: 'abstract-wave-tee', category: 'tees', price: 28, description: 'Soft blend tee with abstract wave graphic.', image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600', images: ['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600'], sizes: ['S', 'M', 'L', 'XL'], colors: ['Black', 'Grey'], featured: true },
  { id: '3', name: 'Minimal Logo Tee', slug: 'minimal-logo-tee', category: 'tees', price: 26, description: 'Clean crew neck with subtle embroidered logo.', image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600', images: ['https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600'], sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['White', 'Black', 'Navy'], featured: true },
  { id: '4', name: 'Oversized Drop Shoulder Tee', slug: 'oversized-drop-shoulder-tee', category: 'tees', price: 34, description: 'Oversized fit with drop shoulder. Heavyweight cotton.', image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600', images: ['https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600'], sizes: ['S', 'M', 'L', 'XL'], colors: ['Black', 'Charcoal'], featured: false },
  { id: '5', name: 'Vintage Wash Tee', slug: 'vintage-wash-tee', category: 'tees', price: 30, description: 'Vintage wash effect with worn-in feel.', image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600', images: ['https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600'], sizes: ['S', 'M', 'L'], colors: ['Grey', 'Olive'], featured: false },
  { id: '6', name: 'Stripe Crew Tee', slug: 'stripe-crew-tee', category: 'tees', price: 29, description: 'Classic horizontal stripes. Breathable cotton.', image: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600', images: ['https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600'], sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Navy/White', 'Black/White'], featured: false },
  { id: '7', name: 'Heavyweight Hoodie', slug: 'heavyweight-hoodie', category: 'hoodies', price: 65, description: '400gsm fleece hoodie. Kangaroo pocket.', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600', images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600'], sizes: ['S', 'M', 'L', 'XL'], colors: ['Black', 'Grey', 'Navy'], featured: true },
  { id: '8', name: 'Zip-Up Hoodie', slug: 'zip-up-hoodie', category: 'hoodies', price: 72, description: 'Full zip with soft interior.', image: 'https://images.unsplash.com/photo-1578768079052-aa76e52d2d3e?w=600', images: ['https://images.unsplash.com/photo-1578768079052-aa76e52d2d3e?w=600'], sizes: ['S', 'M', 'L', 'XL'], colors: ['Black', 'White'], featured: false },
  { id: '9', name: 'Logo Cap', slug: 'logo-cap', category: 'caps', price: 24, description: 'Structured cap with embroidered logo.', image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600', images: ['https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600'], sizes: ['One Size'], colors: ['Black', 'Navy', 'Grey'], featured: false },
  { id: '10', name: 'Dad Cap', slug: 'dad-cap', category: 'caps', price: 22, description: 'Unstructured low-profile cap.', image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600', images: ['https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600'], sizes: ['One Size'], colors: ['Black', 'White', 'Olive'], featured: false },
  { id: '11', name: 'Tote Bag', slug: 'tote-bag', category: 'accessories', price: 18, description: 'Canvas tote with print. Durable and roomy.', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600', images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600'], sizes: ['One Size'], colors: ['Natural', 'Black'], featured: false },
  { id: '12', name: 'Sticker Pack', slug: 'sticker-pack', category: 'accessories', price: 8, description: 'Set of 5 vinyl stickers.', image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=600', images: ['https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=600'], sizes: ['One Size'], colors: ['Mixed'], featured: false },
]

export function getProductBySlug(products, slug) {
  return products.find((p) => p.slug === slug)
}

export function getFeaturedProducts(products) {
  return products.filter((p) => p.featured)
}

export function getProductsByCategory(products, categorySlug) {
  if (!categorySlug) return products
  return products.filter((p) => p.category === categorySlug)
}
