import { config } from "dotenv";
import fetch from "node-fetch";
config();

export const getData = async (url) => {
  const options = {
    headers: {
      accept: "*/*",
      "x-api-key": process.env.RESERVOIR_API_KEY,
    },
  };
  const response = await fetch(url, options);
  const data = await response.json();

  return data.collections ?? data.tokens ?? data.transfers;
};
