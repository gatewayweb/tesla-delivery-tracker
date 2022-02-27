export default (order) => {
  return (
    order?.model &&
    order?.exterior &&
    order?.wheel &&
    order?.interior &&
    order?.orderDate &&
    order?.estimatedDeliveryDateStart &&
    order?.estimatedDeliveryDateEnd &&
    order?.location &&
    (!order.seatingLayout || (order?.model?.seatingLayouts.length && order.seatingLayout)) &&
    (!order?.pickedUp || (order?.pickedUp && order?.pickupDate))
  );
};
