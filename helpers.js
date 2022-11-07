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
    const [[tokenData], [sales], transfers] = await Promise.all([
      getData(
        `https://api.reservoir.tools/tokens/v5?tokens=${contract}:${id}&includeAttributes=true`
      ),
      getData(
        `https://api.reservoir.tools/sales/v4?token=${contract}:${id}&limit=1`
      ),
      getData(
        `https://api.reservoir.tools/transfers/v2?token=${contract}:${id}`
      ),
    ]);

    const token = tokenData?.token;
    if (!token)
      throw new Error(`${name} #${id} does not exist in the collection.`);

    const isFlagged = token.isFlagged ? "⚠️" : "";
    const links = `[OpenSea](${url.opensea}/${contract}/${id}) | [LooksRare](${url.looksrare}/${contract}/${id}) | [X2Y2](${url.x2y2}/${contract}/${id}) | [Sudo](${url.sudo}/${contract}/${id}) | [Blur](${url.blur}/${token.owner}?contractAddress=${contract}) | [Gem](${url.gem}/${contract}/${id})`;
    const footer = sortFooter(tokenData, sales, transfers);

    return [token, isFlagged, links, footer];
  } catch (error) {
    throw Error(error.message);
  }
};

export const sortTraits = (traits, size) => {
  const traitFields = traits.map((trait) => {
    const toCapital = (key) => {
      return key
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    };

    const traitPrice = trait.floorAskPrice
      ? `${url.eth}${toRound(trait.floorAskPrice, 2, true)}`
      : "";

    return {
      name: `${toCapital(trait.key)}`,
      value: `${trait.value}\n(${toPercent(
        trait.tokenCount,
        size
      )}%)\n${traitPrice}`,
      inline: true,
    };
  });

  const padding = 3 - (traits.length % 3);
  if (padding === 3) return traitFields;
  const paddingFields = new Array(padding).fill({
    name: "\u200b",
    value: "\u200b",
    inline: true,
  });
  return traitFields.concat(paddingFields);
};

export const marketplace = (source) => {
  const options = [
    ["opensea.io", " | <:OpenSeaLogo:862443378461638697>"],
    ["looksrare.org", " | <:looksblack:926045572903870494>"],
    ["x2y2.io", " | <:x2y2:1038761561839374398>"],
  ];

  for (const i of options) {
    if (source === i.at(0)) return i.at(1);
  }
  return "";
};

export const toRound = (price, dp, strict = false) => {
  if (Number.isInteger(price)) return price;
  if (price < 1 && !strict) dp += 1;
  return parseFloat(price.toFixed(dp));
};

export const toPercent = (part, whole) => {
  return toRound((part / whole) * 100, 1);
};

const sortTime = (time) => {
  const days = time / 86400000;
  const dp = time < 31556952000 ? 0 : 1;
  const options = [
    [31556952000, days / 365, "year(s)"],
    [2629800000, days / 30.4375, "month(s)"],
    [604800000, days / 7, "week(s)"],
    [86400000, days, "day(s)"],
    [3600000, days * 24, "hour(s)"],
    [60000, days * 1440, "minute(s)"],
  ];

  for (const i of options) {
    if (time >= i.at(0)) return `${i.at(1).toFixed(dp)} ${i.at(2)}`;
  }
};

const sortFooter = (tokenData, sales, transfers) => {
  const rarity =
    tokenData.token.rarityRank !== null
      ? `#${tokenData.token.rarityRank}`
      : "-";
  const list =
    tokenData.market.floorAsk.price !== null
      ? `⟠ ${toRound(tokenData.market.floorAsk.price.amount.native, 2)}`
      : "-";
  const lastSale = sales ? `⟠ ${toRound(sales.price.amount.native, 2)}` : "-";

  let saleCount = 0;
  const filter = new Set();

  transfers.forEach((transfer) => {
    if (transfer.price) saleCount += 1;
    filter.add(transfer.to);
  });

  const walletsHeld = filter.size;
  const time = Date.now() - transfers.at(0).timestamp * 1000;
  const lastHeld = sortTime(time);

  return `Rarity: ${rarity} | List Price: ${list} | Last Sale: ${lastSale}\nSale Count: ${saleCount} | Wallet(s) Held: ${walletsHeld} | Last Held: ${lastHeld}`;
};
