import Link from 'next/link';
import { useEffect, useState } from 'react';

const LineItem = ({ name, id }) => {
  return (
    <Link href={`/order/${id}`}>
      <a className="flex flex-wrap items-center w-full justify-between border border-gray-300 rounded-full py-4 px-6 mb-4">
        {name}
        <div className="font-bold w-full md:w-auto">{id}</div>
      </a>
    </Link>
  );
};

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const ordersLocalStorage = window.localStorage.getItem('orders');

    if (ordersLocalStorage) {
      setOrders(JSON.parse(ordersLocalStorage));
    }
  }, []);

  return (
    <>
      <Head>
        <title>Tesla Delivery Tracker | My Orders</title>
      </Head>

      <div className="container flex flex-col items-center">
        <h1>My Orders</h1>
        {orders.length ? (
          <div className="pt-12 flex w-full flex-col items-center">
            {orders.map((order, index) => {
              return <LineItem key={index} name={order.name} id={order.id} />;
            })}
          </div>
        ) : (
          <div className="pt-12 flex flex-col items-center">
            <div className="pb-6">You have not added any orders yet.</div>
            <Link href="/add-order">
              <a className="bg-blue-600 text-white px-8 py-2 rounded-full uppercase text-xl font-bold transition-all hover:bg-blue-700 disabled:opacity-50">
                Add My Order
              </a>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
