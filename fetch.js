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

const fetchData = async function (url, options) {
  const response = await fetch(url, options);
  return await response.json();
};

export const getData = async function (url, options) {
  const data = await fetchData(url, options);
  const updatedData = data.tokens ?? data.collections;
  return updatedData;
};

export const getOwners = async function (url) {
  let uniqueOwners = 0;

  const data = await fetchData(url, options);
  data.ownersDistribution.forEach((data) => (uniqueOwners += data.ownerCount));
  return uniqueOwners;
};

export const refreshToken = async function (url, contract, id) {
  return await fetch(url, {
    method: "POST",
    ...options,
    body: JSON.stringify({
      token: `${contract}:${id}`,
    }),
  });
};
