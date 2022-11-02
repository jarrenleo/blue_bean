export const url = {
  opensea: "https://opensea.io/assets/ethereum",
  looksrare: "https://looksrare.org/collections",
  x2y2: "https://x2y2.io/eth",
  sudo: "https://sudoswap.xyz/#/item",
  blur: "https://blur.io/",
  gem: "https://www.gem.xyz/asset",
  profile: "https://www.azuki.com/collector",
  azukiIcon:
    "https://i.seadn.io/gae/H8jOCJuQokNqGBpkBN5wk1oZwO7LM8bNnrHCaekV2nKjnCqw6UB5oaH8XyNeBDj6bA_n1mjejzhFQUP3O1NfjFLHr3FOaeHcTOOT?auto=format&w=1920",
  beanzIcon:
    "https://i.seadn.io/gae/_R4fuC4QGYd14-KwX2bD1wf-AWjDF2VMabfqWFJhIgiN2FnAUpnD5PLdJORrhQ8gly7KcjhQZZpuzYVPF7CDSzsqmDh97z84j2On?auto=format&w=1920",
  eth: "<:eth:1036195593728557106>",
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

export const roundPrice = function (price, dp) {
  if (Number.isInteger(price)) return price;
  if (price < 1) dp += 1;
  return parseFloat(price.toFixed(dp));
};

export const toPercent = function (numerator, denominator) {
  return roundPrice((numerator / denominator) * 100, 1);
};
