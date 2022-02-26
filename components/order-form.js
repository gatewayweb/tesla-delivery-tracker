import { useState, useEffect } from 'react';
import DatePicker from 'react-date-picker/dist/entry.nostyle';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';

import { getModels } from '@lib/api';
import locations from '@lib/locations';

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

const emptyOptions = {
  exterior: null,
  wheels: null,
  interior: null,
  seatingLayout: null,
  fsd: false,
  orderDate: null,
  estDateStart: null,
  estDateEnd: null,
  pickupDate: null,
  pickedUp: false,
  location: '',
};

export default function OrderForm({ defaultOptions = null, selectedModel, onSubmit }) {
  const [options, setOptions] = useState(defaultOptions ? defaultOptions : emptyOptions);
  const [loading, setLoading] = useState(false);

  const setOption = (option, value) => {
    setOptions({ ...options, [option]: value });
  };

  const setEstDateStart = (value) => {
    setOption('estDateStart', value);
  };

  const setEstDateEnd = (value) => {
    setOption('estDateEnd', value);
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
                        onClick={() => setOption('exterior', exterior.id)}
                        active={options.exterior === exterior.id}
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
                        onClick={() => setOption('wheels', wheel.id)}
                        active={options.wheels === wheel.id}
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
                        onClick={() => setOption('interior', interior.id)}
                        active={options.interior === interior.id}
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
                          onClick={() => setOption('seatingLayout', layout.id)}
                          active={options.seatingLayout === layout.id}
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
                <Choice onClick={() => setOption('fsd', false)} active={!options.fsd}>
                  No
                </Choice>
                <Choice onClick={() => setOption('fsd', true)} active={options.fsd}>
                  Yes
                </Choice>
              </div>
            </OptionSection>
            <OptionSection>
              <SmallTitle>Order Date</SmallTitle>
              <DatePicker onChange={setOrderDate} value={options.orderDate} />
            </OptionSection>
            <OptionSection>
              <SmallTitle>Estimated Delivery Range</SmallTitle>
              <div className="flex flex-wrap">
                <div className="w-full lg:w-1/2 flex flex-wrap justify-center pb-2 lg:pb-0">
                  <DatePicker onChange={setEstDateStart} value={options.estDateStart} />
                  <div className="w-full text-sm text-gray-500 uppercase text-center">(Start)</div>
                </div>
                <div className="w-full lg:w-1/2 flex flex-wrap justify-center">
                  <DatePicker onChange={setEstDateEnd} value={options.estDateEnd} />
                  <div className="w-full text-sm text-gray-500 uppercase text-center">(End)</div>
                </div>
              </div>
            </OptionSection>
            <OptionSection>
              <SmallTitle>Delivery Location</SmallTitle>
              <div className="flex flex-wrap">
                <select
                  className="border border-gray-400 px-4 py-3 rounded-full mr-3 mb-3 transition-all text-sm"
                  onChange={updateLocation}
                >
                  <option value="" disabled selected>
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
              {selectedModel &&
              options.exterior &&
              options.wheels &&
              options.interior &&
              options.orderDate &&
              options.estDateStart &&
              options.estDateEnd &&
              ((!selectedModel?.seatingLayouts.length && !options.seatingLayout) ||
                (selectedModel?.seatingLayouts.length && options.seatingLayout)) &&
              (!options.pickedUp || (options.pickedUp && options.pickupDate)) ? (
                <button
                  onClick={() => onSubmit(options)}
                  className="bg-blue-600 text-white px-8 py-2 rounded-full uppercase text-xl font-bold transition-all hover:bg-blue-700"
                >
                  Submit
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
