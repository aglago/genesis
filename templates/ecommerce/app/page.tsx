const products = [
  { id: "1", name: "Product One", price: "₦5,000", stock: 24 },
  { id: "2", name: "Product Two", price: "₦12,000", stock: 8 },
  { id: "3", name: "Product Three", price: "₦3,500", stock: 42 },
];

export default function EcommerceHome() {
  return (
    <main className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold">Shop</h1>
      <p className="mt-2 text-muted-foreground">Browse our products</p>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <div key={product.id} className="rounded-lg border p-6">
            <h2 className="text-lg font-semibold">{product.name}</h2>
            <p className="mt-2 text-2xl font-bold">{product.price}</p>
            <p className="text-sm text-muted-foreground">{product.stock} in stock</p>
            <button className="mt-4 inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm text-primary-foreground">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
