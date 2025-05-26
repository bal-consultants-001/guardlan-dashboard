import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <Link href="/">
        <a className="text-xl font-bold">AdBlocker Co.</a>
      </Link>
      <div className="space-x-4">
		<Link href="/"><a>Home</a></Link>
        <Link href="/shop"><a>Shop</a></Link>
        <Link href="/login"><a>Login</a></Link>
		<Link href="/register"><a>Register</a></Link>
      </div>
    </nav>
  );
}