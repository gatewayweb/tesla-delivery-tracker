import { useEffect, useState } from 'react';
import DatePicker from 'react-date-picker/dist/entry.nostyle';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';

import locations from '@lib/locations';
import validateOrder from '@lib/validate-order';

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
  return <div className="mb-6 flex flex-col items-center border-b pb-6">{children}</div>;
};

const emptyOptions = {
  exterior: null,
  wheel: null,
  interior: null,
  seatingLayout: null,
  fullSelfDriving: false,
  orderDate: null,
  estimatedDeliveryDateStart: null,
  estimatedDeliveryDateEnd: null,
  pickupDate: null,
  pickedUp: false,
  location: '',
};

export default function OrderForm({
  initialOptions = null,
  selectedModel,
  onSubmit,
  buttonText = 'Submit',
  cancelButton = false,
  onCancel,
  setData,
  loading = false,
}) {
  const [options, setOptions] = useState(initialOptions ? initialOptions : emptyOptions);

  const setOption = (option, value) => {
    setOptions({ ...options, [option]: value });
  };

  const setEstDateStart = (value) => {
    setOption('estimatedDeliveryDateStart', value);
  };

  const setEstDateEnd = (value) => {
    setOption('estimatedDeliveryDateEnd', value);
  };

  const setOrderDate = (value) => {
    setOption('orderDate', value);
  };

  const setPickupDate = (value) => {
    setOption('pickupDate', value);
  };

  const updateLocation = (e) => {
    setOption('location', e.target.value);
  };

  useEffect(() => {
    if (setData) {
      setData(options);
    }
  }, [options, setData]);

  return (
    <>
      <div className="flex flex-col items-center">
        {selectedModel && (
          <div className="py-12">
            <OptionSection>
              <SmallTitle>Exterior</SmallTitle>
              <div className="flex flex-wrap justify-center">
                {selectedModel?.exteriors &&
                  selectedModel?.exteriors.map((exterior, index) => {
                    return (
                      <Choice
                        key={index}
                        onClick={() => setOption('exterior', exterior)}
                        active={options.exterior?.id === exterior.id}
                      >
                        {exterior.color}
                      </Choice>
                    );
                  })}
              </div>
            </OptionSection>
            <OptionSection>
              <SmallTitle>Wheels</SmallTitle>
              <div className="flex flex-wrap justify-center">
                {selectedModel?.wheels &&
                  selectedModel?.wheels.map((wheel, index) => {
                    return (
                      <Choice
                        key={index}
                        onClick={() => setOption('wheel', wheel)}
                        active={options.wheel?.id === wheel.id}
                      >
                        {wheel.name}
                      </Choice>
                    );
                  })}
              </div>
            </OptionSection>
            <OptionSection>
              <SmallTitle>Interior</SmallTitle>
              <div className="flex flex-wrap justify-center">
                {selectedModel?.interiors &&
                  selectedModel?.interiors.map((interior, index) => {
                    return (
                      <Choice
                        key={index}
                        onClick={() => setOption('interior', interior)}
                        active={options.interior?.id === interior.id}
                      >
                        {interior.color}
                      </Choice>
                    );
                  })}
              </div>
            </OptionSection>
            {selectedModel?.seatingLayouts?.length ? (
              <OptionSection>
                <SmallTitle>Seating Layout</SmallTitle>
                <div className="flex flex-wrap justify-center">
                  {selectedModel?.seatingLayouts &&
                    selectedModel?.seatingLayouts.map((layout, index) => {
                      return (
                        <Choice
                          key={index}
                          onClick={() => setOption('seatingLayout', layout)}
                          active={options.seatingLayout?.id === layout.id}
                        >
                          {layout.numberOfSeats}
                        </Choice>
                      );
                    })}
                </div>
              </OptionSection>
            ) : (
              <></>
            )}
            <OptionSection>
              <SmallTitle>Full Self Driving</SmallTitle>

              <div className="flex flex-wrap justify-center">
                <Choice onClick={() => setOption('fullSelfDriving', false)} active={!options.fullSelfDriving}>
                  No
                </Choice>
                <Choice onClick={() => setOption('fullSelfDriving', true)} active={options.fullSelfDriving}>
                  Yes
                </Choice>
              </div>
            </OptionSection>
            <OptionSection>
              <SmallTitle>Order Date</SmallTitle>
              <DatePicker onChange={setOrderDate} value={options.orderDate} />
            </OptionSection>
            {options.orderDate ? (
              <OptionSection>
                <SmallTitle>Estimated Delivery Range</SmallTitle>
                <div className="flex flex-wrap">
                  <div className="w-full md:w-1/2 flex flex-wrap justify-center pb-2 md:pb-0">
                    <DatePicker
                      onChange={setEstDateStart}
                      value={options.estimatedDeliveryDateStart}
                      minDate={options.orderDate}
                    />
                    <div className="w-full text-sm text-gray-500 uppercase text-center">(Start)</div>
                  </div>
                  {options.estimatedDeliveryDateStart ? (
                    <div className="w-full md:w-1/2 flex flex-wrap justify-center">
                      <DatePicker
                        onChange={setEstDateEnd}
                        value={options.estimatedDeliveryDateEnd}
                        minDate={options.estimatedDeliveryDateStart}
                      />
                      <div className="w-full text-sm text-gray-500 uppercase text-center">(End)</div>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </OptionSection>
            ) : (
              <></>
            )}
            <OptionSection>
              <SmallTitle>Delivery Location</SmallTitle>
              <div className="flex flex-wrap">
                <select
                  className="border border-gray-400 px-4 py-3 rounded-full mr-3 mb-3 transition-all text-sm appearance-none text-center"
                  onChange={updateLocation}
                  value={options.location}
                >
                  <option value="" disabled>
                    Choose Delivery Location
                  </option>
                  {locations.map((loc, index) => {
                    return (
                      <option key={index} value={loc}>
                        {loc}
                      </option>
                    );
                  })}
                </select>
              </div>
            </OptionSection>
            <OptionSection>
              <SmallTitle>Did you already pick up your Tesla?</SmallTitle>

              <div className="flex flex-wrap justify-center">
                <Choice onClick={() => setOption('pickedUp', false)} active={!options.pickedUp}>
                  No
                </Choice>
                <Choice onClick={() => setOption('pickedUp', true)} active={options.pickedUp}>
                  Yes
                </Choice>
              </div>
            </OptionSection>
            {options.pickedUp ? (
              <OptionSection>
                <SmallTitle>Pickup Date</SmallTitle>
                <DatePicker onChange={setPickupDate} value={options.pickupDate} />
              </OptionSection>
            ) : (
              <></>
            )}
            <div className="flex justify-center">
              {cancelButton ? (
                <button
                  onClick={onCancel}
                  className="bg-gray-200 text-gray-500 px-8 py-2 mr-4 rounded-full uppercase text-xl font-bold transition-all hover:bg-gray-300"
                >
                  Cancel
                </button>
              ) : (
                <></>
              )}

              {validateOrder({ ...options, model: selectedModel }) ? (
                <button
                  disabled={loading}
                  onClick={() => onSubmit(options)}
                  className="bg-blue-600 text-white px-8 py-2 rounded-full uppercase text-xl font-bold transition-all hover:bg-blue-700 disabled:opacity-50"
                >
                  {!loading ? buttonText : 'Loading...'}
                </button>
              ) : (
                <></>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
