import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { toast } from 'react-toastify';

import { getOrder } from '@lib/api';
import validateOrder from '@lib/validate-order';
import OrderForm from '@components/order-form';

const formatDate = (dateString) => {
  const splitDate = dateString ? dateString.split('-') : null;
  if (splitDate && splitDate.length === 3) {
    const [year, month, day] = splitDate;
    return new Date(`${month}/${day}/${year}`);
  } else {
    return null;
  }
};

const LineItem = ({ name, value }) => {
  return (
    <div className="flex flex-wrap items-center w-full justify-between border border-gray-300 rounded-full py-4 px-6 mb-4">
      {name}
      <div className="font-bold w-full md:w-auto">{value}</div>
    </div>
  );
};

export default function MyOrder({ order }) {
  if (!order || !order.id) {
    return <div className="pt-12 text-lg text-center">Order not found.</div>;
  }
  order.orderDate = formatDate(order.dates.orderDate);
  order.pickupDate = formatDate(order.dates.pickupDate);
  order.estimatedDeliveryDateStart = formatDate(order.dates.estimatedDeliveryDateStart);
  order.estimatedDeliveryDateEnd = formatDate(order.dates.estimatedDeliveryDateEnd);

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(order);

  if (!data) return <>Loading...</>;

  const onSubmit = async () => {
    setLoading(true);
    if (validateOrder(data)) {
      const orderData = {
        ...data,
        orderDate: data.orderDate.toISOString(),
        estimatedDeliveryDateStart: data.estimatedDeliveryDateStart.toISOString(),
        estimatedDeliveryDateEnd: data.estimatedDeliveryDateEnd.toISOString(),
        pickupDate: data?.pickupDate ? data.pickupDate.toISOString() : null,
      };

      const res = await fetch('/api/update', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({ orderData }),
      });

      const json = await res.json();

      if (json.errors) {
        setLoading(false);
        console.error(json.errors);
        throw new Error('Failed to fetch API');
      }

      if (json && json?.id) {
        setLoading(false);
        setEditing(false);
        toast.success('Your order has been updated.');
      }
    }
  };

  return (
    <>
      <Head>
        <title>Tesla Delivery Tracker | My Order</title>
      </Head>
      <div className="container w-full flex flex-col items-center">
        <div className="pb-12 w-full flex flex-col items-center">
          <h1 className="text-4xl">My Order</h1>
          <div className="uppercase text-sm text-gray-500 pt-2">
            <strong>Order ID:</strong> {data.id}
          </div>
          <div className="text-sm text-gray-500 pt-2">
            <strong>Make sure to save this order ID so you can get back to this page!</strong>
            <br />
            You can update your order on this page as delivery dates change, etc.
          </div>
        </div>

        {!editing ? (
          <>
            <LineItem name="Model" value={data.model.name} />
            <LineItem name="Exterior" value={data.exterior.color} />
            <LineItem name="Wheels" value={data.wheel.name} />
            <LineItem name="Interior" value={data.interior.color} />
            {data?.seatingLayout ? <LineItem name="Seating layout" value={data.seatingLayout.numberOfSeats} /> : <></>}
            <LineItem name="Full Self Driving" value={data.fullSelfDriving ? 'Yes' : 'No'} />
            <LineItem name="Order Date" value={data.orderDate.toLocaleDateString('en-US')} />
            <LineItem
              name="Estimated Delivery"
              value={`${data.estimatedDeliveryDateStart.toLocaleDateString(
                'en-US',
              )} - ${data.estimatedDeliveryDateEnd.toLocaleDateString('en-US')}`}
            />
            <LineItem name="Location" value={data.location} />
            <LineItem name="Picked Up?" value={data.pickedUp ? 'Yes' : 'No'} />
            {data.pickedUp ? (
              <LineItem name="Pickup Date" value={data.pickupDate.toLocaleDateString('en-US')} />
            ) : (
              <></>
            )}
            <div className="pt-6">
              <button
                onClick={() => setEditing(true)}
                disabled={loading}
                className="bg-blue-600 text-white px-8 py-2 rounded-full uppercase text-xl font-bold transition-all hover:bg-blue-700"
              >
                Update my Order
              </button>
            </div>
          </>
        ) : (
          <>
            <OrderForm
              initialOptions={data}
              selectedModel={data.model}
              onSubmit={onSubmit}
              onCancel={() => setEditing(false)}
              buttonText="Update"
              cancelButton={true}
              setData={setData}
              loading={loading}
            />
          </>
        )}
      </div>
    </>
  );
}

export async function getServerSideProps({ params, res }) {
  const { id } = params;
  const order = (await getOrder(id)) || {};

  // if (!order || !order.id) {
  //   return {
  //     redirect: {
  //       destination: '/',
  //       permanent: false,
  //     },
  //   };
  // }

  order.dates = {
    orderDate: order?.orderDate || null,
    estimatedDeliveryDateStart: order?.estimatedDeliveryDateStart || null,
    estimatedDeliveryDateEnd: order?.estimatedDeliveryDateEnd || null,
    pickupDate: order?.pickupDate || null,
  };

  return { props: { order } };
}
