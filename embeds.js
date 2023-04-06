import {
  fetchData,
  getReservoirData,
  getReservoirOwners,
  getZerionData,
} from "./fetch.js";
import {
  emoji,
  azukiInfo,
  beanzInfo,
  isVerified,
  getTokenData,
  getAverage,
  getMarketplaceLogo,
  toFiat,
  toRound,
  toPercent,
  hasDBRecord,
} from "./helpers.js";

export const azukiEmbed = async (id, interaction) => {
  const [token, isFlagged, traits, links, stats] = await getTokenData(
    azukiInfo.contract,
    id
  );

  const jacketUrl = (interaction) =>
    `https://azuki-jackets.s3.us-west-1.amazonaws.com/${interaction}/${id}.png`;
  const azukiPairingUrl = (interaction) =>
    `https://azuki-pairing-images.s3.us-west-1.amazonaws.com/equip_${interaction}/${id}.png`;
  const hoodieUrl = (interaction) =>
    `https://azukibuilder.vercel.app/api/build_s1_azuki?azukiId=${id}&equip=%22ambush-${interaction}%22`;

  const options = {
    azuki: azukiInfo.image(id),
    profile: `https://azk.imgix.net/big_azukis/a-${id}.png`,
    dragon: `https://azk.imgix.net/dragon_azukis/ikz1_${id}.png?w=4000`,
    blue: jacketUrl(interaction),
    red: jacketUrl(interaction),
    rbr: azukiPairingUrl(interaction),
    santa: azukiPairingUrl(interaction),
    white: hoodieUrl(interaction),
    black: hoodieUrl(interaction),
    bblue: hoodieUrl(interaction),
    bred: hoodieUrl(interaction),
    bwater: hoodieUrl(interaction),
    bfire: hoodieUrl(interaction),
    bearth: hoodieUrl(interaction),
    belectric: hoodieUrl(interaction),
    gold: hoodieUrl(interaction),
    spirit: hoodieUrl(interaction),
  };

  return [
    {
      color: 0x0267bc,
      author: {
        name: `Azuki #${id} ${isFlagged}`,
        icon_url: azukiInfo.icon,
      },
      description: `[Azuki Collector's Profile](${azukiInfo.profile}/${token.owner})`,
      fields: [
        ...traits,
        {
          name: "Marketplace Links",
          value: links,
        },
      ],
      image: {
        url: options[`${interaction}`],
      },
      footer: {
        text: stats,
      },
    },
  ];
};

export const beanzEmbed = async (id, interaction) => {
  const [token, isFlagged, traits, links, stats] = await getTokenData(
    beanzInfo.contract,
    id
  );

  const beanzUrl = (type = "", query = "") =>
    `https://azkimg.imgix.net/images${type}/final-${id}.png${query}`;
  const beanzPairingUrl = (type) =>
    `https://azuki-pairing-images.s3.us-west-1.amazonaws.com/beanz_equip_${type}/${id}.png`;

  const options = {
    beanz: beanzUrl(),
    transparent: beanzUrl("_no_bg"),
    selfie: beanzUrl("_squareface"),
    portrait: beanzUrl(
      "",
      "?fp-z=1.72&crop=focalpoint&fit=crop&fp-y=0.4&fp-x=0.505"
    ),
    beanz_santa: beanzPairingUrl("santa"),
  };

  return [
    {
      color: 0x0267bc,
      author: {
        name: `Beanz #${id} ${isFlagged}`,
        icon_url: beanzInfo.icon,
      },
      description: `[Beanz Collector's Profile](${azukiInfo.profile}/${token.owner})`,
      fields: [
        ...traits,
        {
          name: "Marketplace Links",
          value: links,
        },
      ],
      image: {
        url: options[`${interaction}`],
      },
      footer: {
        text: stats,
      },
    },
  ];
};

export const pairEmbed = async (azukiId, beanzId) => {
  const [[azukiData], [beanzData]] = await Promise.all([
    getReservoirData(
      `https://api.reservoir.tools/tokens/v5?tokens=${azukiInfo.contract}:${azukiId}`
    ),
    getReservoirData(
      `https://api.reservoir.tools/tokens/v5?tokens=${beanzInfo.contract}:${beanzId}`
    ),
  ]);

  return [
    {
      color: 0x0267bc,
      author: {
        name: `Azuki #${azukiId} | Beanz #${beanzId}`,
        icon_url: azukiInfo.icon,
      },
      description: `[Azuki Collector's Profile](${azukiInfo.profile}/${azukiData.token.owner}) | [Bean Collector's Profile](${azukiInfo.profile}/${beanzData.token.owner})`,
      image: {
        url: `https://azukiimagemaker.vercel.app/api/pairbeanz-prod?azukiId=${azukiId}&beanzId=${beanzId}`,
      },
      footer: {
        text: "Image may take some time to render",
      },
    },
  ];
};

export const collectionEmbed = async (contract) => {
  const [[data], [owners, topHolder]] = await Promise.all([
    getReservoirData(
      `https://api.reservoir.tools/collections/v5?contract=${contract}&includeTopBid=true&useNonFlaggedFloorAsk=true&limit=1`
    ),
    getReservoirOwners(
      `https://api.reservoir.tools/collections/${contract}/owners-distribution/v1`
    ),
  ]);

  const slug = data.slug;
  const supply = Number(data.tokenCount);
  const listings = Number(data.onSaleCount);
  const royalties = data.royalties?.bps ?? 0;

  const collectionFp = data.floorAsk.price?.amount.native;
  const floorPrice = `${toRound(collectionFp, 2)}${getMarketplaceLogo(
    data.floorAsk.sourceDomain
  )}`;

  const website = data.externalUrl ? `[Website](${data.externalUrl})` : "";
  const twitter = data.twitterUsername
    ? `[Twitter](https://twitter.com/${data.twitterUsername})`
    : "";
  const discord = data.discordUrl ? `[Discord](${data.discordUrl})` : "";
  const socialLinks =
    website || twitter || discord
      ? [website, twitter, discord].join(" ").trim().replaceAll(" ", " | ")
      : "-";

  return [
    {
      color: 0x0267bc,
      title: `${data.name} ${isVerified(data.openseaVerificationStatus, true)}`,
      thumbnail: {
        url: data.image,
      },
      timestamp: `${new Date(Date.now()).toISOString()}`,
      fields: [
        {
          name: "Supply",
          value: `${supply.toLocaleString("en-US")}`,
          inline: true,
        },
        {
          name: "Listings",
          value: `${listings.toLocaleString("en-US")} ${toPercent(
            listings,
            supply
          )}`,
          inline: true,
        },
        {
          name: "Royalties",
          value: `${royalties / 100}%`,
          inline: true,
        },
        {
          name: "Owners",
          value: `${owners.toLocaleString("en-US")} ${toPercent(
            owners,
            supply
          )}`,
          inline: true,
        },
        {
          name: "Floor Price",
          value: `${emoji.eth}${floorPrice}`,
          inline: true,
        },
        {
          name: "Total Volume",
          value: `${emoji.eth}${Math.round(data.volume.allTime).toLocaleString(
            "en-US"
          )}`,
          inline: true,
        },
        {
          name: "Top Holder",
          value: `${topHolder.toLocaleString("en-US")} ${toPercent(
            topHolder,
            supply
          )}`,
          inline: true,
        },
        {
          name: "Top Bid",
          value: `${emoji.weth}${toRound(
            data.topBid.price?.amount.native,
            2
          )}${getMarketplaceLogo(data.topBid?.sourceDomain)}`,
          inline: true,
        },
        {
          name: "\u200b",
          value: "\u200b",
          inline: true,
        },
        {
          name: "Contract Address",
          value: `[${contract}](https://etherscan.io/address/${contract})`,
        },
        {
          name: "Social Links",
          value: `${socialLinks}`,
        },
        {
          name: "Marketplace Links",
          value: `[OpenSea](https://opensea.io/collection/${slug}) | [OpenSea Pro](https://pro.opensea.io/collection/${slug}) | [LooksRare](https://looksrare.org/collections/${contract}) | [X2Y2](https://x2y2.io/collection/${contract}) | [Sudoswap](https://sudoswap.xyz/#/browse/buy/${contract}) | [Blur](https://blur.io/collection/${contract})\n[Magically](https://magically.gg/collection/${contract}) | [Reservoir](https://www.reservoir.market/collections/${contract})`,
        },
      ],
    },
  ];
};

export const tokenEmbed = async (contract, id) => {
  try {
    const [token, isFlagged, traits, links, stats] = await getTokenData(
      contract,
      id
    );

    return [
      {
        color: 0x0267bc,
        author: {
          name: `${token.collection.name} #${id} ${isFlagged}`,
          icon_url: token.collection.image,
        },
        fields: [
          ...traits,
          {
            name: "Marketplace Links",
            value: links,
          },
        ],
        image: {
          url: token.image,
        },
        footer: {
          text: stats,
        },
      },
    ];
  } catch (error) {
    throw Error(error.message);
  }
};

export const listingsEmbed = async (contract, name, links) => {
  const listings = await getReservoirData(
    `https://api.reservoir.tools/orders/asks/v4?contracts=${contract}&status=active&includeCriteriaMetadata=true&sortBy=price&limit=10`
  );

  let tokens = "",
    listPrice = "",
    listExpire = "";

  listings.forEach((listing) => {
    tokens += `${listing.criteria.data.token.name}\n\n`;

    listPrice += `${emoji.eth}${toRound(
      listing.price.amount.native,
      2
    )}${getMarketplaceLogo(listing.source.domain)}\n\n`;

    const timestamp = listing.validUntil
      ? `<t:${listing.validUntil}:R>\n\n`
      : "-\n\n";
    listExpire += timestamp;
  });

  return [
    {
      color: 0x0267bc,
      title: name,
      thumbnail: {
        url: listings[0].criteria.data.collection.image,
      },
      timestamp: `${new Date(Date.now()).toISOString()}`,
      fields: [
        {
          name: "Tokens",
          value: tokens,
          inline: true,
        },
        {
          name: "List Price",
          value: listPrice,
          inline: true,
        },
        {
          name: "List Expire",
          value: listExpire,
          inline: true,
        },
        {
          name: "Collection Address",
          value: `[${contract}](https://etherscan.io/address/${contract})`,
        },
        ...links,
      ],
    },
  ];
};

export const monitorEmbed = (token) => {
  const tokenInfo =
    token.contract === azukiInfo.contract ? azukiInfo : beanzInfo;
  const id = token.criteria.data.token.tokenId;
  const image =
    token.contract === azukiInfo.contract
      ? azukiInfo.image(id)
      : beanzInfo.image(id);

  return [
    {
      color: 0x0267bc,
      author: {
        name: `${tokenInfo.name} #${id}`,
        icon_url: tokenInfo.icon,
      },
      description: `[Collector's Profile](${azukiInfo.profile}/${token.maker})`,
      fields: [
        {
          name: "List Price",
          value: `${emoji.eth}${toRound(
            token.price.amount.native,
            2
          )}${getMarketplaceLogo(token.source.domain)}`,
        },
        {
          name: "List Expire",
          value: `<t:${token.expiration}:F> | <t:${token.expiration}:R>`,
        },
        {
          name: "Marketplace Link",
          value: `[${token.source.name}](${token.source.url})`,
          inline: false,
        },
      ],
      image: {
        url: image,
      },
      footer: {
        icon_url:
          "https://cdn.discordapp.com/attachments/957980880251531264/1063870693193830420/BLUEBEAN.gif",
        text: "Powered by Blue Bean",
      },
      timestamp: new Date(Date.now()).toISOString(),
    },
  ];
};

export const profitEmbed = async (contract, userId, db) => {
  try {
    const hasProfitRecord = await hasDBRecord(db, { userId: userId });
    const wallets = hasProfitRecord?.wallets;

    if (!wallets?.length) throw new Error("Wallet list not found ❌");

    const promises = wallets.map((wallet) =>
      getZerionData(
        `https://api.zerion.io/v1/wallets/${wallet}/transactions/?currency=eth&filter[search_query]=${contract}&filter[operation_types]=mint,trade`
      )
    );
    const datasets = await Promise.all([
      getReservoirData(
        `https://api.reservoir.tools/collections/v5?contract=${contract}&useNonFlaggedFloorAsk=true`
      ),
      fetchData(
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd",
        {}
      ),
      ...promises,
    ]);

    const [collectionData] = datasets[0];
    const fiatPrice = datasets[1].ethereum.usd;
    if (!collectionData?.id)
      throw new Error(
        "Collection not found. Please use autocomplete to best match your query."
      );

    let tokensMinted = 0,
      mintCosts = 0,
      mintGasCosts = 0;
    let tokensBought = 0,
      buyCosts = 0,
      buyGasCosts = 0;
    let tokensSold = 0,
      revenue = 0;

    for (let i = 2; i < datasets.length; i++) {
      const transactions = datasets[i].data;
      if (!transactions.length) continue;

      for (const transaction of transactions) {
        const attributes = transaction.attributes;
        const operationType = attributes.operation_type;
        const transfers = attributes.transfers;
        const fee = attributes.fee;

        switch (operationType) {
          case "mint":
            for (const transfer of transfers) {
              const mintFloat = transfer.quantity.float;

              if (transfer.nft_info) tokensMinted += mintFloat;
              if (transfer.fungible_info) mintCosts += mintFloat;
            }
            mintGasCosts += fee.quantity.float;
            break;
          case "trade":
            for (const transfer of transfers) {
              const tradeFloat = transfer.quantity.float;

              if (transfer.nft_info)
                switch (transfer.direction) {
                  case "in":
                    tokensBought += tradeFloat;
                    break;
                  case "out":
                    tokensSold += tradeFloat;
                }

              if (transfer.fungible_info) {
                const decimals = transfer.quantity.decimals;
                const tradeAmount =
                  decimals === 18
                    ? tradeFloat
                    : tradeFloat / 10 ** (18 - decimals);

                switch (transfer.direction) {
                  case "in":
                    revenue += tradeAmount;
                    break;
                  case "out":
                    buyCosts += tradeAmount;
                    buyGasCosts += fee.quantity.float;
                }
              }
            }
        }
      }
    }

    const avgMintCosts = getAverage(mintCosts, tokensMinted);
    const avgMintGasCosts = getAverage(mintGasCosts, tokensMinted);
    const avgBuyCosts = getAverage(buyCosts, tokensBought);
    const avgBuyGasCosts = getAverage(buyGasCosts, tokensBought);
    const avgRevenue = getAverage(revenue, tokensSold);

    const calculatedTokensHeld = tokensMinted + tokensBought - tokensSold;
    const tokensHeld = calculatedTokensHeld > 0 ? calculatedTokensHeld : 0;
    const floorPrice = collectionData.floorAsk.price?.amount.native;
    const currentValue = tokensHeld * floorPrice;

    const totalCosts = mintCosts + mintGasCosts + buyCosts + buyGasCosts;
    const realisedPnL = revenue - totalCosts;
    const potentialPnL = calculatedTokensHeld ? realisedPnL + currentValue : "";
    const ROI = realisedPnL
      ? `${toPercent(realisedPnL, totalCosts, true).slice(1, -1)}`
      : "-";

    const value = (calculatedData, price = fiatPrice) => {
      if (!calculatedData) return "-";

      return `${emoji.eth}${toRound(calculatedData, 2)} ($${toFiat(
        calculatedData,
        price
      ).toLocaleString("en-US")})`;
    };

    return [
      {
        color: 0x0267bc,
        title: `${collectionData.name} ${isVerified(
          collectionData.openseaVerificationStatus,
          true
        )}`,
        thumbnail: {
          url: collectionData.image,
        },
        description: `Showing profit & loss information from **${wallets.length}** wallet(s)`,
        fields: [
          {
            name: "Tokens Minted",
            value: tokensMinted,
            inline: true,
          },
          {
            name: "Mint Costs",
            value: value(mintCosts),
            inline: true,
          },
          {
            name: "Avg. Mint Costs",
            value: value(avgMintCosts),
            inline: true,
          },
          {
            name: "Mint Gas Costs",
            value: value(mintGasCosts),
            inline: true,
          },
          {
            name: "Avg. Mint Gas Costs",
            value: value(avgMintGasCosts),
            inline: true,
          },
          {
            name: "\u200b",
            value: "\u200b",
            inline: true,
          },
          {
            name: "Tokens Bought",
            value: tokensBought,
            inline: true,
          },
          {
            name: "Buy Costs",
            value: value(buyCosts),
            inline: true,
          },
          {
            name: "Avg. Buy Costs",
            value: value(avgBuyCosts),
            inline: true,
          },
          {
            name: "Buy Gas Costs",
            value: value(buyGasCosts),
            inline: true,
          },
          {
            name: "Avg. Buy Gas Costs",
            value: value(avgBuyGasCosts),
            inline: true,
          },
          {
            name: "\u200b",
            value: "\u200b",
            inline: true,
          },
          {
            name: "Tokens Sold",
            value: tokensSold,
            inline: true,
          },
          {
            name: "Revenue",
            value: value(revenue),
            inline: true,
          },
          {
            name: "Avg. Revenue",
            value: value(avgRevenue),
            inline: true,
          },
          {
            name: "Tokens Held",
            value: tokensHeld,
            inline: true,
          },
          {
            name: "Floor Price",
            value: `${value(floorPrice)}${getMarketplaceLogo(
              collectionData.floorAsk.sourceDomain
            )}`,
            inline: true,
          },
          {
            name: "Current Value",
            value: value(currentValue),
            inline: true,
          },
          {
            name: "Realised P&L",
            value: value(realisedPnL),
            inline: true,
          },
          {
            name: "Potential P&L",
            value: value(potentialPnL),
            inline: true,
          },
          {
            name: "ROI",
            value: ROI,
            inline: true,
          },
        ],
        footer: {
          icon_url:
            "https://cdn.discordapp.com/attachments/957980880251531264/1063870693193830420/BLUEBEAN.gif",
          text: "Powered by Blue Bean",
        },
        timestamp: new Date(Date.now()).toISOString(),
      },
    ];
  } catch (error) {
    throw Error(error.message);
  }
};
