async function fetchAPI(query, { variables } = {}) {
  const res = await fetch(process.env.GRAPHCMS_PROJECT_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImdjbXMtbWFpbi1wcm9kdWN0aW9uIn0.eyJ2ZXJzaW9uIjozLCJpYXQiOjE2NDU4MzY0NjAsImF1ZCI6WyJodHRwczovL2FwaS11cy1lYXN0LTEuZ3JhcGhjbXMuY29tL3YyL2NsMDMxemh0NzBjd3owMXhvNWE5ajc0bmsvbWFzdGVyIiwiaHR0cHM6Ly9tYW5hZ2VtZW50LW5leHQuZ3JhcGhjbXMuY29tIl0sImlzcyI6Imh0dHBzOi8vbWFuYWdlbWVudC5ncmFwaGNtcy5jb20vIiwic3ViIjoiMWU5NmY3NjQtMDQzMy00N2ZlLTk1MDctYmI1OTk0ZjVhNzc5IiwianRpIjoiY2wwMzRqOHR6MGV4ZTAxeG80bXVsYWRjdSJ9.r9Vo9acQ21mheuZTjithCJEDXzWrS6ku0CU1X1tQ-KcTYj3ml6n4cpGyB3QlTLoQPlELVHjUOtflowyCmHx1h4vTRCyJWYwuoUv58cybKcyCQO1dKmf7-QB7SmX8MjhNtNwID9ZJWcJhzdDMtBwYEMfq6cWDJRwm4O5vMDTA1eUEslHSwGiG6nEiTwdFP67EI1w-QgkdzzjecC2Qk7JLbeLWyPRBqr_ROtJG9UaH-KfKqSBERIQigE1yWgioLg0uHnsBPUunrzR8bUqN8Pt-zidrhx9Gjm7-iRoz5jKtoFBcfthoyKwWO76OiQ4Wzaa_eumnKRWqS37g6I15qcrS9c44OgwNWUBgaS__O82ijrgQniH06WCv8o3AOwxYpE3D5fYplDLCKAmnjIbsnEnogex0ZdmehStcRWH8i3VUQ1wQBTpJx3Je7lOF9cPA5Gf78uWC4ywqwlFNb1JX889rxSOnV2tHwOublYAb8fLIlgIfCZXMT6pb0PHvNySp-wDM379fOrZGVLheRAB1Lh-uKMkKhSnq4kvCgJWtGuwLc1caMD4Fj_GU3NcP7_5eSip5wZ8dPvZmBjCuBoMc-AkiLfe8tzTUFjRu7Ucwg6ZdMYCUrrkWhuLgXWxSQ-dTpwSOy6uuANgHrgoKdH4bqY_gioTcOueFdrkBNMK3ZrZVEbE`,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });
  const json = await res.json();

  if (json.errors) {
    console.error(json.errors);
    throw new Error('Failed to fetch API');
  }

  return json.data;
}

export async function getOrderCount() {
  const data = await fetchAPI(`
  query countOrders {
    ordersConnection {
      aggregate {
        count
      }
    }
  }
  `);

  return data?.ordersConnection?.aggregate?.count;
}

export async function getOrder(id) {
  const data = await fetchAPI(
    `
  query getOrder($id: ID!) {
    orders(where: { id: $id }) {
      id
      model {
        id
        modelGroup
        name
        exteriors {
          id
          color
        }
        wheels {
          id
          name
        }
        interiors {
          id
          color
        }
        seatingLayouts {
          id
          numberOfSeats
        }
      }
      exterior {
        id
        color
      }
      wheel {
        id
        name
      }
      interior {
        id
        color
      }
      seatingLayout {
        id
        numberOfSeats
      }
      fullSelfDriving
      orderDate
      estimatedDeliveryDateStart
      estimatedDeliveryDateEnd
      pickedUp
      pickupDate
      location
    }
  }
  `,
    {
      variables: {
        id,
      },
    },
  );

  return data?.orders[0];
}

export async function getModels() {
  const data = await fetchAPI(
    `
    query getModels {
      models {
        id
        modelGroup
        name
        exteriors {
          id
          color
        }
        wheels {
          id
          name
        }
        interiors {
          id
          color
        }
        seatingLayouts {
          id
          numberOfSeats
        }
      }
    }`,
  );

  return data;
}
