import { config } from "dotenv";
import fetch from "node-fetch";
config();

export const updateMetadata = async (contract, id) => {
  const url = "https://api.reservoir.tools/tokens/refresh/v1";
  const options = {
    method: "POST",
    headers: {
      accept: "*/*",
      "content-type": "application/json",
      "x-api-key": process.env.RESERVOIR_API_KEY,
    },
    body: JSON.stringify({
      overrideCoolDown: false,
      token: `${contract}:${id}`,
    }),
  };

  const response = await fetch(url, options);
  const data = await response.json();

  return data.message;
};
