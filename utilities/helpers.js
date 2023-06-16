export const isETHAddress = (query) => {
  if (query.length !== 42) return false;
  if (!query.match(/^0x[0-9a-fA-F]{40}$/)) return false;

  return true;
};

export const getQueryParams = (query) => {
  if (!isETHAddress(query)) return "name";
  return "contract";
};

export const isVerified = (status) => {
  if (status === "verified" || status === "approved") return "✅";
  return "";
};

export const round = (number, dp) => {
  if (number < 1) dp += 1;
  return parseFloat(number.toFixed(dp));
};

export const toPercent = (numerator, denominator) => {
  if (numerator > denominator) return "";
  return round((numerator / denominator) * 100, 1);
};

export const isAzukiCommunity = (slug) =>
  ["azuki", "beanzofficial"].includes(slug);

export const symbol = {
  eth: "<:eth:1061570848810602576>",
  weth: "<:weth:1061570477706985593>",
};

export const timeIntervals = [
  {
    unit: "year",
    seconds: 31_536_000,
  },
  {
    unit: "month",
    seconds: 2_628_000,
  },
  {
    unit: "week",
    seconds: 604_800,
  },
  {
    unit: "day",
    seconds: 86_400,
  },
  {
    unit: "hour",
    seconds: 3_600,
  },
  {
    unit: "minute",
    seconds: 60,
  },
  {
    unit: "second",
    seconds: 1,
  },
];
