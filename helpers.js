import { getData } from "./fetch.js";

export const url = {
  eth: "<:eth:1036195593728557106>",
  profile: "https://www.azuki.com/collector",
  opensea: "https://opensea.io/assets/ethereum",
  looksrare: "https://looksrare.org/collections",
  x2y2: "https://x2y2.io/eth",
  sudo: "https://sudoswap.xyz/#/item",
  blur: "https://blur.io/",
  gem: "https://www.gem.xyz/asset",
};

export const azukiInfo = {
  icon: "https://i.seadn.io/gae/H8jOCJuQokNqGBpkBN5wk1oZwO7LM8bNnrHCaekV2nKjnCqw6UB5oaH8XyNeBDj6bA_n1mjejzhFQUP3O1NfjFLHr3FOaeHcTOOT?auto=format&w=1920",
  contract: "0xed5af388653567af2f388e6224dc7c4b3241c544",
};

export const beanzInfo = {
  icon: "https://i.seadn.io/gae/_R4fuC4QGYd14-KwX2bD1wf-AWjDF2VMabfqWFJhIgiN2FnAUpnD5PLdJORrhQ8gly7KcjhQZZpuzYVPF7CDSzsqmDh97z84j2On?auto=format&w=1920",
  contract: "0x306b1ea3ecdf94ab739f1910bbda052ed4a9f949",
};

export const tokenHelper = async (contract, id, name) => {
  try {
    const [tokenData] = await getData(
      `https://api.reservoir.tools/tokens/v5?tokens=${contract}:${id}&includeAttributes=true`
    );

    const token = tokenData?.token;
    if (!token)
      throw new Error(`${name} #${id} does not exist in the collection.`);

    const isFlagged = token.isFlagged ? "⚠️" : "";
    const rarity = token.rarityRank !== null ? `#${token.rarityRank}` : "-";
    const list =
      tokenData.market.floorAsk.price !== null
        ? `⟠ ${roundPrice(tokenData.market.floorAsk.price.amount.native, 2)}`
        : "-";
    const lastSale =
      token.lastSell.value !== null
        ? `⟠ ${roundPrice(token.lastSell.value, 2)}`
        : "-";

    return [token, isFlagged, rarity, list, lastSale];
  } catch (error) {
    throw Error(error.message);
  }
};

export const sortTraits = (traits, size) => {
  const traitFields = traits.map((trait) => {
    const capitaliseKey = (key) => {
      return key
        .split(" ")
        .map((keyword) => keyword.charAt(0).toUpperCase() + keyword.slice(1))
        .join(" ");
    };

    const traitPrice = trait.floorAskPrice
      ? `${url.eth}${roundPrice(trait.floorAskPrice, 2)}`
      : "";

    return {
      name: `${capitaliseKey(trait.key)}`,
      value: `${trait.value}\n(${toPercent(
        trait.tokenCount,
        size
      )}%)\n${traitPrice}`,
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

export const roundPrice = (price, dp) => {
  if (Number.isInteger(price)) return price;
  if (price < 1) dp += 1;
  return parseFloat(price.toFixed(dp));
};

export const toPercent = (numerator, denominator) => {
  return roundPrice((numerator / denominator) * 100, 1);
};
