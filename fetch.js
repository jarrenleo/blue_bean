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

export const fetchData = async (url, options) => {
  const response = await fetch(url, options);
  return await response.json();
};

export const getData = async (url, options = reservoirOptions) => {
  const data = await fetchData(url, options);
  return (
    data.activities ??
    data.collections ??
    data.orders ??
    data.tokens ??
    data.sales ??
    data.transfers ??
    data.stats
  );
};

export const getOwners = async (url) => {
  let owners = 0;
  const data = await fetchData(url, reservoirOptions);
  data.ownersDistribution.forEach((data) => (owners += data.ownerCount));

  return [owners, data.ownersDistribution.at(-1).tokenCount];
};
