import { getTraits, getOrders, getCollection, getOwners } from "./fetch.js";

const contract = {
  azuki: "0xed5af388653567af2f388e6224dc7c4b3241c544",
  beanz: "0x306b1ea3ecdf94ab739f1910bbda052ed4a9f949",
};

const azukiURL = {
  icon: "https://i.seadn.io/gae/H8jOCJuQokNqGBpkBN5wk1oZwO7LM8bNnrHCaekV2nKjnCqw6UB5oaH8XyNeBDj6bA_n1mjejzhFQUP3O1NfjFLHr3FOaeHcTOOT?auto=format&w=1920",
  opensea: `https://opensea.io/assets/ethereum/${contract.azuki}`,
  looksrare: `https://looksrare.org/collections/${contract.azuki}`,
  x2y2: `https://x2y2.io/eth/${contract.azuki}`,
  sudoswap: `https://sudoswap.xyz/#/item/${contract.azuki}`,
  gem: `https://www.gem.xyz/asset/${contract.azuki}`,
};

const beanzURL = {
  icon: "https://i.seadn.io/gae/_R4fuC4QGYd14-KwX2bD1wf-AWjDF2VMabfqWFJhIgiN2FnAUpnD5PLdJORrhQ8gly7KcjhQZZpuzYVPF7CDSzsqmDh97z84j2On?auto=format&w=1920",
  opensea: `https://opensea.io/assets/ethereum/${contract.beanz}`,
  looksrare: `https://looksrare.org/collections/${contract.beanz}`,
  x2y2: `https://x2y2.io/eth/${contract.beanz}`,
  sudoswap: `https://sudoswap.xyz/#/item/${contract.beanz}`,
  gem: `https://www.gem.xyz/asset/${contract.beanz}`,
};

const alignTraits = function (traits) {
  const paddingLength = 3 - (traits.length % 3);
  if (paddingLength === 3) return traits;
  const padding = new Array(paddingLength).fill({
    name: "\u200b",
    value: "\u200b",
    inline: true,
  });
  return traits.concat(padding);
};

export const azukiEmbed = async function (id) {
  const [traits, list, lastSale] = await Promise.all([
    getTraits(
      `https://ikzttp.mypinata.cloud/ipfs/QmQFkLSQysj94s5GvTHPyzTxrawwtjgiiYS2TBLgrvw8CW/${id}`
    ),
    getOrders(
      `https://api.reservoir.tools/orders/asks/v3?token=${contract.azuki}:${id}&sortBy=price`
    ),
    getOrders(
      `https://api.reservoir.tools/sales/v4?token=${contract.azuki}:${id}`
    ),
  ]);

  return [
    {
      color: 0xc13540,
      author: {
        name: `Azuki #${id}`,
        icon_url: `${azukiURL.icon}`,
      },
      fields: [
        ...alignTraits(traits),
        {
          name: "Links",
          value: `[OpenSea](${azukiURL.opensea}/${id}) | [LooksRare](${azukiURL.looksrare}/${id}) | [X2Y2](${azukiURL.x2y2}/${id}) | [SudoSwap](${azukiURL.sudoswap}/${id}) | [Gem](${azukiURL.gem}/${id})`,
        },
      ],
      image: {
        url: `https://ikzttp.mypinata.cloud/ipfs/QmYDvPAXtiJg7s8JdRBSLWdgSphQdac8j1YuQNNxcGE1hg/${id}.png`,
      },
      footer: {
        text: `Lowest List: ${list} | Last Sale: ${lastSale}`,
      },
    },
  ];
};

export const beanzEmbed = async function (id) {
  const [traits, list, lastSale] = await Promise.all([
    getTraits(
      `https://ikzttp.mypinata.cloud/ipfs/QmPZKyuRw4nQTD6S6R5HaNAXwoQVMj8YydDmad3rC985WZ/${id}`
    ),
    getOrders(
      `https://api.reservoir.tools/orders/asks/v3?token=${contract.beanz}:${id}&sortBy=price`
    ),
    getOrders(
      `https://api.reservoir.tools/sales/v4?token=${contract.beanz}:${id}`
    ),
  ]);

  return [
    {
      color: 0xc13540,
      author: {
        name: `Beanz #${id}`,
        icon_url: `${beanzURL.icon}`,
      },
      fields: [
        ...alignTraits(traits),
        {
          name: "Links",
          value: `[OpenSea](${beanzURL.opensea}/${id}) | [LooksRare](${beanzURL.looksrare}/${id}) | [X2Y2](${beanzURL.x2y2}/${id}) | [SudoSwap](${beanzURL.sudoswap}/${id}) | [Gem](${beanzURL.gem}/${id})`,
        },
      ],
      image: {
        url: `https://ikzttp.mypinata.cloud/ipfs/QmTRuWHr7bpqscUWFmhXndzf5AdQqkekhqwgbyJCqKMHrL/${id}.png`,
      },
      footer: {
        text: `Lowest List: ${list} | Last Sale: ${lastSale}`,
      },
    },
  ];
};

export const blueEmbed = function (id) {
  return [
    {
      color: 0xc13540,
      author: {
        name: `Azuki #${id} in Blue Twin Tiger Jacket`,
        icon_url: `${azukiURL.icon}`,
      },
      fields: [
        {
          name: "Links",
          value: `[OpenSea](${azukiURL.opensea}/${id}) | [LooksRare](${azukiURL.looksrare}/${id}) | [X2Y2](${azukiURL.x2y2}/${id}) | [SudoSwap](${azukiURL.sudoswap}/${id}) | [Gem](${azukiURL.gem}/${id})`,
        },
      ],
      image: {
        url: `https://azuki-jackets.s3.us-west-1.amazonaws.com/blue/${id}.png`,
      },
    },
  ];
};

export const redEmbed = function (id) {
  return [
    {
      color: 0xc13540,
      author: {
        name: `Azuki #${id} in Red Twin Tiger Jacket`,
        icon_url: `${azukiURL.icon}`,
      },
      fields: [
        {
          name: "Links",
          value: `[OpenSea](${azukiURL.opensea}/${id}) | [LooksRare](${azukiURL.looksrare}/${id}) | [X2Y2](${azukiURL.x2y2}/${id}) | [SudoSwap](${azukiURL.sudoswap}/${id}) | [Gem](${azukiURL.gem}/${id})`,
        },
      ],
      image: {
        url: `https://azuki-jackets.s3.us-west-1.amazonaws.com/red/${id}.png`,
      },
    },
  ];
};

export const pairEmbed = function (azukiId, beanzId) {
  return [
    {
      color: 0xc13540,
      author: {
        name: `Azuki #${azukiId} | Beanz #${beanzId}`,
        icon_url: `${azukiURL.icon}`,
      },
      fields: [
        {
          name: "Links to Azuki",
          value: `[OpenSea](${azukiURL.opensea}/${azukiId}) | [LooksRare](${azukiURL.looksrare}/${azukiId}) | [X2Y2](${azukiURL.x2y2}/${azukiId}) | [SudoSwap](${azukiURL.sudoswap}/${azukiId}) | [Gem](${azukiURL.gem}/${azukiId})`,
        },
        {
          name: "Links to Beanz",
          value: `[OpenSea](${beanzURL.opensea}/${beanzId}) | [LooksRare](${beanzURL.looksrare}/${beanzId}) | [X2Y2](${beanzURL.x2y2}/${beanzId}) | [SudoSwap](${beanzURL.sudoswap}/${beanzId}) | [Gem](${beanzURL.gem}/${beanzId})`,
        },
      ],
      image: {
        url: `https://azukiimagemaker.vercel.app/api/pairbeanz-prod?azukiId=${azukiId}&beanzId=${beanzId}`,
      },
      footer: {
        text: "Image may take some time to render",
      },
    },
  ];
};

export const findEmbed = async function (name) {
  const [data] = await getCollection(
    `https://api.reservoir.tools/collections/v5?name=${name}&limit=1`
  );
  const address = data.primaryContract;
  const [uniqueOwners, [dailySaleCount]] = await Promise.all([
    getOwners(
      `https://api.reservoir.tools/collections/${address}/owners-distribution/v1`
    ),
    getCollection(
      `https://api.reservoir.tools/collections/daily-volumes/v1?id=${address}&limit=1`
    ),
  ]);

  const slug = data.slug;
  const size = Number(data.tokenCount);
  const onSale = Number(data.onSaleCount);
  const symbol = data.floorAsk.price.currency.symbol;
  const website =
    data.externalUrl !== null ? `[Website](${data.externalUrl}) | ` : "";
  const verified = data.openseaVerificationStatus === "verified" ? "✅" : "";
  const royalties = data.royalties?.bps ? data.royalties.bps : 0;

  const volume = function (day) {
    return `${Math.round(data.volume[day]).toLocaleString("en-US")}`;
  };

  return [
    {
      color: 0x0267bc,
      author: {
        name: `${data.name} ${verified}`,
      },
      thumbnail: {
        url: `${data.image}`,
      },
      fields: [
        {
          name: "Collection Size",
          value: `${size.toLocaleString("en-US")}`,
          inline: true,
        },
        {
          name: "Active Listings",
          value: `${onSale.toLocaleString("en-US")} (${(
            (onSale / size) *
            100
          ).toFixed(1)}%)`,
          inline: true,
        },
        {
          name: "Royalties",
          value: `${royalties / 100}%`,
          inline: true,
        },
        {
          name: "Floor Price",
          value: `${data.floorAsk.price.amount.native.toFixed(2)} ${symbol}`,
          inline: true,
        },
        {
          name: "Unique Owners",
          value: `${uniqueOwners.toLocaleString("en-US")} (${(
            (uniqueOwners / size) *
            100
          ).toFixed(1)}%)`,
          inline: true,
        },
        {
          name: "Daily Sale Count",
          value: `${dailySaleCount.sales_count.toLocaleString("en-US")}`,
          inline: true,
        },
        {
          name: "Volume (1 / 7 / 30 / All-Time)",
          value: `${volume("1day")} ${symbol} / ${volume(
            "7day"
          )} ${symbol} / ${volume("30day")} ${symbol} / ${volume(
            "allTime"
          )} ${symbol}`,
          inline: false,
        },
        {
          name: "Contract Address",
          value: `[${address}](https://etherscan.io/address/${address})`,
          inline: false,
        },
        {
          name: "Links",
          value: `${website}[OpenSea](https://opensea.io/collection/${slug}) | [LooksRare](https://looksrare.org/collections/${address}) | [X2Y2](https://x2y2.io/collection/${slug}/items) | [SudoSwap](https://sudoswap.xyz/#/browse/buy/${address}) | [Gem](https://www.gem.xyz/collection/${slug}/)`,
        },
      ],
    },
  ];
};
