import { getData, getOwners, refreshToken } from "./fetch.js";
import { url, sortTraits, roundPrice, toPercent } from "./helpers.js";

export const collectionEmbed = async function (data, contract) {
  const [uniqueOwners, [dailySaleCount]] = await Promise.all([
    getOwners(
      `https://api.reservoir.tools/collections/${contract}/owners-distribution/v1`
    ),
    getData(
      `https://api.reservoir.tools/collections/daily-volumes/v1?id=${contract}&limit=1`
    ),
  ]);

  const slug = data.slug;
  const size = Number(data.tokenCount);
  const listed = Number(data.onSaleCount);
  const verified =
    data.openseaVerificationStatus === "verified"
      ? "<a:verified:1036933625289134100>"
      : "";
  const royalties = data.royalties?.bps ? data.royalties.bps : 0;
  const dailySale = dailySaleCount?.sales_count
    ? dailySaleCount.sales_count
    : "-";
  const website =
    data.externalUrl !== null ? `[Website](${data.externalUrl}) | ` : "";
  const discord =
    data.discordUrl !== null ? `[Discord](${data.discordUrl}) | ` : "";

  const volume = function (day) {
    return `${Math.round(data.volume[day]).toLocaleString("en-US")}`;
  };

  return [
    {
      color: 0x0267bc,
      title: `${data.name} ${verified}`,
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
          value: `${listed.toLocaleString("en-US")} (${toPercent(
            listed,
            size
          )}%)`,
          inline: true,
        },
        {
          name: "Royalties",
          value: `${royalties / 100}%`,
          inline: true,
        },
        {
          name: "Floor Price",
          value: `${url.eth}${roundPrice(
            data.floorAsk.price.amount.native,
            2
          )}`,
          inline: true,
        },
        {
          name: "Unique Owners",
          value: `${uniqueOwners.toLocaleString("en-US")} (${toPercent(
            uniqueOwners,
            size
          )}%)`,
          inline: true,
        },
        {
          name: "Daily Sale Count",
          value: `${dailySale.toLocaleString("en-US")}`,
          inline: true,
        },
        {
          name: "Volume (1 / 7 / 30 / All-Time)",
          value: `${url.eth}${volume("1day")} /${url.eth}${volume("7day")} /${
            url.eth
          }${volume("30day")} /${url.eth}${volume("allTime")}`,
          inline: false,
        },
        {
          name: "Contract Address",
          value: `[${contract}](https://etherscan.io/address/${contract})`,
          inline: false,
        },
        {
          name: "Collection Links",
          value: `${website}${discord}[OpenSea](https://opensea.io/collection/${slug}) | [LooksRare](https://looksrare.org/collections/${contract}) | [X2Y2](https://x2y2.io/collection/${slug}/items) | [Sudo](https://sudoswap.xyz/#/browse/buy/${contract}) | [Blur](https://blur.io/collection/${slug}) | [Gem](https://www.gem.xyz/collection/${slug}/)`,
        },
        {
          name: "Tools",
          value: `[AlphaSharks](https://vue.alphasharks.io/collection/${contract}) | [NFTFlip](https://review.nftflip.ai/collection/${contract}) | [NFTNerds](https://nftnerds.ai/collection/${contract})`,
        },
      ],
    },
  ];
};

export const tokenEmbed = async function (commandName, data, id, contract) {
  try {
    const [tokenData] = await getData(
      `https://api.reservoir.tools/tokens/v5?tokens=${contract}:${id}&includeAttributes=true`
    );

    const token = tokenData?.token;
    if (!token)
      throw new Error(`${data.name} #${id} does not exist in the collection.`);

    let image = token?.image;

    if (commandName === "azuki")
      image = `https://ikzttp.mypinata.cloud/ipfs/QmYDvPAXtiJg7s8JdRBSLWdgSphQdac8j1YuQNNxcGE1hg/${id}.png`;
    if (commandName === "beanz")
      image = `https://ikzttp.mypinata.cloud/ipfs/QmTRuWHr7bpqscUWFmhXndzf5AdQqkekhqwgbyJCqKMHrL/${id}.png`;

    const attributes = token.attributes;
    if (!image || !attributes.length) {
      const response = await refreshToken(
        "https://api.reservoir.tools/tokens/refresh/v1",
        contract,
        id
      );
      if (response.status === 200)
        throw new Error(
          `Metadata not found for ${data.name} #${id}. A metadata refresh has been requested. Please try again in a few minutes.`
        );
    }

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

    return [
      {
        color: 0x0267bc,
        author: {
          name: `${token.collection.name} #${id} ${isFlagged}`,
          icon_url: `${token.collection.image}`,
        },
        fields: [
          ...sortTraits(attributes, Number(data.tokenCount)),
          {
            name: "Links",
            value: `[OpenSea](${url.opensea}/${contract}/${id}) | [LooksRare](${url.looksrare}/${contract}/${id}) | [X2Y2](${url.x2y2}/${contract}/${id}) | [Sudo](${url.sudo}/${contract}/${id}) | [Blur](${url.blur}/${token.owner}?contractAddress=${contract}) | [Gem](${url.gem}/${contract}/${id})`,
          },
        ],
        image: {
          url: `${image}`,
        },
        footer: {
          text: `Rarity: ${rarity} | List Price: ${list} | Last Sale: ${lastSale}`,
        },
      },
    ];
  } catch (error) {
    throw Error(error.message);
  }
};

export const othersEmbed = async function (commandName, azukiId, beanzId) {
  const options = {
    "blue-jacket": {
      name: `Azuki #${azukiId}`,
      icon: `${url.azukiIcon}`,
      url: `https://azuki-jackets.s3.us-west-1.amazonaws.com/blue/${azukiId}.png`,
    },
    "red-jacket": {
      name: `Azuki #${azukiId}`,
      icon: `${url.azukiIcon}`,
      url: `https://azuki-jackets.s3.us-west-1.amazonaws.com/red/${azukiId}.png`,
    },
    wallpaper: {
      name: `Azuki #${azukiId}`,
      icon: `${url.azukiIcon}`,
      url: `https://azk.imgix.net/big_azukis/a-${azukiId}.png`,
    },
    selfie: {
      name: `Beanz #${beanzId}`,
      icon: `${url.beanzIcon}`,
      url: `https://azkimg.imgix.net/images_squareface/final-${beanzId}.png`,
    },
    pair: {
      name: `Azuki #${azukiId} | Beanz #${beanzId}`,
      icon: `${url.azukiIcon}`,
      url: `https://azukiimagemaker.vercel.app/api/pairbeanz-prod?azukiId=${azukiId}&beanzId=${beanzId}`,
    },
  };

  return [
    {
      color: 0x0267bc,
      author: {
        name: `${options[`${commandName}`].name}`,
        icon_url: `${options[`${commandName}`].icon}`,
      },
      image: {
        url: `${options[`${commandName}`].url}`,
      },
    },
  ];
};
