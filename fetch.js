import { config } from "dotenv";
import fetch from "node-fetch";

config();
const reservoirOptions = {
  headers: {
    accept: "*/*",
    "x-api-key": process.env.RESERVOIR_API_KEY,
  },
};
const zerionOptions = {
  headers: {
    accept: "*application/json*",
    authorization: process.env.ZERION_API_KEY,
  },
};

export const fetchData = async (url, options) => {
  const response = await fetch(url, options);
  return await response.json();
};

export const getReservoirData = async (url, options = reservoirOptions) => {
  const data = await fetchData(url, options);

  return (
    data.results ??
    data.activities ??
    data.collections ??
    data.orders ??
    data.tokens ??
    data.sales ??
    data.transfers ??
    data.stats
  );
};

export const getReservoirOwners = async (url) => {
  let owners = 0;
  const data = await fetchData(url, reservoirOptions);
  data.ownersDistribution.forEach((data) => (owners += data.ownerCount));

  return [owners, data.ownersDistribution.at(-1).tokenCount];
};

export const getZerionData = async (url, options = zerionOptions) =>
  await fetchData(url, options);
