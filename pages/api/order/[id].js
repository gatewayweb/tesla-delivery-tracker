import { getOrder } from '@lib/api';

export default async function handler(req, res) {
  const { id } = req.query;

  const data = await getOrder(id);

  const orderOptions = {
    id,
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
  res.json({ orderOptions, selectedModel });
}
