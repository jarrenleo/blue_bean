import { getData, getOrders } from "./fetch.js";

export const contract = {
  azuki: "0xed5af388653567af2f388e6224dc7c4b3241c544",
  beanz: "0x306b1ea3ecdf94ab739f1910bbda052ed4a9f949",
};

export const url = {
  azukiIcon:
    "https://i.seadn.io/gae/H8jOCJuQokNqGBpkBN5wk1oZwO7LM8bNnrHCaekV2nKjnCqw6UB5oaH8XyNeBDj6bA_n1mjejzhFQUP3O1NfjFLHr3FOaeHcTOOT?auto=format&w=1920",
  beanzIcon:
    "https://i.seadn.io/gae/_R4fuC4QGYd14-KwX2bD1wf-AWjDF2VMabfqWFJhIgiN2FnAUpnD5PLdJORrhQ8gly7KcjhQZZpuzYVPF7CDSzsqmDh97z84j2On?auto=format&w=1920",
  azukiProfile: "https://www.azuki.com/collector",
  opensea: "https://opensea.io/assets/ethereum",
  looksrare: "https://looksrare.org/collections",
  x2y2: "https://x2y2.io/eth",
  sudo: "https://sudoswap.xyz/#/item",
  gem: "https://www.gem.xyz/asset",
  blur: "https://blur.io/",
};

export const promiseHelper = async function (contract, id) {
  return await Promise.all([
    getData(
      `https://api.reservoir.tools/tokens/v5?tokens=${contract}:${id}&includeAttributes=true`
    ),
    getOrders(
      `https://api.reservoir.tools/orders/asks/v3?token=${contract}:${id}&sortBy=price`
    ),
    getOrders(`https://api.reservoir.tools/sales/v4?token=${contract}:${id}`),
  ]);
};

export const sortTraits = function (traits, size) {
  const traitFields = traits.map(function (trait) {
    const capitaliseKey = function (key) {
      return key
        .toLowerCase()
        .split(" ")
        .map((keyword) => keyword.charAt(0).toUpperCase() + keyword.slice(1))
        .join(" ");
    };

    const traitPrice = trait.floorAskPrice
      ? ` | ${roundPrice(trait.floorAskPrice, 2)} Ξ`
      : "";

    return {
      name: `${capitaliseKey(trait.key)}`,
      value: `${trait.value}\n(${toPercent(
        trait.tokenCount,
        size
      )}%)${traitPrice}`,
      inline: true,
    };
  });

  const paddingLength = 3 - (traits.length % 3);
  if (paddingLength === 3) return traitFields;
  const padding = new Array(paddingLength).fill({
    name: "\u200b",
    value: "\u200b",
    inline: true,
  });
  return traitFields.concat(padding);
};

export const tokenLinks = function (contract, id, owner) {
  return `[OpenSea](${url.opensea}/${contract}/${id}) | [LooksRare](${url.looksrare}/${contract}/${id}) | [X2Y2](${url.x2y2}/${contract}/${id}) | [Sudo](${url.sudo}/${contract}/${id}) | [Gem](${url.gem}/${contract}/${id}) | [Blur](${url.blur}/${owner}?contractAddress=${contract})`;
};

export const roundPrice = function (price, dp) {
  if (Number.isInteger(price)) return price;
  if (price < 1) dp += 1;
  return parseFloat(price.toFixed(dp));
};

export const toPercent = function (numerator, denominator) {
  return roundPrice((numerator / denominator) * 100, 1);
};
