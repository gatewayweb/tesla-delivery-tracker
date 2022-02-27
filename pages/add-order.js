import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

import { getModels } from '@lib/api';
import OrderForm from '@components/order-form';

const Choice = ({ children, onClick, active }) => {
  return (
    <button
      onClick={onClick}
      className={`border border-gray-400 bg-white px-4 py-3 rounded-full mr-3 mb-3 transition-all text-sm min-w-[100px] ${
        active ? 'border-blue-500 border-[3px] font-bold' : ''
      }`}
    >
      {children}
    </button>
  );
};

export default function Home({ models }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedModelGroup, setSelectedModelGroup] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [availableModels, setAvailableModels] = useState([]);

  let modelGroups = [];
  models.forEach((model) => {
    if (!modelGroups.includes(model.modelGroup)) {
      modelGroups.push(model.modelGroup);
    }
  });

  useEffect(() => {
    setSelectedModel(null);
    setAvailableModels(models.filter((model) => model.modelGroup === selectedModelGroup));
  }, [selectedModelGroup]);

  const onSubmit = async (options) => {
    setLoading(true);
    if (
      selectedModel &&
      options.exterior &&
      options.wheel &&
      options.interior &&
      options.orderDate &&
      options.estimatedDeliveryDateStart &&
      options.estimatedDeliveryDateEnd &&
      options.location &&
      ((!selectedModel?.seatingLayouts.length && !options.seatingLayout) ||
        (selectedModel?.seatingLayouts.length && options.seatingLayout)) &&
      (!options.pickedUp || (options.pickedUp && options.pickupDate))
    ) {
      const data = {
        ...options,
        orderDate: options.orderDate.toISOString(),
        estimatedDeliveryDateStart: options.estimatedDeliveryDateStart.toISOString(),
        estimatedDeliveryDateEnd: options.estimatedDeliveryDateEnd.toISOString(),
        pickupDate: options?.pickupDate ? options.pickupDate.toISOString() : null,
        model: selectedModel,
      };

      const res = await fetch('/api/add', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({ data }),
      });

      const json = await res.json();

      if (json.errors) {
        setLoading(false);
        console.error(json.errors);
        throw new Error('Failed to fetch API');
      }

      if (json && json?.id) {
        toast.success('Thanks for adding your order.');
        router.push(`/my-order/${json.id}`);
      }
    }
  };

  return (
    <>
      <div className="container flex flex-col items-center">
        <h1 className="text-4xl">Tesla Delivery Tracker</h1>
        <div>Select your model, options, and delivery information below.</div>
        <div className="p-6 mt-12 bg-gray-50 rounded-lg">
          <div className="flex flex-wrap justify-center">
            {modelGroups &&
              modelGroups.map((model, index) => {
                return (
                  <Choice
                    key={index}
                    onClick={() => setSelectedModelGroup(model)}
                    active={selectedModelGroup === model}
                  >
                    {model}
                  </Choice>
                );
              })}
          </div>
          {availableModels.length ? (
            <div className="pt-4 border-t flex flex-wrap justify-center">
              {availableModels.map((model, index) => {
                return (
                  <Choice key={index} onClick={() => setSelectedModel(model)} active={selectedModel === model}>
                    {model.name}
                  </Choice>
                );
              })}
            </div>
          ) : (
            <></>
          )}
        </div>

        {selectedModel && (
          <OrderForm models={models} loading={loading} selectedModel={selectedModel} onSubmit={onSubmit} />
        )}
      </div>
    </>
  );
}

export async function getServerSideProps() {
  const data = await getModels();

  return { props: data };
}
