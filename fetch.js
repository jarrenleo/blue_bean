import { config } from "dotenv";
import fetch from "node-fetch";

config();
const apiKey = process.env.RESERVOIR_API_KEY;

export const getTraits = async function (url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    const traits = data.attributes.map(function (trait) {
      return {
        name: `${trait.trait_type}`,
        value: `${trait.value}`,
        inline: true,
      };
    });

    return traits;
  } catch (error) {
    console.log(error.message);
  }
};

export const getLatestSale = async function (url) {
  try {
    const response = await fetch(url, {
      headers: {
        accept: "*/*",
        "x-api-key": `${apiKey}`,
      },
    });
    const data = await response.json();
    const latestSale = data.sales.at(0);

    if (latestSale === undefined) return "--";

    return `${latestSale.price.amount.native} ${
      latestSale.price.currency.symbol
    } ($${Math.round(latestSale.price.amount.usd).toLocaleString("en-US")}) @ ${
      latestSale.orderSource
    }`;
  } catch (error) {
    console.log(error.message);
  }
};
