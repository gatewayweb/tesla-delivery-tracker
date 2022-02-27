import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { getOrder } from '@lib/api';
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
    <div className="flex items-center w-full justify-between border rounded-full py-4 px-6 mb-4">
      {name}
      <div className="font-bold">{value}</div>
    </div>
  );
};

export default function MyOrder({ orderOptions, selectedModel }) {
  const router = useRouter();

  const [editing, setEditing] = useState(false);
  const [options, setOptions] = useState(orderOptions);
  const [data, setData] = useState(orderOptions.data);

  useEffect(() => {
    // console.log(orderOptions.data.exterior);
    setData(options.data);
  }, [options]);

  orderOptions.estDateStart = formatDate(orderOptions.dates.estDateStart);
  orderOptions.estDateEnd = formatDate(orderOptions.dates.estDateEnd);
  orderOptions.orderDate = formatDate(orderOptions.dates.orderDate);
  orderOptions.pickupDate = formatDate(orderOptions.dates.pickupDate);

  const onSubmit = async (options) => {
    if (
      selectedModel &&
      options.exterior &&
      options.wheels &&
      options.interior &&
      options.orderDate &&
      options.estDateStart &&
      options.estDateEnd &&
      options.location &&
      ((!selectedModel?.seatingLayouts.length && !options.seatingLayout) ||
        (selectedModel?.seatingLayouts.length && options.seatingLayout)) &&
      (!options.pickedUp || (options.pickedUp && options.pickupDate))
    ) {
      const data = {
        ...options,
        orderID: orderOptions.id,
        orderDate: options.orderDate.toISOString(),
        estDateStart: options.estDateStart.toISOString(),
        estDateEnd: options.estDateEnd.toISOString(),
        pickupDate: options?.pickupDate ? options.pickupDate.toISOString() : null,
        model: selectedModel.id,
      };

      const res = await fetch('/api/update', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({ data }),
      });

      const json = await res.json();

      if (json.errors) {
        console.error(json.errors);
        throw new Error('Failed to fetch API');
      }

      if (json && json?.id) {
        router.replace(router.asPath);
        setEditing(false);
      }
    }
  };

  return (
    <div className="container pt-12 w-full flex flex-col items-center">
      <div className="pb-6 w-full flex flex-col items-center">
        <h1 className="text-4xl">My Order</h1>
        <div className="uppercase text-sm text-gray-500 pt-2">
          <strong>Order ID:</strong> {orderOptions.id}
        </div>
        <div className=" text-sm text-gray-500 pt-2">
          You can update your order on this page as delivery dates change, etc.
        </div>
      </div>

      {!editing ? (
        <>
          <LineItem name="Exterior" value={options.data.exterior.color} />
          <LineItem name="Wheels" value={data.wheel.name} />
          <LineItem name="Interior" value={data.interior.color} />
          {data.seatingLayout ? <LineItem name="Seating layout" value={data.seatingLayout.numberOfSeats} /> : <></>}
          <LineItem name="Full Self Driving" value={data.fullSelfDriving ? 'Yes' : 'No'} />
          <LineItem name="Order Date" value={orderOptions.orderDate.toLocaleDateString('en-US')} />
          <LineItem
            name="Estimated Delivery"
            value={`${orderOptions.estDateStart.toLocaleDateString(
              'en-US',
            )} - ${orderOptions.estDateEnd.toLocaleDateString('en-US')}`}
          />
          <LineItem name="Location" value={data.location} />
          <LineItem name="Picked Up?" value={data.pickedUp ? 'Yes' : 'No'} />
          <div className="pt-6">
            <button
              onClick={() => setEditing(true)}
              className="bg-blue-600 text-white px-8 py-2 rounded-full uppercase text-xl font-bold transition-all hover:bg-blue-700"
            >
              Update my Order
            </button>
          </div>
        </>
      ) : (
        <>
          <OrderForm
            defaultOptions={options}
            onSubmit={onSubmit}
            selectedModel={selectedModel}
            buttonText="Update"
            cancelButton={true}
            onCancel={() => setEditing(false)}
          />
        </>
      )}
    </div>
  );
}

export async function getServerSideProps({ params, res }) {
  const { id } = params;
  const data = await getOrder(id);
  console.log(data.exterior);
  const orderOptions = {
    id: data.id,
    exterior: data.exterior.id,
    wheels: data.wheel.id,
    interior: data.interior.id,
    seatingLayout: data?.seatingLayout ? data?.seatingLayout?.id : null,
    fsd: data.fullSelfDriving,
    dates: {
      orderDate: data.orderDate,
      estDateStart: data.estimatedDeliveryDateStart,
      estDateEnd: data.estimatedDeliveryDateEnd,
      pickupDate: data.pickupDate,
    },
    pickedUp: data.pickedUp,
    location: data.location,
    data,
  };

  // console.log(data.exterior.color);

  const selectedModel = data.model;

  return { props: { orderOptions, selectedModel } };
}
