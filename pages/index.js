import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="container flex flex-col items-center">
      <h1>Track Tesla Deliveries</h1>
      <div className="w-64 max-w-full">
        <Image width={392} height={600} src="/haha-yes.png" />
      </div>
      <div className="pt-10">
        <Link href="/add-order">
          <a className="bg-blue-600 text-white px-8 py-2 rounded-full uppercase text-xl font-bold transition-all hover:bg-blue-700 disabled:opacity-50">
            Add My Order
          </a>
        </Link>
      </div>
    </div>
  );
}
