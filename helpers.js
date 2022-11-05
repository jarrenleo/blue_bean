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
    const [[tokenData], transfers] = await Promise.all([
      getData(
        `https://api.reservoir.tools/tokens/v5?tokens=${contract}:${id}&includeAttributes=true`
      ),
      getData(
        `https://api.reservoir.tools/transfers/v2?token=${contract}:${id}`
      ),
    ]);

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

    const links = `[OpenSea](${url.opensea}/${contract}/${id}) | [LooksRare](${url.looksrare}/${contract}/${id}) | [X2Y2](${url.x2y2}/${contract}/${id}) | [Sudo](${url.sudo}/${contract}/${id}) | [Blur](${url.blur}/${token.owner}?contractAddress=${contract}) | [Gem](${url.gem}/${contract}/${id})`;

    let saleCount = 0;
    const filter = new Set();

    transfers.forEach((transfer) => {
      if (transfer.price) saleCount += 1;
      filter.add(transfer.to);
    });
    const walletsHeld = filter.size;

    const time = Date.now() - transfers.at(0).timestamp * 1000;
    const lastHeld = sortTime(time);

    return [
      token,
      isFlagged,
      rarity,
      list,
      lastSale,
      links,
      saleCount,
      walletsHeld,
      lastHeld,
    ];
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

export const sortTime = (time) => {
  const days = time / 86400000;

  if (time >= 31556952000) return `${(days / 365).toFixed(1)} year(s)`;
  if (time >= 2629800000) return `${(days / 30.4375).toFixed(0)} month(s)`;
  if (time >= 86400000) return `${days.toFixed(0)} day(s)`;
  if (time >= 3600000) return `${(days * 24).toFixed(0)} hour(s)`;
  if (time >= 60000) return `${(days * 24 * 60).toFixed(0)} minute(s)`;
};

export const roundPrice = (price, dp) => {
  if (Number.isInteger(price)) return price;
  if (price < 1) dp += 1;
  return parseFloat(price.toFixed(dp));
};

export const toPercent = (numerator, denominator) => {
  return roundPrice((numerator / denominator) * 100, 1);
};
