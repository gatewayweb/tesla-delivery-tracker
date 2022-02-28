import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

import { getOrderCount } from '@lib/api';

export default function Home({ count }) {
  return (
    <>
      <Head>
        <title>Tesla Delivery Tracker | Home</title>
      </Head>
      <div className="container flex flex-col items-center">
        <h1>Track Tesla Deliveries</h1>
        <div className="w-64 max-w-full pt-10">
          <Image width={392} height={600} src="/haha-yes.png" />
        </div>
        <div className="pt-10">
          <h2>
            We have <span className="text-blue-600">{count}</span> orders in the system so far.
          </h2>
        </div>
        <div className="pt-10 flex flex-wrap w-full justify-center">
          <Link href="/add-order">
            <a className="bg-blue-600 text-white px-8 py-2 rounded-full uppercase text-xl font-bold transition-all hover:bg-blue-700 disabled:opacity-50">
              Add My Order
            </a>
          </Link>
          <Link href="/analyze">
            <a className="bg-green-600 text-white px-8 py-2 ml-8 rounded-full uppercase text-xl font-bold transition-all hover:bg-green-700 disabled:opacity-50">
              Analyze Deliveries
            </a>
          </Link>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  const count = await getOrderCount();

  return { props: { count } };
}
