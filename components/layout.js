import Link from 'next/link';

export default function Layout({ children }) {
  return (
    <>
      <header>
        <Link href="/">
          <a className="fixed left-4 top-4 bg-gray-100 rounded-full text-sm px-6 py-2 font-bold">Home</a>
        </Link>
        <Link href="/my-orders">
          <a className="fixed right-4 top-4 bg-gray-100 rounded-full text-sm px-6 py-2 font-bold">My Orders</a>
        </Link>
      </header>
      <main className="py-12">{children}</main>
      <footer></footer>
    </>
  );
}
