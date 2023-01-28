import { getData } from "./fetch.js";

export const emoji = {
  eth: "<:eth:1061570848810602576>",
  weth: "<:weth:1061570477706985593>",
};

export const azukiInfo = {
  icon: "https://i.seadn.io/gae/H8jOCJuQokNqGBpkBN5wk1oZwO7LM8bNnrHCaekV2nKjnCqw6UB5oaH8XyNeBDj6bA_n1mjejzhFQUP3O1NfjFLHr3FOaeHcTOOT?auto=format&w=1920",
  contract: "0xed5af388653567af2f388e6224dc7c4b3241c544",
  profile: "https://www.azuki.com/collector",
};

export const beanzInfo = {
  icon: "https://i.seadn.io/gae/_R4fuC4QGYd14-KwX2bD1wf-AWjDF2VMabfqWFJhIgiN2FnAUpnD5PLdJORrhQ8gly7KcjhQZZpuzYVPF7CDSzsqmDh97z84j2On?auto=format&w=1920",
  contract: "0x306b1ea3ecdf94ab739f1910bbda052ed4a9f949",
};

export const isVerified = (verificationStatus, customEmoji = false) => {
  if (verificationStatus !== "verified" && verificationStatus !== "approved")
    return "";

  switch (customEmoji) {
    case true:
      return "<a:verified:1036933625289134100>";
    case false:
      return "✅";
  }
};

export const getTokenData = async (contract, id, tokenCount, name) => {
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

    return [
      token,
      isFlagged,
      getTokenTraits(token.attributes, tokenCount),
      getTokenMarketplaceLinks(contract, id),
      getTokenStats(tokenData, sales, transfers),
    ];
  } catch (error) {
    throw Error(error.message);
  }
};

const getTokenTraits = (traits, size) => {
  const traitFields = traits.map((trait) => {
    const traitPrice = trait.floorAskPrice
      ? `${emoji.eth}${toRound(trait.floorAskPrice, 2, true)}`
      : "";

    return {
      name: `${trait.key}`,
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

export const getTokenMarketplaceLinks = (contract, id) => {
  return `[OpenSea](https://opensea.io/assets/ethereum/${contract}/${id}) | [LooksRare](https://looksrare.org/collections/${contract}/${id}) | [X2Y2](https://x2y2.io/eth/${contract}/${id}) | [Sudoswap](https://sudoswap.xyz/#/item/${contract}/${id}) | [Gem](https://www.gem.xyz/asset/${contract}/${id})\n[Blur](https://blur.io/asset/${contract}/${id}) | [Reservoir](https://www.reservoir.market/${contract}/${id})`;
};

const getHoldTime = (duration) => {
  const days = duration / 86_400;
  const dp = duration < 31_556_952 ? 0 : 1;
  const timings = [
    [31_556_952, days / 365.2425, "year(s)"],
    [2_629_746, days / 30.436875, "month(s)"],
    [604_800, days / 7, "week(s)"],
    [86_400, days, "day(s)"],
    [3_600, days * 24, "hour(s)"],
    [60, days * 1_440, "minute(s)"],
    [1, days * 86_400, "second(s)"],
  ];

  for (const timing of timings)
    if (duration >= timing[0]) return `${timing[1].toFixed(dp)} ${timing[2]}`;
};

const getTokenStats = (tokenData, sales, transfers) => {
  const rarity =
    tokenData.token.rarityRank !== null
      ? `#${tokenData.token.rarityRank}`
      : "-";
  const listed =
    tokenData.market.floorAsk.price !== null
      ? `⟠ ${toRound(tokenData.market.floorAsk.price.amount.native, 2)}`
      : "-";
  const lastSale = sales[0]
    ? `⟠ ${toRound(sales[0].price.amount.native, 2)}`
    : "-";

  let salesMade = 0;
  sales.forEach((sale) => {
    if (sale.orderKind !== "mint") salesMade++;
  });

  const transferSet = new Set();
  transfers.forEach((transfer) => transferSet.add(transfer.to));
  const walletsHeld = transferSet.size;

  const duration = Date.now() / 1000 - transfers[0].timestamp;
  const holdTime = getHoldTime(duration);

  return `Rarity: ${rarity} | Listed: ${listed} | Last Sale: ${lastSale}\nSales Made: ${salesMade} | Wallets Held: ${walletsHeld} | Hold Time: ${holdTime}`;
};

export const getParams = (query) => {
  return query.length !== 42 ? "name" : "contract";
};

export const getId = (data, index = 1) => {
  return data.author.name.split(" ").at(index).slice(1);
};

export const getContract = (data) => {
  const fields = data.fields;
  const contract =
    fields.length === 13
      ? fields[9].value.slice(1, 43)
      : fields[3].value.slice(1, 43);

  return contract;
};

export const getMarketplaceLogo = (source) => {
  switch (source) {
    case "opensea.io":
      return " | <:opensea:1061571107888574544>";
    case "looksrare.org":
      return " | <:looksrare:1061571122111463514>";
    case "x2y2.io":
      return " | <:x2y2:1061571333600837643>";
    case "sudoswap.xyz":
      return " | <:sudo:1061570522447622205>";
    case "gem.xyz":
      return " | <:gem:1060644885612474439>";
    case "magically.gg":
      return " | <:magically:1068776103654727711>";
    case "reservoir.market":
    case "reservoir.tools":
      return " | <:reservoir:1061296995605676062>";
    default:
      return "";
  }
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
