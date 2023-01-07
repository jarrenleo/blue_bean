import { getData } from "./fetch.js";

export const url = {
  profile: "https://www.azuki.com/collector",
  opensea: "https://opensea.io/assets/ethereum",
  looksrare: "https://looksrare.org/collections",
  x2y2: "https://x2y2.io/eth",
  sudo: "https://sudoswap.xyz/#/item",
  blur: "https://blur.io/",
  gem: "https://www.gem.xyz/asset",
  eth: "<:eth:1036195593728557106>",
};

export const azukiInfo = {
  icon: "https://i.seadn.io/gae/H8jOCJuQokNqGBpkBN5wk1oZwO7LM8bNnrHCaekV2nKjnCqw6UB5oaH8XyNeBDj6bA_n1mjejzhFQUP3O1NfjFLHr3FOaeHcTOOT?auto=format&w=1920",
  contract: "0xed5af388653567af2f388e6224dc7c4b3241c544",
};

export const beanzInfo = {
  icon: "https://i.seadn.io/gae/_R4fuC4QGYd14-KwX2bD1wf-AWjDF2VMabfqWFJhIgiN2FnAUpnD5PLdJORrhQ8gly7KcjhQZZpuzYVPF7CDSzsqmDh97z84j2On?auto=format&w=1920",
  contract: "0x306b1ea3ecdf94ab739f1910bbda052ed4a9f949",
};

export const getTokenData = async (contract, id, name) => {
  try {
    const [[tokenData], sales, transfers] = await Promise.all([
      getData(
        `https://api.reservoir.tools/tokens/v5?tokens=${contract}:${id}&includeAttributes=true`
      ),
      getData(`https://api.reservoir.tools/sales/v4?token=${contract}:${id}`),
      getData(
        `https://api.reservoir.tools/transfers/v2?token=${contract}:${id}`
      ),
    ]);

    const token = tokenData?.token;
    if (!token)
      throw new Error(`${name} #${id} does not exist in the collection.`);

    const isFlagged = token.isFlagged ? "⚠️" : "";
    const links = `[OpenSea](${url.opensea}/${contract}/${id}) | [LooksRare](${url.looksrare}/${contract}/${id}) | [X2Y2](${url.x2y2}/${contract}/${id}) | [Sudo](${url.sudo}/${contract}/${id}) | [Blur](${url.blur}/${token.owner}?contractAddress=${contract}) | [Gem](${url.gem}/${contract}/${id})`;
    const stats = sortStats(tokenData, sales, transfers);

    return [token, isFlagged, links, stats];
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
      value: `${trait.value}\n${toPercent(
        trait.tokenCount,
        size
      )}\n${traitPrice}`,
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

const sortStats = (tokenData, sales, transfers) => {
  const rarity =
    tokenData.token.rarityRank !== null
      ? `#${tokenData.token.rarityRank}`
      : "-";
  const list =
    tokenData.market.floorAsk.price !== null
      ? `⟠ ${toRound(tokenData.market.floorAsk.price.amount.native, 2)}`
      : "-";
  const lastSale = sales[0]
    ? `⟠ ${toRound(sales.at(0).price.amount.native, 2)}`
    : "-";

  const transferSet = new Set();
  transfers.forEach((transfer) => transferSet.add(transfer.to));
  const walletsHeld = transferSet.size;

  const duration = Date.now() / 1000 - transfers.at(0).timestamp;
  const holdTime = getHoldTime(duration);

  return `Rarity: ${rarity} | Listed: ${list} | Last Sale: ${lastSale}\nSales Made: ${sales.length} | Wallets Held: ${walletsHeld} | Hold Time: ${holdTime}`;
};

export const getParams = (query) => {
  return query.length !== 42 ? "name" : "contract";
};

export const getId = (embed, index = 1) => {
  const [{ data }] = embed;
  const name = data.author.name;
  return name.split(" ").at(index).slice(1);
};

export const getEmbedFields = (embed) => {
  const [{ data }] = embed;
  return data.fields;
};

export const getContract = (fields, i) => {
  return fields.at(i).value.slice(1, 43);
};

export const getMarketplace = (source) => {
  switch (source) {
    case "opensea.io":
      return " | <:OpenSeaLogo:862443378461638697>";
    case "looksrare.org":
      return " | <:looksblack:926045572903870494>";
    case "x2y2.io":
      return " | <:x2y2:1038761561839374398>";
    case "sudoswap.xyz":
      return " | <:sudoswap:1049617120092233749>";
    default:
      return "";
  }
};

const getHoldTime = (duration) => {
  const days = duration / 86_400;
  const dp = duration < 31_556_952 ? 0 : 1;
  const time = [
    [31_556_952, days / 365.2425, "year(s)"],
    [2_629_746, days / 30.436875, "month(s)"],
    [604_800, days / 7, "week(s)"],
    [86_400, days, "day(s)"],
    [3_600, days * 24, "hour(s)"],
    [60, days * 1_440, "minute(s)"],
    [1, days * 86_400, "second(s)"],
  ];

  for (const i of time)
    if (duration >= i.at(0)) return `${i.at(1).toFixed(dp)} ${i.at(2)}`;
};

export const toRound = (price, dp, strict = false) => {
  if (!price) return "-";
  if (Number.isInteger(price)) return price;
  if (price < 1 && !strict) dp += 1;
  return parseFloat(price.toFixed(dp));
};

export const toPercent = (part, whole) => {
  if (part > whole || !part) return "";
  return `(${toRound((part / whole) * 100, 1)}%)`;
};

export const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const randIndex = Math.floor(Math.random() * (i + 1));
    [array[i], array[randIndex]] = [array[randIndex], array[i]];
  }
  return array;
};
