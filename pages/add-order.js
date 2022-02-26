import { useState, useEffect } from 'react';
import DatePicker from 'react-date-picker/dist/entry.nostyle';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';

import { getModels } from '@lib/api';
import locations from '@lib/locations';
import OrderForm from '@components/order-form';

const Choice = ({ children, onClick, active }) => {
  return (
    <button
      onClick={onClick}
      className={`border border-gray-400 px-4 py-3 rounded-full mr-3 mb-3 transition-all text-sm min-w-[100px] ${
        active ? 'border-blue-500 border-[3px] font-bold' : ''
      }`}
    >
      {children}
    </button>
  );
};

const SmallTitle = ({ children }) => {
  return <h3 className="text-xl mb-3 font-bold">{children}</h3>;
};

const OptionSection = ({ children }) => {
  return <div className="mb-6 flex flex-col items-center">{children}</div>;
};

export default function Home({ models }) {
  const [loading, setLoading] = useState(false);
  const [selectedModelGroup, setSelectedModelGroup] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [availableModels, setAvailableModels] = useState([]);
  // console.log(models);

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
    const data = {
      ...options,
      orderDate: options.orderDate.toISOString(),
      estDateStart: options.estDateStart.toISOString(),
      estDateEnd: options.estDateEnd.toISOString(),
      pickupDate: options?.pickupDate ? options.pickupDate.toISOString() : null,
      model: selectedModel.id,
    };

    const res = await fetch('/api/add', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ data }),
    });
    console.log(res);
  };

  return (
    <>
      <div className="container pt-12 flex flex-col items-center">
        <h1 className="text-4xl">Tesla Delivery Tracker</h1>
        <div>Select your model, options, and delivery information below.</div>
        <div className="pt-12 flex flex-wrap justify-center">
          {modelGroups &&
            modelGroups.map((model, index) => {
              return (
                <Choice key={index} onClick={() => setSelectedModelGroup(model)} active={selectedModelGroup === model}>
                  {model}
                </Choice>
              );
            })}
        </div>
        <div className="pt-4 border-t flex flex-wrap justify-center">
          {availableModels &&
            availableModels.map((model, index) => {
              return (
                <Choice key={index} onClick={() => setSelectedModel(model)} active={selectedModel === model}>
                  {model.name}
                </Choice>
              );
            })}
        </div>
        {selectedModel && <OrderForm models={models} selectedModel={selectedModel} onSubmit={onSubmit} />}
      </div>
    </>
  );
}

export async function getServerSideProps() {
  const data = await getModels();

  return { props: data };
}
