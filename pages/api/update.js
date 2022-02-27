import { GraphQLClient } from 'graphql-request';

export default async ({ body }, res) => {
  const { data } = body;

  const graphcms = new GraphQLClient('https://api-us-east-1.graphcms.com/v2/cl031zht70cwz01xo5a9j74nk/master', {
    headers: {
      authorization: `Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImdjbXMtbWFpbi1wcm9kdWN0aW9uIn0.eyJ2ZXJzaW9uIjozLCJpYXQiOjE2NDU4NDk3NDAsImF1ZCI6WyJodHRwczovL2FwaS11cy1lYXN0LTEuZ3JhcGhjbXMuY29tL3YyL2NsMDMxemh0NzBjd3owMXhvNWE5ajc0bmsvbWFzdGVyIiwiaHR0cHM6Ly9tYW5hZ2VtZW50LW5leHQuZ3JhcGhjbXMuY29tIl0sImlzcyI6Imh0dHBzOi8vbWFuYWdlbWVudC5ncmFwaGNtcy5jb20vIiwic3ViIjoiNmVmOWRlNmEtOTJjZC00ZTBjLWFkYTMtY2QwOGFmNzFjNGRkIiwianRpIjoiY2wwM2NmdmJzMDMxNjAxeXo5ZDAzM2ZwbyJ9.ny4ZYj4PTsBQzCuyab66kh4Qjjekf8tNQRzzmwkVGFQnN4OqeClwcytFLLE9h3dansGctwj0SfSLFcoTaUfhaTMmk7PUK0Pc6E0oG9mpp_c_0eBdY2IQBfgFVJ9G7vLci_PxUF4vJo5yUjxv6SxwH4LLDSa3CG2dzs6BPT5-6CAqgiMLTFpK4_H4W5QRYNubJ-zpjWsvpNhobZc_i1I8HNBcjQ97SVWL-5nBmXBrfc47JLX8J7lwYcrDmfkZDcoF--pmVcx5L5os2xd0qZ4IE_hIrMm_anvAvxCfxH-6Ahbs77vQoUJulOgbvbzdze05PD0TRddfwriK1CpRaQCtxcGqQ-UuHpxTKmnWig-Q6jOZ-Wt-mlSsCsutHD8-CtQwkTrU3QMv7niZSXw627BgkFX3i-kje_YrnFw3qpLd6wMtDET1y25TpoxNGxHl8N2ysuR4CXaISxzBwNiM4oXjfRCeISlQ4N6jK8-cztYFsjDUzgvU881kF3i7-RM2G2RP6ljgc3GZrbYqcURzbnD6rjwIFobMlytmML6-r_UnPe9wWfhoAHArWUd5oEB3sc4FIyowQjD72p6Hgf2xpgPKBtmcQzC8Tk6eXA2N_3gWXUe0MZ5e0wSsREnWu0y257K2mg1LwBM2m4FdPn0Ds67kEzrxMAA0IB-_2bW03hlabww`,
    },
  });

  const { updateOrder } = await graphcms.request(
    `mutation updateOrder($orderID: ID!, $model: ID!, $exterior: ID!, $wheels: ID!, $interior: ID!, $fsd: Boolean!, $orderDate: Date!, $estDateStart: Date!, $estDateEnd: Date!, $pickedUp: Boolean!, $location: String!) {
      updateOrder(
        where: { id: $orderID }
        data: {
          model: { connect: { id: $model } },
          exterior: { connect: { id: $exterior } },
          wheel: { connect: { id:  $wheels } },
          interior: { connect: { id: $interior } },
          fullSelfDriving: $fsd,
          orderDate: $orderDate,
          estimatedDeliveryDateStart: $estDateStart,
          estimatedDeliveryDateEnd: $estDateEnd,
          pickedUp: $pickedUp,
          location: $location
          ${data.pickedUp ? `, pickupDate: "${data.pickupDate}"` : ``}
          ${data.seatingLayout ? `, seatingLayout: { connect: { id: "${data.seatingLayout}" } }` : ``}
        }) {
        id
      }
    }`,
    {
      orderID: data.orderID,
      model: data.model,
      exterior: data.exterior,
      wheels: data.wheels,
      interior: data.interior,
      fsd: data?.fsd ? true : false,
      orderDate: data.orderDate,
      estDateStart: data.estDateStart,
      estDateEnd: data.estDateEnd,
      pickedUp: data?.pickedUp ? true : false,
      location: data.location,
    },
  );

  await graphcms.request(
    `mutation publishOrder($id: ID!) {
      publishOrder(where: { id: $id }, to: PUBLISHED) {
        id
      }
    }`,
    { id: updateOrder.id },
  );

  res.status(201).json({ id: updateOrder.id });
};
