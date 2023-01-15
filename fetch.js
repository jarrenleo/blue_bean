import { config } from "dotenv";
import fetch from "node-fetch";

config();
const reservoirOptions = {
  headers: {
    accept: "*/*",
    "content-type": "application/json",
    "x-api-key": `${process.env.RESERVOIR_API_KEY}`,
  },
};

export const fetchData = async (url, options = reservoirOptions) => {
  const response = await fetch(url, options);
  return await response.json();
};

export const getData = async (url, options) => {
  const data = await fetchData(url, options);
  return (
    data.activities ??
    data.collections ??
    data.tokens ??
    data.orders ??
    data.sales ??
    data.transfers
  );
};

export const getOwners = async (url) => {
  let owners = 0;
  const data = await fetchData(url, options);
  data.ownersDistribution.forEach((data) => (owners += data.ownerCount));
  return [owners, data.ownersDistribution.at(-1).tokenCount];
};

export const refreshToken = async (url, contract, id) => {
  return await fetch(url, {
    method: "POST",
    ...reservoirOptions,
    body: JSON.stringify({
      token: `${contract}:${id}`,
    }),
  });
};
