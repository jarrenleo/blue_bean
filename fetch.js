import { config } from "dotenv";
import fetch from "node-fetch";

config();
const apiKey = process.env.RESERVOIR_API_KEY;
const options = {
  headers: {
    accept: "*/*",
    "x-api-key": `${apiKey}`,
  },
};

const getData = async function (url, options) {
  const response = await fetch(url, options);
  return await response.json();
};

export const getTraits = async function (url) {
  const data = await getData(url);
  return data.attributes.map(function (trait) {
    return {
      name: `${trait.trait_type}`,
      value: `${trait.value}`,
      inline: true,
    };
  });
};

const footerTemplate = function (data) {
  const latestData = data.orders?.at(0) ?? data.sales?.at(0);

  if (latestData === undefined) return "-";

  return `${latestData.price.amount.native?.toFixed(2)} ${
    latestData.price.currency.symbol
  }`;
};

export const getList = async function (url) {
  const data = await getData(url, options);
  return footerTemplate(data);
};

export const getOffer = async function (url) {
  const data = await getData(url, options);
  return footerTemplate(data);
};

export const getLastSale = async function (url) {
  const data = await getData(url, options);
  return footerTemplate(data);
};
