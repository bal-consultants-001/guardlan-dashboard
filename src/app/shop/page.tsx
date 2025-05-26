import Link from "next/link";

export default function ShopPage() {
  const products = [
    {
      id: 1,
      name: "Home Network AdBlocker",
      price: "£75",
      description: "Block ads for every device on your network.",
    },
    {
      id: 2,
      name: "Monthly Subscription",
      price: "£6/mo",
      description: "Continual filter updates and premium features.",
    },
    {
      id: 3,
      name: "Hourly Support",
      price: "£25/hr",
      description: "Technical help when you need it most.",
    },
  ];

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-8">Shop Products</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <Link href="/">
	  		<a className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800">
				Back to Home
			</a>
		</Link>
        {products.map((product) => (
          <div key={product.id} className="p-6 border rounded-lg shadow">
            <h2 className="text-xl font-bold">{product.name}</h2>
            <p className="my-2">{product.description}</p>
            <p className="font-semibold text-lg">{product.price}</p>
            <button className="mt-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}