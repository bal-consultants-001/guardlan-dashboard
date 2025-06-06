import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold">
        AdBlocker Co.
      </Link>
      <div className="space-x-4">
		<Link href="/">Home</Link>
        <Link href="/shop">Shop</Link>
        <Link href="/login">Login</Link>
		<Link href="/register">Register</Link>
      </div>
    </nav>
  );
}