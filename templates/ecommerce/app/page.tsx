import { ProductCard, type Product } from "@/components/product-card";

const products: Product[] = [
  {
    id: "1",
    name: "Kente Weekender Tote",
    description: "Waxed canvas with a spacious main compartment and interior pocket. Made in Accra.",
    priceLabel: "GH₵50",
    amount: 50,
    stock: 24,
  },
  {
    id: "2",
    name: "Volta Linen Shirt",
    description: "Lightweight breathable linen in earth tones. Relaxed fit for warm afternoons.",
    priceLabel: "GH₵120",
    amount: 120,
    stock: 8,
  },
  {
    id: "3",
    name: "Coastal Ceramic Mug",
    description: "Hand-glazed stoneware with a matte finish. Holds 350ml — perfect for morning coffee.",
    priceLabel: "GH₵35",
    amount: 35,
    stock: 42,
  },
];

export default function EcommerceHome() {
  return (
    <main className="container mx-auto px-6 py-12">
      <div className="max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">New collection</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">Everyday essentials</h1>
        <p className="mt-3 text-muted-foreground">
          Thoughtfully made pieces for work, travel, and home. Free delivery in Greater Accra on orders over GH₵100.
        </p>
      </div>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}
