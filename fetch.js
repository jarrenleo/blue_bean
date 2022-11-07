import { config } from "dotenv";
import fetch from "node-fetch";

config();
const options = {
  headers: {
    accept: "*/*",
    "content-type": "application/json",
    "x-api-key": `${process.env.RESERVOIR_API_KEY}`,
  },
};

const fetchData = async (url, options) => {
  const response = await fetch(url, options);
  return await response.json();
};

export const getData = async (url, options) => {
  const data = await fetchData(url, options);
  return data.tokens ?? data.collections ?? data.sales ?? data.transfers;
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
    ...options,
    body: JSON.stringify({
      token: `${contract}:${id}`,
    }),
  });
};
